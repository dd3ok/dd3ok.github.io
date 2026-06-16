import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const notesDirectory = resolve('src/content/notes')
const requiredRouteFiles = [
  'src/app/notes/[category]/page.tsx',
]
const postRouteFile = 'src/app/notes/post/[slug]/page.tsx'
const forbiddenRouteFiles = [
  'src/app/notes/[slug]/page.tsx',
]
const notesDirectoryViewPath = resolve('src/app/notes/NotesDirectoryView.tsx')
const requiredFrontmatterFields = [
  'title',
  'date',
  'summary',
  'visibility',
  'status',
  'tags',
]

const parseFrontmatter = (content, fileName) => {
  if (!content.startsWith('---\n')) {
    throw new Error(`${fileName} must start with frontmatter`)
  }

  const closingIndex = content.indexOf('\n---\n', 4)

  if (closingIndex === -1) {
    throw new Error(`${fileName} is missing a closing frontmatter fence`)
  }

  const frontmatter = content.slice(4, closingIndex).split('\n')
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

      metadata[activeArrayKey].push(line.slice(2).replace(/^"|"$/g, ''))
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

    metadata[key] = value.replace(/^"|"$/g, '')
  }

  return metadata
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

const notesDirectoryViewSource = readFileSync(notesDirectoryViewPath, 'utf8')

if (!notesDirectoryViewSource.includes('/notes/post/${note.slug}/')) {
  throw new Error('Note detail links must use /notes/post/[slug]/')
}

const noteFiles = readdirSync(notesDirectory)
  .filter((fileName) => fileName.endsWith('.md'))
  .sort()

if (noteFiles.length > 0 && !existsSync(resolve(postRouteFile))) {
  throw new Error(`Missing required note post route file: ${postRouteFile}`)
}

for (const fileName of noteFiles) {
  const filePath = join(notesDirectory, fileName)
  const content = readFileSync(filePath, 'utf8')
  const metadata = parseFrontmatter(content, fileName)

  for (const field of requiredFrontmatterFields) {
    const value = metadata[field]

    if (Array.isArray(value) ? value.length === 0 : !value) {
      throw new Error(`${fileName} is missing required frontmatter field: ${field}`)
    }
  }

  if (metadata.visibility !== 'public') {
    throw new Error(`${fileName} must be public to appear on dd3ok.github.io`)
  }

  if (!['draft', 'reviewed', 'evergreen', 'archived'].includes(metadata.status)) {
    throw new Error(`${fileName} has unsupported status: ${metadata.status}`)
  }

  if (!Array.isArray(metadata.tags) || metadata.tags.length < 2) {
    throw new Error(`${fileName} must include at least two tags`)
  }
}

console.log(`Public notes check passed (${noteFiles.length} note${noteFiles.length === 1 ? '' : 's'}).`)
