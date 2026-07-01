import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const requiredFiles = [
  'out/index.html',
  'out/404.html',
  'out/sitemap.xml',
  'out/agent-skills/index.html',
  'out/notes/index.html',
  'out/_next',
]

const absentFiles = [
  'out/notes/all/index.html',
]
const emptyPostRouteFile = 'out/notes/post/__empty__/index.html'

const contentChecks = {
  'out/index.html': [
    '<h1',
    'Projects',
    'Contact',
    'Lab',
    'href="#projects"',
    'href="#contact"',
    'https://dd3ok.github.io/',
    'Waitworthy',
    'who-am-ai',
    'Agent Skills',
    'href="/agent-skills/"',
    '경력, 프로젝트, 기술 스택을 대화형으로 확인할 수 있는 포트폴리오 Q&amp;A 에이전트',
    '커리어 기반 맞춤 답변',
    'https://github.com/dd3ok/who-am-ai',
  ],
  'out/agent-skills/index.html': [
    '<title>Open Source Agent Skills | dd3ok</title>',
    'Agent Skills',
    'Codex와 Claude Code에서 반복 작업을 줄이기 위해 만든 공개 스킬 저장소입니다.',
    'Finance API Skills',
    'Productivity Skills',
    'NaverStock API Skill',
    'WATCHLIST.md',
  ],
  'out/notes/index.html': [
    '<title>Waitworthy | dd3ok</title>',
    'Waitworthy',
    '전체',
    'href="/notes/"',
    '최근 노트',
  ],
  'out/notes/finance/index.html': [
    'Finance',
    'aria-current="page"',
    '아직 공개 노트가 없습니다.',
  ],
  'out/notes/ai-tools/index.html': [
    '전체',
    'href="/notes/"',
    'AI &amp; Tools',
  ],
}

const sitemapContentChecks = [
  '<loc>https://dd3ok.github.io/</loc>',
  '<loc>https://dd3ok.github.io/agent-skills/</loc>',
  '<loc>https://dd3ok.github.io/notes/</loc>',
  '<loc>https://dd3ok.github.io/notes/life/</loc>',
]

const absentContentChecks = {
  'out/index.html': [
    'page-enter',
    'Toys',
    'Who am AI',
    '채팅 AI',
    '이력서 에이전트',
    'https://github.com/dd3ok?tab=repositories&amp;q=skill',
    'AI Agent API Skills',
    'Finance API Skills',
    '토스증권 / 네이버증권 비공식 API 스킬 개발',
    'Claude Code, Codex 등 AI 코딩 에이전트를 위한 주식·자산 시장 데이터 비공식 API 툴링 세트',
    '바이낸스 Spot API 및 yfinance 연동 툴킷 구현',
    'LLM Context 절약을 위한 캐시 최적화 스킬 포함',
  ],
  'out/notes/index.html': [
    'page-enter',
    'glass-card p-5',
    'Waitworthy | dd3ok | dd3ok',
    'AI Research Wiki',
    '최신순으로 정리한 공개 노트입니다.',
    '>14</span>',
    'href="/notes/meta/"',
    'href="/notes/ai/"',
    'href="/notes/tools/"',
    '>Meta</h2>',
    '>Career</h2>',
    '>Decision</h2>',
    'href="/notes/all/"',
    'LLM, agents, AI workflows, prompts, productivity tools, product comparisons',
    '계속 읽기',
    '초안',
    '검토 완료',
    '계속 업데이트',
    '보관됨',
  ],
  'out/notes/ai-tools/index.html': [
    'page-enter',
    'AI 워크플로, 에이전트, 리서치 도구를 다룹니다.',
    '개 공개 노트',
    'href="/notes/all/"',
    'LLM, agents, AI workflows, prompts, productivity tools, product comparisons',
  ],
  'out/agent-skills/index.html': [
    'page-enter',
    'Open Source Agent Skills | dd3ok | dd3ok',
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
