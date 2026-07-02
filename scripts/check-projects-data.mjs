import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const projectGroups = ['primary', 'related', 'supporting']
const projectGroupSet = new Set(projectGroups)

const loadPortfolioData = () => {
  const source = readFileSync('src/data/portfolio.ts', 'utf8')
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
    filename: 'src/data/portfolio.ts',
  })

  return sandbox.module.exports
}

const { projects } = loadPortfolioData()
const failures = []

if (!Array.isArray(projects) || projects.length === 0) {
  failures.push('projects must contain at least one item')
}

const projectsByGroup = new Map(projectGroups.map((group) => [group, []]))

for (const project of projects ?? []) {
  if (!projectGroupSet.has(project.displayGroup)) {
    failures.push(`${project.title} uses an invalid displayGroup: ${project.displayGroup}`)
    continue
  }

  projectsByGroup.get(project.displayGroup).push(project)

  if (!project.displayLabel?.trim()) {
    failures.push(`${project.title} must include a displayLabel`)
  }
}

if ((projectsByGroup.get('primary')?.length ?? 0) !== 1) {
  failures.push('projects must contain exactly one primary project')
}

if ((projectsByGroup.get('related')?.length ?? 0) === 0) {
  failures.push('projects must contain at least one related project')
}

if ((projectsByGroup.get('supporting')?.length ?? 0) === 0) {
  failures.push('projects must contain at least one supporting project')
}

if (failures.length > 0) {
  throw new Error(`Project data check failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
}

console.log('Project data check passed.')
