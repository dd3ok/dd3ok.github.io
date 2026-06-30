import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { Buffer } from 'node:buffer'
import ts from 'typescript'

const source = readFileSync('src/lib/notes.ts', 'utf8')
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText

const notesModule = await import(`data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`)

const notes = [
  {
    category: 'life',
    domain: 'ai',
    type: 'agent',
    tags: ['ai', 'tools', 'waitworthy'],
  },
  {
    category: 'business',
    domain: 'market',
    type: 'research',
    tags: ['business', 'strategy'],
  },
]

assert.equal(
  notesModule.getNotesForCategory(notes, notesModule.allNotesCategory).length,
  2,
  'all category should include every note',
)

assert.equal(
  notesModule.getNotesForCategory(notes, { id: 'life', title: 'Life', description: '' }).length,
  1,
  'exact category should include matching notes',
)

assert.equal(
  notesModule.getNotesForCategory(notes, {
    id: 'ai-tools',
    title: 'AI & Tools',
    description: '',
    aliases: ['ai', 'tools', 'agent'],
  }).length,
  0,
  'category counts should not be inflated by aliases, tags, domain, or type',
)

console.log('Notes category tests passed.')
