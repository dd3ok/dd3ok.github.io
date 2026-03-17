import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const requiredFiles = [
  'out/index.html',
  'out/404.html',
  'out/ai-fitting/index.html',
  'out/_next',
]

const contentChecks = {
  'out/index.html': [
    '유인재입니다',
    'Projects',
    'Contact',
    'href="#projects"',
    'href="#contact"',
    'https://dd3ok.github.io/',
  ],
  'out/ai-fitting/index.html': [
    '입어보기+',
    '입어보기 결과',
    'https://dd3ok.github.io/ai-fitting',
  ],
}

const findInternalRouteHrefs = (pageContent) => {
  const hrefMatches = pageContent.matchAll(/href="([^"]+)"/g)
  const internalRoutes = new Set()

  for (const [, href] of hrefMatches) {
    if (!href.startsWith('/')) {
      continue
    }

    if (href.startsWith('/_next') || href.includes('.')) {
      continue
    }

    const [pathname] = href.split('#')

    if (!pathname) {
      continue
    }

    internalRoutes.add(pathname)
  }

  return internalRoutes
}

const toExportedHtmlPath = (pathname) => {
  if (pathname === '/') {
    return 'out/index.html'
  }

  return resolve('out', pathname.slice(1), 'index.html')
}

for (const relativePath of requiredFiles) {
  const absolutePath = resolve(relativePath)

  if (!existsSync(absolutePath)) {
    throw new Error(`Missing expected build output: ${relativePath}`)
  }
}

for (const [relativePath, expectedTexts] of Object.entries(contentChecks)) {
  const pageContent = readFileSync(resolve(relativePath), 'utf8')

  for (const text of expectedTexts) {
    if (!pageContent.includes(text)) {
      throw new Error(`${relativePath} is missing expected content: ${text}`)
    }
  }

  for (const pathname of findInternalRouteHrefs(pageContent)) {
    const exportedHtmlPath = toExportedHtmlPath(pathname)

    if (!existsSync(exportedHtmlPath)) {
      throw new Error(`${relativePath} references a missing exported route: ${pathname}`)
    }
  }
}

console.log('Static smoke check passed.')
