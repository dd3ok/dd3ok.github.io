import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const defaultSourceDir = resolve('..', 'waitworthy', 'wiki')
const defaultTargetDir = resolve('src', 'content', 'notes')
const generatedSourceRepository = 'waitworthy'

const categoryMap = new Map([
  ['ai', 'ai-tools'],
  ['tools', 'ai-tools'],
  ['tech', 'tech'],
  ['business', 'business'],
  ['finance', 'finance'],
  ['learning', 'learning'],
  ['life', 'life'],
  ['health', 'health'],
  ['meta', 'insights'],
  ['other', 'other'],
])

const statusMap = new Map([
  ['raw', 'draft'],
  ['refined', 'reviewed'],
  ['verified', 'evergreen'],
  ['archived', 'archived'],
])

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
  const normalizedContent = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')

  if (!normalizedContent.startsWith('---\n')) {
    return {
      body: normalizedContent.trim(),
      metadata: {},
    }
  }

  const closingIndex = normalizedContent.indexOf('\n---\n', 4)

  if (closingIndex === -1) {
    throw new Error(`${fileName} is missing a closing frontmatter fence`)
  }

  const metadata = {}
  let activeArrayKey = null

  for (const rawLine of normalizedContent.slice(4, closingIndex).split('\n')) {
    const line = rawLine.trim()

    if (!line) {
      continue
    }

    if (line.startsWith('- ')) {
      if (!activeArrayKey || !Array.isArray(metadata[activeArrayKey])) {
        throw new Error(`${fileName} has an array item without a field name`)
      }

      metadata[activeArrayKey].push(stripQuotes(line.slice(2).trim()))
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
    body: normalizedContent.slice(closingIndex + 5).trim(),
    metadata,
  }
}

const escapeYamlString = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')

const toInlineArray = (values) => `[${values.map((value) => `"${escapeYamlString(value)}"`).join(', ')}]`

const unique = (values) => {
  const seen = new Set()
  const result = []

  for (const value of values) {
    const normalizedValue = String(value ?? '').trim()

    if (!normalizedValue || seen.has(normalizedValue)) {
      continue
    }

    seen.add(normalizedValue)
    result.push(normalizedValue)
  }

  return result
}

const extractHeadingTitle = (body) => {
  const match = body.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim()
}

const extractDatedSlugDate = (fileName) => {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-/)
  return match?.[1]
}

const extractSectionText = (body, heading) => {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const headingPattern = new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`)
  const startIndex = lines.findIndex((line) => headingPattern.test(line.trim()))

  if (startIndex === -1) {
    return undefined
  }

  const sectionLines = []

  for (const line of lines.slice(startIndex + 1)) {
    if (/^##\s+/.test(line.trim())) {
      break
    }

    sectionLines.push(line)
  }

  const text = sectionLines
    .join(' ')
    .replace(/[`*_#[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return text || undefined
}

const extractFallbackSummary = (body) => {
  return body
    .replace(/^---[\s\S]*?---/m, '')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith('- '))
}

