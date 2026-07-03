import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const source = readFileSync('src/data/agentSkills.ts', 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
})

const sandbox = {
  exports: {},
  module: { exports: {} },
}

sandbox.module.exports = sandbox.exports

vm.runInNewContext(outputText, sandbox, {
  filename: 'src/data/agentSkills.ts',
})

const { agentSkills } = sandbox.module.exports
const failures = []

if (!Array.isArray(agentSkills) || agentSkills.length === 0) {
  failures.push('agentSkills must contain at least one item')
}

const marketDataCatalog = agentSkills.filter((skill) => skill.id === 'market-data-skills')

if (marketDataCatalog.length !== 1) {
  failures.push('agentSkills must expose exactly one market-data-skills catalog entry')
} else {
  const [skill] = marketDataCatalog

  if (skill.github !== 'https://github.com/dd3ok/market-data-skills') {
    failures.push('market-data-skills must link to https://github.com/dd3ok/market-data-skills')
  }

  if (skill.category !== 'finance') {
    failures.push('market-data-skills must stay in the finance category')
  }
}

const providerSkillIds = new Set([
  'naverstock-api-skill',
  'tossinvest-api-skill',
  'binance-api-skill',
  'yahoo-finance-market-skill',
  'upbit-read-api-skill',
])

for (const skill of agentSkills) {
  if (providerSkillIds.has(skill.id)) {
    failures.push(`${skill.id} should be represented by market-data-skills instead of a separate card`)
  }
}

const seenIds = new Set()
const seenGithubUrls = new Set()

for (const skill of agentSkills ?? []) {
  if (seenIds.has(skill.id)) {
    failures.push(`duplicate agent skill id: ${skill.id}`)
  }

  if (seenGithubUrls.has(skill.github)) {
    failures.push(`duplicate agent skill repository URL: ${skill.github}`)
  }

  seenIds.add(skill.id)
  seenGithubUrls.add(skill.github)
}

if (failures.length > 0) {
  throw new Error(`Agent skills data check failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
}

console.log('Agent skills data check passed.')
