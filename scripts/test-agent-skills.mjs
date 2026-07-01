import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')

const agentSkills = read('src/data/agentSkills.ts')
const agentSkillsSection = read('src/components/sections/AgentSkillsSection.tsx')
const agentSkillsPage = read('src/app/agent-skills/page.tsx')
const types = read('src/types/index.ts')

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const skillIds = [...agentSkills.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1])
const indexOfSkill = (id) => skillIds.indexOf(id)

const generalSkillIds = [
  'newbie-lens',
  'document-briefing-cache-skill',
  'watchlist-md',
  'savepoint',
  'rabbit-hole',
  'lucid',
]

const financeSkillIds = [
  'naverstock-api-skill',
  'tossinvest-api-skill',
]

const removedSkillIds = [
  'new-session-handoff-skill',
  'naverfinance-api-skill',
  'binance-api-skill',
  'yahoo-finance-market-skill',
]

for (const id of [...generalSkillIds, ...financeSkillIds]) {
  assert(indexOfSkill(id) !== -1, `Missing agent skill entry: ${id}`)
}

for (const id of removedSkillIds) {
  assert(indexOfSkill(id) === -1, `Removed agent skill should not be listed: ${id}`)
}

const firstFinanceIndex = Math.min(...financeSkillIds.map(indexOfSkill))

for (const id of generalSkillIds) {
  assert(indexOfSkill(id) < firstFinanceIndex, `General skill should appear before finance skills: ${id}`)
}

assert(!agentSkills.includes("category: 'finance'"), 'Agent skill data should not classify finance skills separately')
assert(!agentSkills.includes("category: 'productivity'"), 'Agent skill data should not classify productivity skills separately')
assert(!types.includes("category: 'finance' | 'productivity'"), 'AgentSkill type should not expose finance/productivity categories')
assert(!agentSkillsSection.includes('Finance API Skills'), 'Agent skills page should not render a separate finance section')
assert(!agentSkillsSection.includes('Productivity Skills'), 'Agent skills page should not render a separate productivity section')
assert(agentSkillsSection.includes('href="/"'), 'Agent skills page should include a home/back link')
assert(agentSkillsSection.includes('홈으로'), 'Agent skills page should label the back link in Korean')
assert(agentSkillsSection.includes('agentSkills.map'), 'Agent skills page should render a single flat skill list')
assert(agentSkillsPage.includes("import { agentSkills }"), 'Agent skills metadata should reuse the shared data catalog')
assert(agentSkillsPage.includes('agentSkills.map'), 'Agent skills JSON-LD should be generated from the shared data catalog')

console.log('Agent skills catalog tests passed.')