const removePrivateRawBlocks = (body) => {
  return body
    .replace(/<details\b[\s\S]*?<\/details>/gi, '')
    .replace(/[A-Za-z]:[\\/]+Users[\\/]+[^\r\n]+/g, 'local uploaded file')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const getSourceTags = (metadata) => {
  const tags = metadata.tags

  if (Array.isArray(tags)) {
    return tags
  }

  if (typeof tags === 'string') {
    return [tags]
  }

  return []
}

const buildTags = ({ metadata, sourceCategory, publicCategory }) => {
  return unique([
    ...getSourceTags(metadata),
    sourceCategory,
    publicCategory,
    generatedSourceRepository,
  ])
}

const isGeneratedWaitworthyNote = (content) => {
  const normalizedContent = content.replace(/\r\n/g, '\n')
  const closingIndex = normalizedContent.startsWith('---\n')
    ? normalizedContent.indexOf('\n---\n', 4)
    : -1

  if (closingIndex === -1) {
    return false
  }

  return /^source_repository:\s*["']?waitworthy["']?\s*$/m.test(
    normalizedContent.slice(4, closingIndex),
  )
}

const toPublicNote = ({ sourceCategory, sourceFileName, sourceContent }) => {
  const { body, metadata } = parseFrontmatter(sourceContent, sourceFileName)
  const publicCategory = categoryMap.get(sourceCategory) ?? 'other'
  const publicStatus = statusMap.get(String(metadata.status ?? '').trim()) ?? 'draft'
  const publicBody = removePrivateRawBlocks(body)
  const title = metadata.title ?? extractHeadingTitle(publicBody) ?? sourceFileName.replace(/\.md$/, '')
  const date = metadata.date ?? extractDatedSlugDate(sourceFileName)

  if (!date) {
    throw new Error(`${sourceFileName} must include a date field or YYYY-MM-DD slug prefix`)
  }

  const summary = metadata.summary
    ?? extractSectionText(publicBody, '한 줄 요약')
    ?? extractFallbackSummary(publicBody)

  if (!summary) {
    throw new Error(`${sourceFileName} must include a summary or a readable first paragraph`)
  }

  const tags = buildTags({ metadata, sourceCategory, publicCategory })

  if (tags.length < 2) {
    throw new Error(`${sourceFileName} must produce at least two public tags`)
  }

  const frontmatter = [
    '---',
    `title: "${escapeYamlString(title)}"`,
    `date: "${escapeYamlString(date)}"`,
    `summary: "${escapeYamlString(summary)}"`,
    'visibility: "public"',
    `status: "${publicStatus}"`,
    `category: "${publicCategory}"`,
    'human_reviewed: true',
    `tags: ${toInlineArray(tags)}`,
    `source_repository: "${generatedSourceRepository}"`,
    '---',
  ].join('\n')

  return `${frontmatter}\n\n${publicBody.trim()}\n`
}

const listWaitworthyPages = (sourceDir) => {
  const pages = []

  for (const categoryEntry of readdirSync(sourceDir, { withFileTypes: true }).sort((first, second) => (
    first.name.localeCompare(second.name)
  ))) {
    if (!categoryEntry.isDirectory()) {
      continue
    }

    const sourceCategory = categoryEntry.name
    const categoryDir = join(sourceDir, sourceCategory)

    for (const fileEntry of readdirSync(categoryDir, { withFileTypes: true }).sort((first, second) => (
      first.name.localeCompare(second.name)
    ))) {
      if (!fileEntry.isFile() || !fileEntry.name.endsWith('.md') || fileEntry.name === 'README.md') {
        continue
      }

      pages.push({
        sourceCategory,
        sourceFileName: fileEntry.name,
        sourcePath: join(categoryDir, fileEntry.name),
      })
    }
  }

  return pages
}

const removeStaleGeneratedNotes = (targetDir) => {
  const removedFiles = []

  if (!existsSync(targetDir)) {
    return removedFiles
  }

  for (const fileEntry of readdirSync(targetDir, { withFileTypes: true })) {
    if (!fileEntry.isFile() || !fileEntry.name.endsWith('.md')) {
      continue
    }

    const filePath = join(targetDir, fileEntry.name)

    if (!isGeneratedWaitworthyNote(readFileSync(filePath, 'utf8'))) {
      continue
    }

    rmSync(filePath)
    removedFiles.push(fileEntry.name)
  }

  return removedFiles.sort()
}

export const syncWaitworthyNotes = ({ sourceDir = defaultSourceDir, targetDir = defaultTargetDir } = {}) => {
  if (!existsSync(sourceDir)) {
    throw new Error(`Missing Waitworthy wiki directory: ${sourceDir}`)
  }

  mkdirSync(targetDir, { recursive: true })

  const removedFiles = removeStaleGeneratedNotes(targetDir)
  const createdFiles = []
  const seenTargetFiles = new Set()

  for (const page of listWaitworthyPages(sourceDir)) {
    const targetFileName = basename(page.sourceFileName)

    if (seenTargetFiles.has(targetFileName)) {
      throw new Error(`Duplicate Waitworthy public note filename: ${targetFileName}`)
    }

    seenTargetFiles.add(targetFileName)

    const targetPath = join(targetDir, targetFileName)

    if (existsSync(targetPath)) {
      throw new Error(`${targetFileName} already exists and is not a generated Waitworthy note`)
    }

    const sourceContent = readFileSync(page.sourcePath, 'utf8')
    const publicNote = toPublicNote({
      sourceCategory: page.sourceCategory,
      sourceFileName: page.sourceFileName,
      sourceContent,
    })

    writeFileSync(targetPath, publicNote, 'utf8')
    createdFiles.push(targetFileName)
  }

  return {
    createdFiles: createdFiles.sort(),
    removedFiles,
  }
}

const parseArgs = (argv) => {
  const options = {
    sourceDir: process.env.WAITWORTHY_WIKI_DIR || defaultSourceDir,
    targetDir: process.env.WAITWORTHY_NOTES_TARGET_DIR || defaultTargetDir,
    optional: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--source') {
      options.sourceDir = resolve(argv[index + 1])
      index += 1
      continue
    }

    if (arg === '--target') {
      options.targetDir = resolve(argv[index + 1])
      index += 1
      continue
    }

    if (arg === '--optional') {
      options.optional = true
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const options = parseArgs(process.argv.slice(2))

  if (!existsSync(options.sourceDir) && options.optional) {
    console.log(`Waitworthy wiki directory not found, skipping import: ${options.sourceDir}`)
    process.exit(0)
  }

  const result = syncWaitworthyNotes(options)
  console.log(`Imported ${result.createdFiles.length} Waitworthy note${result.createdFiles.length === 1 ? '' : 's'}.`)

  if (result.removedFiles.length > 0) {
    console.log(`Removed ${result.removedFiles.length} stale generated note${result.removedFiles.length === 1 ? '' : 's'}.`)
  }
}
