import { existsSync, readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')

const files = {
  aiChat: 'src/components/sections/AIChat.tsx',
  session: 'src/components/sections/ai-chat/useChatSession.ts',
  messages: 'src/components/sections/ai-chat/ChatMessages.tsx',
  input: 'src/components/sections/ai-chat/ChatInput.tsx',
}

const missingFiles = Object.values(files).filter((path) => !existsSync(path))

const sources = Object.fromEntries(
  Object.entries(files).map(([name, path]) => [name, existsSync(path) ? read(path) : ''])
)

const checks = [
  {
    name: 'AI chat is split into session hook, messages, and input files',
    passed: missingFiles.length === 0,
  },
  {
    name: 'AIChat composes the extracted chat modules',
    passed:
      sources.aiChat.includes('@/components/sections/ai-chat/useChatSession') &&
      sources.aiChat.includes('@/components/sections/ai-chat/ChatMessages') &&
      sources.aiChat.includes('@/components/sections/ai-chat/ChatInput'),
  },
  {
    name: 'AIChat no longer owns websocket transport or markdown rendering',
    passed:
      !sources.aiChat.includes('react-use-websocket') &&
      !sources.aiChat.includes('react-markdown') &&
      !sources.aiChat.includes('remark-gfm') &&
      !sources.aiChat.includes('sendMessage(JSON.stringify'),
  },
  {
    name: 'useChatSession owns websocket transport and response timers',
    passed:
      sources.session.includes('react-use-websocket') &&
      sources.session.includes('loadChatSession') &&
      sources.session.includes('RESPONSE_TIMEOUT_MS') &&
      sources.session.includes('scheduleResponseTimeout'),
  },
  {
    name: 'ChatMessages owns assistant markdown rendering',
    passed:
      sources.messages.includes('react-markdown') &&
      sources.messages.includes('remark-gfm') &&
      sources.messages.includes('ReactMarkdown'),
  },
  {
    name: 'ChatInput owns the text form and submit button UI',
    passed:
      sources.input.includes('export default function ChatInput') &&
      sources.input.includes('<form') &&
      sources.input.includes('type="submit"'),
  },
]

const failedChecks = checks.filter((check) => !check.passed)

if (failedChecks.length > 0) {
  const missingFileMessage =
    missingFiles.length > 0 ? `\nMissing files:\n${missingFiles.map((path) => `- ${path}`).join('\n')}` : ''

  throw new Error(
    `AI chat architecture check failed:\n${failedChecks
      .map((check) => `- ${check.name}`)
      .join('\n')}${missingFileMessage}`
  )
}

console.log('AI chat architecture check passed.')
