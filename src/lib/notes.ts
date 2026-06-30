import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { noteCategories } from './note-categories'

export {
    allNotesCategory,
    getNoteCategoryById,
    getNotesForCategory,
    getStaticNoteCategorySlugs,
    noteCategories,
    noteFilterCategories,
    type NoteCategory,
} from './note-categories'

export type PublicNoteStatus = 'draft' | 'reviewed' | 'evergreen' | 'archived'

export interface PublicNote {
    slug: string
    title: string
    date: string
    updated?: string
    summary: string
    visibility: 'public'
    status: PublicNoteStatus
    category: string
    type?: string
    domain?: string
    tags: string[]
    sourceRepository?: string
    humanReviewed: boolean
    body: string
    readingTimeMinutes: number
}

type FrontmatterValue = string | string[]
type Frontmatter = Record<string, FrontmatterValue>

const notesDirectory = resolve(process.cwd(), 'src/content/notes')
const allowedStatuses = new Set<PublicNoteStatus>([
    'draft',
    'reviewed',
    'evergreen',
    'archived',
])

const stripQuotes = (value: string) => value.replace(/^['"]|['"]$/g, '')

const parseInlineArray = (value: string) => {
    if (!value.startsWith('[') || !value.endsWith(']')) {
        return undefined
    }

    return value
        .slice(1, -1)
        .split(',')
        .map((item) => stripQuotes(item.trim()))
        .filter(Boolean)
}

const parseFrontmatter = (frontmatterSource: string, fileName: string) => {
    const metadata: Frontmatter = {}
    let activeArrayKey: string | null = null

    for (const rawLine of frontmatterSource.split('\n')) {
        const line = rawLine.trim()

        if (!line) {
            continue
        }

        if (line.startsWith('- ')) {
            const activeArray = activeArrayKey ? metadata[activeArrayKey] : undefined

            if (!Array.isArray(activeArray)) {
                throw new Error(`${fileName} has an array item without a field name`)
            }

            activeArray.push(stripQuotes(line.slice(2)))
            continue
        }

        const separatorIndex = line.indexOf(':')

        if (separatorIndex === -1) {
            throw new Error(`${fileName} has malformed frontmatter: ${line}`)
        }

        const key = line.slice(0, separatorIndex).trim()
        const value = line.slice(separatorIndex + 1).trim()

        if (!value) {
            metadata[key] = []
            activeArrayKey = key
            continue
        }

        metadata[key] = parseInlineArray(value) ?? stripQuotes(value)
        activeArrayKey = null
    }

    return metadata
}

const getRequiredString = (metadata: Frontmatter, field: string, fileName: string) => {
    const value = metadata[field]

    if (typeof value !== 'string' || value.length === 0) {
        throw new Error(`${fileName} is missing required frontmatter field: ${field}`)
    }

    return value
}

const getOptionalString = (metadata: Frontmatter, field: string) => {
    const value = metadata[field]
    return typeof value === 'string' && value.length > 0 ? value : undefined
}

const getRequiredStringArray = (metadata: Frontmatter, field: string, fileName: string) => {
    const value = metadata[field]

    if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`${fileName} is missing required array field: ${field}`)
    }

    return value
}

const parseBoolean = (metadata: Frontmatter, field: string) => {
    const value = metadata[field]
    return typeof value === 'string' && value.toLowerCase() === 'true'
}

const publicCategoryIds = new Set(noteCategories.map((category) => category.id))
const rawTranscriptPatterns = [
    /^\s*(User|Assistant|System|Developer):/im,
    /<details\b/i,
    /<summary\b/i,
]

const estimateReadingTime = (body: string) => {
    const visibleText = body
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/[#>*_\-[\]()`]/g, ' ')
    const words = visibleText.trim().split(/\s+/).filter(Boolean)

    return Math.max(1, Math.ceil(words.length / 220))
}

export const parseNoteFile = (fileName: string, fileContent: string): PublicNote => {
    const normalizedContent = fileContent.replace(/\r\n/g, '\n')

    if (!normalizedContent.startsWith('---\n')) {
        throw new Error(`${fileName} must start with frontmatter`)
    }

    const closingIndex = normalizedContent.indexOf('\n---\n', 4)

    if (closingIndex === -1) {
        throw new Error(`${fileName} is missing a closing frontmatter fence`)
    }

    const metadata = parseFrontmatter(normalizedContent.slice(4, closingIndex), fileName)
    const body = normalizedContent.slice(closingIndex + 5).trim()
    const visibility = getRequiredString(metadata, 'visibility', fileName)
    const status = getRequiredString(metadata, 'status', fileName)
    const category = getRequiredString(metadata, 'category', fileName)
    const tags = getRequiredStringArray(metadata, 'tags', fileName)

    if (visibility !== 'public') {
        throw new Error(`${fileName} must be public to appear on dd3ok.github.io`)
    }

    if (!allowedStatuses.has(status as PublicNoteStatus)) {
        throw new Error(`${fileName} has unsupported status: ${status}`)
    }

    if (!publicCategoryIds.has(category)) {
        throw new Error(`${fileName} has unsupported public category: ${category}`)
    }

    if (tags.length < 2) {
        throw new Error(`${fileName} must include at least two tags`)
    }

    if (!parseBoolean(metadata, 'human_reviewed')) {
        throw new Error(`${fileName} must be human reviewed before publishing`)
    }

    for (const pattern of rawTranscriptPatterns) {
        if (pattern.test(body)) {
            throw new Error(`${fileName} looks like raw or private transcript content`)
        }
    }

    return {
        slug: fileName.replace(/\.md$/, ''),
        title: getRequiredString(metadata, 'title', fileName),
        date: getRequiredString(metadata, 'date', fileName),
        updated: getOptionalString(metadata, 'updated'),
        summary: getRequiredString(metadata, 'summary', fileName),
        visibility,
        status: status as PublicNoteStatus,
        category,
        type: getOptionalString(metadata, 'type'),
        domain: getOptionalString(metadata, 'domain'),
        tags,
        sourceRepository: getOptionalString(metadata, 'source_repository'),
        humanReviewed: true,
        body,
        readingTimeMinutes: estimateReadingTime(body),
    }
}

export const getPublicNotes = () => {
    if (!existsSync(notesDirectory)) {
        return []
    }

    return readdirSync(notesDirectory)
        .filter((fileName) => fileName.endsWith('.md'))
        .sort()
        .map((fileName) => {
            const filePath = join(notesDirectory, fileName)
            return parseNoteFile(fileName, readFileSync(filePath, 'utf8'))
        })
        .sort((first, second) => second.date.localeCompare(first.date))
}

export const getPublicNoteBySlug = (slug: string) => {
    return getPublicNotes().find((note) => note.slug === slug)
}

export const getPublicNoteSlugs = () => {
    return getPublicNotes().map((note) => note.slug)
}

export const getStaticNotePostSlugs = () => {
    return getPublicNoteSlugs()
}
