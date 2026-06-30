import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const requiredFiles = [
  'out/index.html',
  'out/404.html',
  'out/sitemap.xml',
  'out/notes/index.html',
  'out/_next',
]

const absentFiles = [
  'out/notes/all/index.html',
]
const emptyPostRouteFile = 'out/notes/post/__empty__/index.html'

const contentChecks = {
  'out/index.html': [
    'Projects',
    'Contact',
    'href="#projects"',
    'href="#contact"',
    'https://dd3ok.github.io/',
    'Waitworthy',
    'who-am-ai',
    '경력, 프로젝트, 기술 스택을 대화형으로 확인할 수 있는 포트폴리오 Q&amp;A 에이전트',
    '커리어 기반 맞춤 답변',
    'https://github.com/dd3ok/who-am-ai',
  ],
  'out/notes/index.html': [
    'Waitworthy',
    '전체',
    'href="/notes/"',
    '최근 노트',
    'Life',
    'href="/notes/life/"',
    '최신순으로 정리한 공개 노트입니다.',
    '초안',
    'baby-naming',
    'korean-name',
    '+<!-- -->3',
    '계속 읽기',
  ],
  'out/notes/ai-tools/index.html': [
    '전체',
    'href="/notes/"',
    'AI &amp; Tools',
    'AI 워크플로, 에이전트, 리서치 도구를 다룹니다.',
    '아직 공개 노트가 없습니다.',
  ],
}

const sitemapContentChecks = [
  '<loc>https://dd3ok.github.io/</loc>',
  '<loc>https://dd3ok.github.io/agent-skills/</loc>',
  '<loc>https://dd3ok.github.io/notes/</loc>',
  '<loc>https://dd3ok.github.io/notes/life/</loc>',
  '<loc>https://dd3ok.github.io/notes/post/2026-06-17-korean-baby-naming-skill/</loc>',
]

const absentContentChecks = {
  'out/index.html': [
    'Who am AI',
    '채팅 AI',
    '이력서 에이전트',
    'AI Agent API Skills',
    'Finance API Skills',
    '토스증권 / 네이버증권 비공식 API 스킬 개발',
    'Claude Code, Codex 등 AI 코딩 에이전트를 위한 주식·자산 시장 데이터 비공식 API 툴링 세트',
    '바이낸스 Spot API 및 yfinance 연동 툴킷 구현',
    'LLM Context 절약을 위한 캐시 최적화 스킬 포함',
  ],
  'out/notes/index.html': [
    'href="/notes/ai-tools/"',
    'href="/notes/tech/"',
    'href="/notes/business/"',
    'href="/notes/finance/"',
    'href="/notes/learning/"',
    'href="/notes/health/"',
    'href="/notes/insights/"',
    'href="/notes/other/"',
    'href="/notes/meta/"',
    'href="/notes/ai/"',
    'href="/notes/tools/"',
    '>Meta</h2>',
    '>Career</h2>',
    '>Decision</h2>',
    'href="/notes/all/"',
    'LLM, agents, AI workflows, prompts, productivity tools, product comparisons',
  ],
  'out/notes/ai-tools/index.html': [
    'href="/notes/health/"',
    'href="/notes/insights/"',
    'href="/notes/other/"',
    'href="/notes/all/"',
    'LLM, agents, AI workflows, prompts, productivity tools, product comparisons',
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

for (const relativePath of absentFiles) {
  const absolutePath = resolve(relativePath)

  if (existsSync(absolutePath)) {
    throw new Error(`Unexpected build output exists: ${relativePath}`)
  }
}

if (existsSync(resolve(emptyPostRouteFile))) {
  const pageContent = readFileSync(resolve(emptyPostRouteFile), 'utf8')

  for (const text of ['No public notes yet', 'noindex']) {
    if (!pageContent.includes(text)) {
      throw new Error(`${emptyPostRouteFile} is missing expected empty-state content: ${text}`)
    }
  }
}

const sitemapContent = readFileSync(resolve('out/sitemap.xml'), 'utf8')

for (const text of sitemapContentChecks) {
  if (!sitemapContent.includes(text)) {
    throw new Error(`out/sitemap.xml is missing expected content: ${text}`)
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

for (const [relativePath, forbiddenTexts] of Object.entries(absentContentChecks)) {
  const pageContent = readFileSync(resolve(relativePath), 'utf8')

  for (const text of forbiddenTexts) {
    if (pageContent.includes(text)) {
      throw new Error(`${relativePath} should not include content: ${text}`)
    }
  }
}

console.log('Static smoke check passed.')
