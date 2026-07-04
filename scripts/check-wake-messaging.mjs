import { existsSync, readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')

const homePage = read('src/app/page.tsx')
const contactForm = read('src/components/sections/ContactForm.tsx')
const aiChat = read('src/components/sections/AIChat.tsx')

const countMatches = (source, pattern) => Array.from(source.matchAll(pattern)).length

const extractBlockAfter = (source, marker) => {
  const markerIndex = source.indexOf(marker)

  if (markerIndex === -1) {
    return ''
  }

  const openBraceIndex = source.indexOf('{', markerIndex)

  if (openBraceIndex === -1) {
    return ''
  }

  let depth = 0

  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index]

    if (char === '{') {
      depth += 1
    }

    if (char === '}') {
      depth -= 1

      if (depth === 0) {
        return source.slice(openBraceIndex + 1, index)
      }
    }
  }

  return ''
}

const contactServerErrorBlock = extractBlockAfter(contactForm, 'if (status && status >= 500)')
const connectionStatusBlock = extractBlockAfter(aiChat, 'const connectionStatus = {')
const scheduleResponseTimeoutBlock = extractBlockAfter(aiChat, 'const scheduleResponseTimeout = useCallback')
const sendChatMessageBlock = extractBlockAfter(aiChat, 'const sendChatMessage = useCallback')
const wakeCopy = '외부 서비스가 wake up 중일 수 있습니다'
const chatSleepCopy = '서버가 sleep 상태에서 wake up 중일 수 있습니다'

const checks = [
  {
    name: 'home page does not mount proactive external health checks',
    passed: !homePage.includes('HealthcheckInitializer') && !homePage.includes('useHealthCheck'),
  },
  {
    name: 'external health check client files are not shipped',
    passed:
      !existsSync('src/components/HealthcheckInitializer.tsx') &&
      !existsSync('src/hooks/useHealthCheck.ts'),
  },
  {
    name: 'contact form keeps wake-up copy only inside server-error feedback',
    passed:
      countMatches(contactForm, /wake up/g) === 1 &&
      contactServerErrorBlock.includes(wakeCopy),
  },
  {
    name: 'AI chat idle connection status does not mention sleep or wake',
    passed:
      connectionStatusBlock.length > 0 &&
      !/(sleep|wake)/i.test(connectionStatusBlock),
  },
  {
    name: 'AI chat wake-up copy is limited to the timeout message',
    passed:
      aiChat.includes(chatSleepCopy) &&
      countMatches(aiChat, /<TimeoutMessage\b/g) === 1 &&
      aiChat.indexOf('{isTimeout && (') !== -1 &&
      aiChat.indexOf('<TimeoutMessage') > aiChat.indexOf('{isTimeout && ('),
  },
  {
    name: 'AI chat timeout state is set only by the response timeout timer',
    passed:
      countMatches(aiChat, /setIsTimeout\(true\)/g) === 1 &&
      scheduleResponseTimeoutBlock.includes('responseTimeoutRef.current = setTimeout') &&
      scheduleResponseTimeoutBlock.includes('setIsTimeout(true)'),
  },
  {
    name: 'AI chat response timeout is scheduled only as part of sending a message',
    passed:
      sendChatMessageBlock.includes('setLastUserMessage(content)') &&
      sendChatMessageBlock.includes('sendMessage(JSON.stringify') &&
      sendChatMessageBlock.includes('scheduleResponseTimeout()'),
  },
]

const failedChecks = checks.filter((check) => !check.passed)

if (failedChecks.length > 0) {
  throw new Error(
    `Wake messaging check failed:\n${failedChecks
      .map((check) => `- ${check.name}`)
      .join('\n')}`
  )
}

console.log('Wake messaging check passed.')
