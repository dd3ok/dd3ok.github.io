import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export type PublicNoteStatus = 'draft' | 'reviewed' | 'evergreen' | 'archived'

export interface NoteCategory {
    id: string
    title: string
    description: string
    aliases?: string[]
}

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

export const noteCategories: NoteCategory[] = [
    {
        id: 'ai-tools',
        title: 'AI & Tools',
        description: 'AI 워크플로, 에이전트, 리서치 도구를 다룹니다.',
        aliases: ['ai', 'tools', 'ai-workflow', 'agent', 'agents'],
    },
    {
        id: 'tech',
        title: 'Tech',
        description: '개발, 인프라, 제품 구현 메모를 모읍니다.',
    },
    {
        id: 'business',
        title: 'Business',
        description: '시장, 사업 모델, 운영 관점의 리서치를 정리합니다.',
    },
    {
        id: 'finance',
        title: 'Finance',
        description: '투자, 금융 상품, 경제 흐름을 정리합니다.',
    },
    {
        id: 'learning',
        title: 'Learning',
        description: '학습 방법과 지식 정리 흐름을 다룹니다.',
    },
    {
        id: 'life',
        title: 'Life',
        description: '생활 의사결정과 실사용 리서치를 모읍니다.',
    },
    {
        id: 'health',
        title: 'Health',
        description: '건강, 운동, 장기 습관 리서치를 정리합니다.',
        aliases: ['health-longevity', 'longevity', 'exercise'],
    },
    {
        id: 'insights',
        title: 'Insights',
        description: '분류보다 생각의 전환이 중요한 메모를 모읍니다.',
        aliases: ['insight', 'research-notes', 'notes'],
    },
    {
        id: 'other',
        title: 'Other',
        description: '위 카테고리에 걸치지 않는 노트를 모읍니다.',
    },
]

export const allNotesCategory: NoteCategory = {
    id: 'all',
    title: '전체',
    description: '최신순으로 정리한 공개 노트입니다.',
}

export const noteFilterCategories: NoteCategory[] = [
    allNotesCategory,
    ...noteCategories,
]

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

export const getNotesForCategory = (notes: PublicNote[], category: NoteCategory) => {
    if (category.id === allNotesCategory.id) {
        return notes
    }

    return notes.filter((note) => note.category === category.id)
}

export const getNoteCategoryById = (id: string) => {
    return noteCategories.find((category) => category.id === id)
}

export const getStaticNoteCategorySlugs = () => {
    return noteCategories.map((category) => category.id)
}

export const getStaticNotePostSlugs = () => {
    return getPublicNoteSlugs()
}
