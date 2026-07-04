import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const read = (path) => readFileSync(path, 'utf8')
const collectSourceFiles = (directory) => {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    const stats = statSync(path)

    if (stats.isDirectory()) {
      return collectSourceFiles(path)
    }

    return /\.(tsx?|css)$/.test(entry) ? [path] : []
  })
}

const layout = read('src/app/layout.tsx')
const globals = read('src/app/globals.css')
const postcss = read('postcss.config.mjs')
const hero = read('src/components/sections/HeroSection.tsx')
const button = read('src/components/ui/Button.tsx')
const navigation = read('src/components/layout/Navigation.tsx')
const projectGallery = read('src/components/sections/ProjectGallery.tsx')
const pagesSection = read('src/components/sections/PagesSection.tsx')
const contactForm = read('src/components/sections/ContactForm.tsx')
const aiChatSession = read('src/components/sections/ai-chat/useChatSession.ts')
const aiChatMessages = read('src/components/sections/ai-chat/ChatMessages.tsx')
const aiChatInput = read('src/components/sections/ai-chat/ChatInput.tsx')
const notesDirectory = read('src/app/notes/NotesDirectoryView.tsx')
const tailwind = read('tailwind.config.mjs')
const card = read('src/components/ui/Card.tsx')
const portfolioData = read('src/data/portfolio.ts')
const sourceBundle = collectSourceFiles('src')
  .map((path) => read(path))
  .join('\n')
const removedTailwindUtilities = [
  'bg-opacity-',
  'text-opacity-',
  'border-opacity-',
  'divide-opacity-',
  'ring-opacity-',
  'placeholder-opacity-',
  'flex-shrink-',
  'flex-grow-',
  'overflow-ellipsis',
  'decoration-slice',
  'decoration-clone',
]
const renamedTailwindUtilities = [
  'shadow-sm',
  'outline-none',
]
const hasBareRingUtility = /(?<![-\w])(?:[a-z-]+:)*ring(?![-\w])/.test(sourceBundle)
const hasBareRoundedUtility = /(?<![-\w])!?(?:[a-z-]+:)*rounded(?![-\w])/.test(sourceBundle)
const hasBareBackdropBlurUtility = /(?<![-\w])!?(?:[a-z-]+:)*backdrop-blur(?![-\w])/.test(sourceBundle)

const findCssBlockRange = (source, marker) => {
  const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const markerRegex = new RegExp(`^[ \\t]*${escapedMarker}(?=\\s*\\{)`, 'm')
  const markerMatch = source.match(markerRegex)

  if (!markerMatch) {
    return null
  }

  const markerIndex = markerMatch.index
  const openBraceIndex = source.indexOf('{', markerIndex + markerMatch[0].length)
  if (openBraceIndex === -1) {
    return null
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
        return {
          blockStart: markerIndex,
          contentStart: openBraceIndex + 1,
          contentEnd: index,
          blockEnd: index + 1,
        }
      }
    }
  }

  return null
}

const extractCssBlock = (source, marker) => {
  const range = findCssBlockRange(source, marker)

  if (!range) {
    return ''
  }

  return source.slice(range.contentStart, range.contentEnd)
}

const removeCssBlock = (source, marker) => {
  const range = findCssBlockRange(source, marker)

  if (!range) {
    return source
  }

  return `${source.slice(0, range.blockStart)}${source.slice(range.blockEnd)}`
}

const hasUniversalSpacingReset = (source) => (
  Array.from(source.matchAll(/\*\s*\{([^}]*)\}/g)).some(([, ruleBody]) => {
    const hasZeroMargin = /(?:^|;)\s*margin\s*:\s*0(?:[a-z]+|%)?\s*(?:;|$)/.test(ruleBody)
    const hasZeroPadding = /(?:^|;)\s*padding\s*:\s*0(?:[a-z]+|%)?\s*(?:;|$)/.test(ruleBody)

    return hasZeroMargin && hasZeroPadding
  })
)

const baseLayerCss = extractCssBlock(globals, '@layer base')
const globalsWithoutBaseLayer = removeCssBlock(globals, '@layer base')
const hasLayeredUniversalReset = hasUniversalSpacingReset(baseLayerCss)
const hasUnlayeredUniversalReset = hasUniversalSpacingReset(globalsWithoutBaseLayer)
const universalResetDetectorHandlesReorderedDeclarations =
  hasUniversalSpacingReset('* { padding: 0; margin: 0; }')
