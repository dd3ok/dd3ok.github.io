import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const requiredFiles = [
  'out/index.html',
  'out/404.html',
  'out/ai-fitting/index.html',
  'out/_next',
]

for (const relativePath of requiredFiles) {
  const absolutePath = resolve(relativePath)

  if (!existsSync(absolutePath)) {
    throw new Error(`Missing expected build output: ${relativePath}`)
  }
}

const homepage = readFileSync(resolve('out/index.html'), 'utf8')
const aiFittingPage = readFileSync(resolve('out/ai-fitting/index.html'), 'utf8')

const homepageChecks = [
  '유인재입니다',
  'Projects',
  'Contact',
  'href="#projects"',
  'href="#contact"',
  'https://dd3ok.github.io/',
]
const aiFittingChecks = [
  '입어보기+',
  '입어보기 결과',
  'https://dd3ok.github.io/ai-fitting',
]

for (const text of homepageChecks) {
  if (!homepage.includes(text)) {
    throw new Error(`Home page is missing expected content: ${text}`)
  }
}

for (const text of aiFittingChecks) {
  if (!aiFittingPage.includes(text)) {
    throw new Error(`AI fitting page is missing expected content: ${text}`)
  }
}

console.log('Static smoke check passed.')
