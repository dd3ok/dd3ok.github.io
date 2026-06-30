import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const notesDirectory = resolve('src/content/notes')
const requiredRouteFiles = [
  'src/app/notes/[category]/page.tsx',
  'src/app/notes/post/[slug]/page.tsx',
]
const forbiddenRouteFiles = [
  'src/app/notes/[slug]/page.tsx',
]
const requiredFrontmatterFields = [
  'title',
  'date',
  'summary',
  'visibility',
  'status',
  'category',
  'human_reviewed',
  'tags',
]
const allowedCategories = new Set([
  'ai-tools',
  'tech',
  'business',
  'finance',
  'learning',
  'life',
  'health',
  'insights',
  'other',
])
const rawTranscriptPatterns = [
  /^\s*(User|Assistant|System|Developer):/im,
  /<details\b/i,
  /<summary\b/i,
]

const stripQuotes = (value) => value.replace(/^['"]|['"]$/g, '')

const parseInlineArray = (value) => {
  if (!value.startsWith('[') || !value.endsWith(']')) {
    return undefined
  }

  return value
    .slice(1, -1)
    .split(',')
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean)
}

const parseFrontmatter = (content, fileName) => {
  const normalizedContent = content.replace(/\r\n/g, '\n')

  if (!normalizedContent.startsWith('---\n')) {
    throw new Error(`${fileName} must start with frontmatter`)
  }

  const closingIndex = normalizedContent.indexOf('\n---\n', 4)

  if (closingIndex === -1) {
    throw new Error(`${fileName} is missing a closing frontmatter fence`)
  }

  const frontmatter = normalizedContent.slice(4, closingIndex).split('\n')
  const body = normalizedContent.slice(closingIndex + 5).trim()
  const metadata = {}
  let activeArrayKey = null

  for (const rawLine of frontmatter) {
    const line = rawLine.trim()

    if (!line) {
      continue
    }

    if (line.startsWith('- ')) {
      if (!activeArrayKey) {
        throw new Error(`${fileName} has an array item without a field name`)
      }

      metadata[activeArrayKey].push(stripQuotes(line.slice(2)))
      continue
    }

    const separatorIndex = line.indexOf(':')

    if (separatorIndex === -1) {
      throw new Error(`${fileName} has malformed frontmatter: ${line}`)
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()
    activeArrayKey = null

    if (!value) {
      metadata[key] = []
      activeArrayKey = key
      continue
    }

    metadata[key] = parseInlineArray(value) ?? stripQuotes(value)
  }

  return {
    body,
    metadata,
  }
}

if (!existsSync(notesDirectory)) {
  throw new Error('Missing public notes directory: src/content/notes')
}

for (const routeFile of requiredRouteFiles) {
  if (!existsSync(resolve(routeFile))) {
    throw new Error(`Missing required notes route file: ${routeFile}`)
  }
}

for (const routeFile of forbiddenRouteFiles) {
  if (existsSync(resolve(routeFile))) {
    throw new Error(`Forbidden mixed notes route file exists: ${routeFile}`)
  }
}

const noteFiles = readdirSync(notesDirectory)
  .filter((fileName) => fileName.endsWith('.md'))
  .sort()

for (const fileName of noteFiles) {
  const filePath = join(notesDirectory, fileName)
  const content = readFileSync(filePath, 'utf8')
  const { body, metadata } = parseFrontmatter(content, fileName)

  for (const field of requiredFrontmatterFields) {
    const value = metadata[field]

    if (Array.isArray(value) ? value.length === 0 : !value) {
      throw new Error(`${fileName} is missing required frontmatter field: ${field}`)
    }
  }

  if (metadata.visibility !== 'public') {
    throw new Error(`${fileName} must be public to appear on dd3ok.github.io`)
  }

  if (!allowedCategories.has(metadata.category)) {
    throw new Error(`${fileName} has unsupported public category: ${metadata.category}`)
  }

  if (!['draft', 'reviewed', 'evergreen', 'archived'].includes(metadata.status)) {
    throw new Error(`${fileName} has unsupported status: ${metadata.status}`)
  }

  if (!Array.isArray(metadata.tags) || metadata.tags.length < 2) {
    throw new Error(`${fileName} must include at least two tags`)
  }

  if (metadata.human_reviewed !== 'true') {
    throw new Error(`${fileName} must be human reviewed before publishing`)
  }

  for (const pattern of rawTranscriptPatterns) {
    if (pattern.test(body)) {
      throw new Error(`${fileName} looks like raw or private transcript content`)
    }
  }
}

console.log(`Public notes check passed (${noteFiles.length} note${noteFiles.length === 1 ? '' : 's'}).`)