const universalResetDetectorHandlesCompactRules =
  hasUniversalSpacingReset('body{color:red}*{padding:0;margin:0}')
const universalResetDetectorHandlesZeroUnits =
  hasUniversalSpacingReset('* { padding: 0rem; margin: 0px; }')
const universalResetDetectorRequiresBothSpacingDeclarations =
  !hasUniversalSpacingReset('* { padding: 0; }') &&
  !hasUniversalSpacingReset('* { margin: 0; }')

const reducedMotionCss = extractCssBlock(globals, '@media (prefers-reduced-motion: reduce)')
const hasReducedMotionQuery = reducedMotionCss.length > 0
const buttonBaseClasses = button.match(/const baseClasses = '([^']+)'/)?.[1] ?? ''
const buttonPrimaryVariantClass = button.match(/primary:\s*(['"`])([\s\S]*?)\1/)?.[2] ?? ''
const navigationHasScrollListener = /window\s*\.\s*addEventListener\s*\(\s*['"]scroll['"]/.test(navigation)
const projectGalleryDemoLinkClass =
  projectGallery.match(/href=\{project\.demo\}[\s\S]*?className="([^"]+)"/)?.[1] ?? ''
const pagesSectionActiveLinkClass =
  pagesSection.match(/href=\{service\.path\}[\s\S]*?className="([^"]+)"/)?.[1] ?? ''
const contactFormSubmitButtonClass =
  contactForm.match(/type="submit"[\s\S]*?className="([^"]+)"/)?.[1] ?? ''
const aiChatRetryButtonClass =
  aiChatMessages.match(/onClick=\{onRetry\}[\s\S]*?className="([^"]+)"/)?.[1] ?? ''
const aiChatSubmitButtonClass =
  aiChatInput.match(/type="submit"[\s\S]*?className="([^"]+)"[\s\S]*?disabled=\{!canSend\}/)?.[1] ?? ''
const hasUseStateTuple = (source, stateName, setterName) =>
  new RegExp(`const\\s*\\[\\s*${stateName}\\s*,\\s*${setterName}\\s*\\]\\s*=\\s*useState`).test(source)
const matchesLoadingDotsExpression = (source, stateName) =>
  new RegExp(`\\{\\s*${stateName}\\s*&&\\s*!isTimeout\\s*&&\\s*\\([\\s\\S]*?<LoadingDots\\s*/>`).test(source)
const aiChatResponseTimeoutBody =
  aiChatSession.match(/responseTimeoutRef\.current\s*=\s*setTimeout\(\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*RESPONSE_TIMEOUT_MS\s*\)/)?.[1] ?? ''
const aiChatSubmitButtonBlock =
  aiChatInput.match(/<button\b(?:(?!<\/button>)[\s\S])*?type="submit"(?:(?!<\/button>)[\s\S])*?<\/button>/)?.[0] ?? ''
const aiChatLoadingDotsUseFirstTokenState =
  hasUseStateTuple(aiChatSession, 'isAwaitingFirstToken', 'setIsAwaitingFirstToken') &&
  /setIsAwaitingFirstToken\s*\(\s*false\s*\)/.test(aiChatSession) &&
  matchesLoadingDotsExpression(aiChatMessages, 'isAwaitingFirstToken') &&
  !matchesLoadingDotsExpression(aiChatMessages, 'isResponding')
const aiChatResponseTimeoutWaitsForColdStarts =
  /const\s+RESPONSE_TIMEOUT_MS\s*=\s*60000\b/.test(aiChatSession)
const aiChatTimeoutKeepsLateResponseReceivable =
  aiChatResponseTimeoutBody.length > 0 &&
  /setIsTimeout\s*\(\s*true\s*\)/.test(aiChatResponseTimeoutBody) &&
  !/activeAssistantMessageIdRef\.current\s*=\s*null/.test(aiChatResponseTimeoutBody) &&
  !/setIsResponding\s*\(\s*false\s*\)/.test(aiChatResponseTimeoutBody)
const aiChatInputStaysLockedDuringTimeout =
  /const\s+canSend\s*=\s*inputValue\.trim\(\)\.length\s*>\s*0\s*&&\s*!isResponding\s*&&\s*readyState\s*===\s*ReadyState\.OPEN\s*&&\s*!!userId/.test(aiChatSession) &&
  /disabled=\{\s*!canSend\s*\}/.test(aiChatSubmitButtonBlock)
