import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')

const layout = read('src/app/layout.tsx')
const globals = read('src/app/globals.css')
const hero = read('src/components/sections/HeroSection.tsx')
const button = read('src/components/ui/Button.tsx')
const navigation = read('src/components/layout/Navigation.tsx')
const projectGallery = read('src/components/sections/ProjectGallery.tsx')
const pagesSection = read('src/components/sections/PagesSection.tsx')
const contactForm = read('src/components/sections/ContactForm.tsx')
const aiChat = read('src/components/sections/AIChat.tsx')
const notesDirectory = read('src/app/notes/NotesDirectoryView.tsx')
const tailwind = read('tailwind.config.mjs')

const extractCssBlock = (source, marker) => {
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
  aiChat.match(/onClick=\{onRetry\}[\s\S]*?className="([^"]+)"/)?.[1] ?? ''
const aiChatSubmitButtonClass =
  aiChat.match(/type="submit"[\s\S]*?className="([^"]+)"[\s\S]*?disabled=\{!inputValue\.trim\(\)/)?.[1] ?? ''
const notesDirectoryListClass =
  notesDirectory.match(/<div className="([^"]+)">\s*\{activeNotes\.map/)?.[1] ?? ''
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
    name: 'hero uses dynamic viewport height',
    passed: hero.includes('min-h-[100dvh]'),
  },
  {
    name: 'hero does not use min-h-screen',
    passed: !hero.includes('min-h-screen'),
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