const aiChatMarkdownPluginsAreStable =
  /const\s+REMARK_PLUGINS\s*=\s*\[\s*remarkGfm\s*\]/.test(aiChatMessages) &&
  /remarkPlugins=\{\s*REMARK_PLUGINS\s*\}/.test(aiChatMessages)
const notesDirectoryListClass =
  notesDirectory.match(/<div className="([^"]+)">\s*\{activeNotes\.map/)?.[1] ?? ''
const heroMobilePreviewBlock = hero.match(/<div className="lg:hidden">[\s\S]*?<HeroAgentPreview \/>[\s\S]*?<\/div>/)?.[0] ?? ''
const heroDesktopChatBlock = hero.match(/<div className="hidden lg:block">[\s\S]*?<DeferredAIChat \/>[\s\S]*?<\/div>/)?.[0] ?? ''
const requiredReducedMotionFragments = [
  'scroll-behavior: auto',
  'animation: none !important',
  'transition: none !important',
  '.fade-in,',
  '.slide-in-left,',
  '.slide-in-right,',
  '.slide-in-up,',
  '.scale-in,',
  '.enter-up',
]

const hexToRgb = (hex) => {
  const normalized = hex.trim().replace('#', '')
  if (!/^[\da-f]{6}$/i.test(normalized)) {
    return null
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

const relativeLuminance = ({ r, g, b }) => {
  const [red, green, blue] = [r, g, b].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

const contrastRatio = (foreground, background) => {
  const foregroundRgb = hexToRgb(foreground)
  const backgroundRgb = hexToRgb(background)

  if (!foregroundRgb || !backgroundRgb) {
    return 0
  }

  const lighter = Math.max(relativeLuminance(foregroundRgb), relativeLuminance(backgroundRgb))
  const darker = Math.min(relativeLuminance(foregroundRgb), relativeLuminance(backgroundRgb))

  return (lighter + 0.05) / (darker + 0.05)
}

const getCssVar = (css, name) => {
  return css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1] ?? ''
}

const rootCss = globals.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
const darkCss = globals.match(/\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
const lightButtonContrast = contrastRatio(
  getCssVar(rootCss, '--button-primary-text'),
  getCssVar(rootCss, '--button-primary-bg')
)
const lightButtonHoverContrast = contrastRatio(
  getCssVar(rootCss, '--button-primary-text'),
  getCssVar(rootCss, '--button-primary-hover')
)
const darkButtonContrast = contrastRatio(
  getCssVar(darkCss, '--button-primary-text'),
  getCssVar(darkCss, '--button-primary-bg')
)
const darkButtonHoverContrast = contrastRatio(
  getCssVar(darkCss, '--button-primary-text'),
  getCssVar(darkCss, '--button-primary-hover')
)

const checks = [
  {
    name: 'layout exposes the Next font as --font-sans',
    passed: layout.includes("variable: '--font-sans'"),
  },
  {
    name: 'body applies the font variable class',
    passed: layout.includes('notoSansKR.variable'),
  },
  {
    name: 'body uses Tailwind font-sans',
    passed: layout.includes('font-sans'),
  },
  {
    name: 'global CSS does not force Inter over next/font',
    passed: !globals.includes("font-family: 'Inter'"),
  },
  {
    name: 'Tailwind sans stack starts from --font-sans',
    passed: tailwind.includes("sans: ['var(--font-sans)'"),
  },
  {
    name: 'Tailwind sans stack does not default to Inter',
    passed: !tailwind.includes("sans: ['Inter'"),
  },
  {
    name: 'Tailwind 4 CSS entrypoint uses import syntax',
    passed: globals.includes('@import "tailwindcss";') && !globals.includes('@tailwind '),
  },
  {
    name: 'Tailwind 4 CSS entrypoint loads the JavaScript config explicitly',
    passed: globals.includes('@config "../../tailwind.config.mjs";'),
  },
  {
    name: 'PostCSS uses Tailwind 4 dedicated plugin',
    passed: postcss.includes("'@tailwindcss/postcss'") && !postcss.includes('tailwindcss:') && !postcss.includes('autoprefixer'),
  },
  {
    name: 'global spacing reset is scoped to Tailwind base layer',
    passed: hasLayeredUniversalReset && !hasUnlayeredUniversalReset,
  },
  {
    name: 'global spacing reset detector is order-insensitive',
    passed: universalResetDetectorHandlesReorderedDeclarations,
  },
  {
    name: 'global spacing reset detector handles compact CSS rules',
    passed: universalResetDetectorHandlesCompactRules,
  },
  {
    name: 'global spacing reset detector handles zero units',
    passed: universalResetDetectorHandlesZeroUnits,
  },
  {
    name: 'global spacing reset detector requires both spacing declarations',
    passed: universalResetDetectorRequiresBothSpacingDeclarations,
  },
  {
    name: 'source avoids Tailwind 4 removed utilities',
    passed: removedTailwindUtilities.every((utility) => !sourceBundle.includes(utility)),
  },
  {
    name: 'source avoids Tailwind 4 renamed v3 utilities',
    passed:
      renamedTailwindUtilities.every((utility) => !sourceBundle.includes(utility)) &&
      !hasBareRingUtility &&
      !hasBareRoundedUtility &&
      !hasBareBackdropBlurUtility,
  },
  {
    name: 'global CSS includes a reduced-motion media query',
    passed: hasReducedMotionQuery,
  },
  {
    name: 'reduced-motion fallback disables animations',
    passed: hasReducedMotionQuery && reducedMotionCss.includes('animation: none !important'),
  },
  {
    name: 'reduced-motion fallback disables transitions',
    passed: hasReducedMotionQuery && reducedMotionCss.includes('transition: none !important'),
  },
  {
    name: 'reduced-motion fallback prevents smooth scrolling',
    passed: hasReducedMotionQuery && reducedMotionCss.includes('scroll-behavior: auto'),
  },
  {
    name: 'reduced-motion fallback reveals scroll animation elements',
    passed: hasReducedMotionQuery && requiredReducedMotionFragments.every((fragment) => reducedMotionCss.includes(fragment)),
  },
  {
    name: 'mobile scroll animations avoid lateral overflow',
    passed:
      /@media\s*\(max-width:\s*640px\)[\s\S]*?\.slide-in-left[\s\S]*?\.slide-in-right[\s\S]*?translateY\(24px\)/.test(globals),
  },
  {
    name: 'hero uses dynamic viewport height',
    passed: hero.includes('min-h-[100dvh]'),
  },
  {
    name: 'hero does not use min-h-screen',
    passed: !hero.includes('min-h-screen'),
  },
  {
    name: 'hero uses mobile preview and desktop full AI chat',
    passed: heroMobilePreviewBlock.includes('<HeroAgentPreview />') && heroDesktopChatBlock.includes('<DeferredAIChat />'),
  },
  {
    name: 'shared Button has pressed translate feedback',
    passed: buttonBaseClasses.includes('active:translate-y-px'),
  },
  {
    name: 'shared Button has pressed scale feedback',
    passed: buttonBaseClasses.includes('active:scale-[0.99]'),
  },
  {
    name: 'Navigation does not use a scroll event listener',
    passed: !navigationHasScrollListener,
  },
  {
    name: 'Navigation does not keep scroll shadow state',
    passed: !navigation.includes('isScrolled'),
  },
  {
    name: 'shared Button primary uses button background token',
    passed: buttonPrimaryVariantClass.includes('bg-[var(--button-primary-bg)]'),
  },
  {
    name: 'shared Button primary uses button hover token',
    passed: buttonPrimaryVariantClass.includes('hover:bg-[var(--button-primary-hover)]'),
  },
  {
    name: 'shared Button primary uses button text token',
    passed: buttonPrimaryVariantClass.includes('text-[var(--button-primary-text)]'),
  },
  {
    name: 'shared Button light primary contrast passes AA',
    passed: lightButtonContrast >= 4.5,
  },
  {
    name: 'shared Button dark primary contrast passes AA',
    passed: darkButtonContrast >= 4.5,
  },
  {
    name: 'shared Button light primary hover contrast passes AA',
    passed: lightButtonHoverContrast >= 4.5,
  },
  {
    name: 'shared Button dark primary hover contrast passes AA',
    passed: darkButtonHoverContrast >= 4.5,
  },
  {
    name: 'ProjectGallery demo CTA uses button background token',
    passed: projectGalleryDemoLinkClass.includes('bg-[var(--button-primary-bg)]'),
  },
  {
    name: 'ProjectGallery demo CTA uses button hover token',
    passed: projectGalleryDemoLinkClass.includes('hover:bg-[var(--button-primary-hover)]'),
  },
  {
    name: 'ProjectGallery demo CTA uses button text token',
    passed: projectGalleryDemoLinkClass.includes('text-[var(--button-primary-text)]'),
  },
  {
    name: 'ProjectGallery CTA avoids uppercase treatment',
    passed:
      !projectGalleryDemoLinkClass.includes('uppercase') &&
      !projectGalleryDemoLinkClass.includes('tracking-wider'),
  },
  {
    name: 'PagesSection active CTA uses button background token',
    passed: pagesSectionActiveLinkClass.includes('bg-[var(--button-primary-bg)]'),
  },
  {
    name: 'PagesSection active CTA uses button hover token',
    passed: pagesSectionActiveLinkClass.includes('hover:bg-[var(--button-primary-hover)]'),
  },
  {
    name: 'PagesSection active CTA uses button text token',
    passed: pagesSectionActiveLinkClass.includes('text-[var(--button-primary-text)]'),
  },
  {
    name: 'PagesSection avoids emoji icons and typed service marks',
    passed:
      !pagesSection.includes('serviceMarks') &&
      !pagesSection.includes('{service.icon}') &&
      !navigation.includes('dropdownItem.icon') &&
      !portfolioData.includes('icon:'),
  },
  {
    name: 'Lab service data does not keep unused gradient metadata',
    passed: !portfolioData.includes('color:'),
  },
  {
    name: 'shared Card avoids hard-coded white shadow base',
    passed: !card.includes('bg-white') && !card.includes('shadow-lg') && !card.includes('hover:shadow-xl'),
  },
  {
    name: 'ContactForm submit CTA uses button background token',
    passed: contactFormSubmitButtonClass.includes('bg-[var(--button-primary-bg)]'),
  },
  {
    name: 'ContactForm submit CTA uses button hover token',
    passed: contactFormSubmitButtonClass.includes('hover:bg-[var(--button-primary-hover)]'),
  },
  {
    name: 'ContactForm submit CTA uses button text token',
    passed: contactFormSubmitButtonClass.includes('text-[var(--button-primary-text)]'),
  },
  {
    name: 'AIChat retry CTA uses button background token',
    passed: aiChatRetryButtonClass.includes('bg-[var(--button-primary-bg)]'),
  },
  {
    name: 'AIChat retry CTA uses button hover token',
    passed: aiChatRetryButtonClass.includes('hover:bg-[var(--button-primary-hover)]'),
  },
  {
    name: 'AIChat retry CTA uses button text token',
    passed: aiChatRetryButtonClass.includes('text-[var(--button-primary-text)]'),
  },
  {
    name: 'AIChat submit CTA uses button background token',
    passed: aiChatSubmitButtonClass.includes('bg-[var(--button-primary-bg)]'),
  },
  {
    name: 'AIChat submit CTA uses button hover token',
    passed: aiChatSubmitButtonClass.includes('hover:bg-[var(--button-primary-hover)]'),
  },
  {
    name: 'AIChat submit CTA uses button text token',
    passed: aiChatSubmitButtonClass.includes('text-[var(--button-primary-text)]'),
  },
  {
    name: 'AIChat loading dots disappear after the first streamed token',
    passed: aiChatLoadingDotsUseFirstTokenState,
  },
  {
    name: 'AIChat response timeout allows cold starts and slow first tokens',
    passed: aiChatResponseTimeoutWaitsForColdStarts,
  },
  {
    name: 'AIChat timeout state keeps late streamed responses receivable',
    passed: aiChatTimeoutKeepsLateResponseReceivable,
  },
  {
    name: 'AIChat input stays locked while a timed-out response can still arrive',
    passed: aiChatInputStaysLockedDuringTimeout,
  },
  {
    name: 'AIChat markdown plugins keep a stable reference',
    passed: aiChatMarkdownPluginsAreStable,
  },
  {
    name: 'NotesDirectory note list avoids duplicate top divider',
    passed: !notesDirectoryListClass.split(/\s+/).includes('border-y'),
  },
  {
    name: 'NotesDirectory note list keeps one bottom boundary',
    passed: notesDirectoryListClass.split(/\s+/).includes('border-b'),
  },
]

const failedChecks = checks.filter((check) => !check.passed)

if (failedChecks.length > 0) {
  throw new Error(
    `Design-system check failed:\n${failedChecks
      .map((check) => `- ${check.name}`)
      .join('\n')}`
  )
}

console.log('Design-system check passed.')
