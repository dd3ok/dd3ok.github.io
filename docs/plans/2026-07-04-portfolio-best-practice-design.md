# 2026-07-04 Portfolio Best-Practice Optimization Design

## Goal
- Establish the next optimization and cleanup direction for the static-exported portfolio after the dependency refresh, Tailwind 4 migration, image conversion, and navigation split.
- Separate proven best-practice alignment from optional improvement work so future changes stay small, measurable, and reversible.

## Current Baseline
- App stack: Next.js 16.2.10, React 19.2.7, TypeScript 6.0.3, Tailwind CSS 4.3.2, ESLint 9.39.4.
- Build target: GitHub Pages static export through `output: 'export'`.
- Measured exported assets:
  - Font assets: 124 `.woff2` files, 3.36 MB raw.
  - Static CSS chunks: 2 files, 385.8 KB raw.
  - Static JS chunks: 11 files, 850.1 KB raw.
  - Public image assets: 16 files, 636.2 KB raw.
- Largest exported CSS chunk is 308,592 bytes raw and contains 497 `@font-face` declarations. Removing `@font-face` blocks leaves roughly 215 bytes, so the largest CSS chunk is almost entirely font declarations.
- Largest deferred chat chunk observed in exported JS is 175,812 bytes raw and contains AI chat dependencies such as `react-use-websocket`, `react-markdown`, and `remark-gfm`.

## External Evidence
- Next static export docs, last updated 2026-03-03: `output: 'export'` emits an `out` directory and static exports do not support dynamic routes without `generateStaticParams`, request-dependent route handlers, cookies, rewrites, redirects, headers, proxy, ISR, default `next/image` loader, Draft Mode, Server Actions, or Intercepting Routes. Source: https://nextjs.org/docs/app/guides/static-exports
- Next image export error docs: the default Image Optimization API is unavailable for exported applications because images are optimized on demand; static export should use a custom loader, an external optimization provider, or `images.unoptimized`. Source: https://nextjs.org/docs/messages/export-image-api
- Next font docs: `next/font` can self-host Google Fonts as static assets from the same deployment domain, and app-wide fonts should be applied from the root layout. Source: https://nextjs.org/docs/app/getting-started/fonts
- Next lazy loading docs, last updated 2026-03-10: lazy loading reduces initial route JavaScript by deferring Client Components and imported libraries until needed; `next/dynamic` is the App Router-compatible dynamic import path. Source: https://nextjs.org/docs/app/guides/lazy-loading
- Next prefetching docs, last updated 2026-06-23: route prefetching improves navigation by preloading route assets, but can be disabled with `prefetch={false}` when defaults are not appropriate. Source: https://nextjs.org/docs/app/guides/prefetching
- Next React Compiler config docs, last updated 2026-02-11: React Compiler can reduce manual memoization but requires `babel-plugin-react-compiler` and can slightly slow builds compared with the default compiler. Source: https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler
- Tailwind 4 compatibility docs: Tailwind v4 targets Chrome 111+, Safari 16.4+, and Firefox 128+. Source: https://tailwindcss.com/docs/compatibility
- Tailwind 4 upgrade docs: v4 uses CSS `@import "tailwindcss"`, moves the PostCSS plugin to `@tailwindcss/postcss`, renames several utilities, and changes border/ring defaults. Source: https://tailwindcss.com/docs/upgrade-guide
- Tailwind functions/directives docs: `@config` is the supported compatibility path for loading legacy JavaScript config files during incremental v4 migration. Source: https://tailwindcss.com/docs/functions-and-directives
- MDN WebSocket docs: native `WebSocket` is widely available and exposes the browser API directly, but it does not provide automatic backpressure. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

## 1. Static Export Architecture

### Current Evidence
- `next.config.ts` uses `output: 'export'`, `trailingSlash: true`, `skipTrailingSlashRedirect: true`, and `images.unoptimized: true`.
- Notes dynamic routes use `dynamicParams = false` plus `generateStaticParams`.
- Repository search found no active usage of static-export-incompatible server APIs such as `cookies()`, `headers()`, `redirect()`, `rewrites`, or Server Actions.
- Build workflow uses Node 24, runs `npm ci`, builds the site, verifies the `out` directory, and uploads the static artifact.

### Best-Practice Assessment
- Status: aligned.
- This site is intentionally static-hosted on GitHub Pages. Keeping server-only features out of runtime code is the correct architectural constraint.
- `images.unoptimized: true` is appropriate because there is no Next server image optimizer in a GitHub Pages static export.

### Design Decision
- Keep the static export model as the architecture boundary.
- Treat any future feature that requires cookies, request headers, server actions, redirects, rewrites, ISR, or default image optimization as out of scope unless the deployment target changes.
- Add static-export compatibility checks only when a real regression appears. The current build and smoke checks already provide useful coverage.

### Implementation Shape
- No immediate code change required.
- If adding a new route:
  - Use static data or build-time data.
  - For dynamic segments, add `generateStaticParams` and keep `dynamicParams = false`.
  - Keep browser-only APIs inside Client Components and access them from effects or event handlers.
- If adding a feature that needs per-request logic:
  - Put the logic behind the existing external service boundary instead of adding Next runtime server behavior.

### Verification
- `npm run validate`
- `npm run build`
- Inspect exported `out` directory.
- Browser smoke against `serve out` for navigation, direct route refresh, and no failed static asset requests.

## 2. Font Payload

### Current Evidence
- `src/app/layout.tsx` imports `Noto_Sans_KR` from `next/font/google`.
- Current config requests weights `300`, `400`, `500`, and `700`.
- No `font-light` usage was found in `src`, so weight `300` appears unused.
- The project uses many `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`, and `font-black` classes, while the configured real font weights only include `400`, `500`, and `700` for those common use cases.
- Exported font assets are the largest raw payload group: 124 `.woff2` files, 3.36 MB raw.

### Best-Practice Assessment
- Status: partially aligned.
- `next/font` itself is the right mechanism because it self-hosts the font and avoids runtime Google requests.
- The risk is not the mechanism; it is the breadth of Korean font weights and generated font-face declarations.

### Design Decision
- Optimize fonts in two phases.
- Phase 1 should be low-risk: remove unused weight `300`, rebuild, compare font asset count and key screenshots.
- Phase 2 should be measurement-driven: compare the current `Noto Sans KR` setup against a smaller local/variable font strategy only if Phase 1 leaves font payload as the dominant cost.

### Candidate Options
- Option A: keep `Noto_Sans_KR`, remove `300`.
  - Lowest visual risk.
  - Expected to reduce font asset count and CSS declarations roughly proportional to one removed weight.
  - Keeps `font-medium` and `font-bold` backed by real configured weights.
- Option B: keep only `400` and `700`.
  - Higher payload reduction.
  - Higher visual risk because `font-medium`, `font-semibold`, `font-extrabold`, and `font-black` may rely on browser synthesis.
- Option C: switch to a local variable Korean font.
  - Potentially better long-term control.
  - Requires adding and owning a font asset, license verification, and visual QA.
- Option D: system font stack only.
  - Best payload reduction.
  - Highest brand/visual change risk.

### Recommended Implementation
1. Remove weight `300` from `src/app/layout.tsx`.
2. Run build and recalculate:
   - `.woff2` count and total size.
   - largest CSS chunk size.
   - `@font-face` count.
3. Run desktop/mobile visual smoke for:
   - hero headline.
   - navigation.
   - project cards.
   - notes pages.
   - AI chat panel.
4. Keep the change only if visual differences are acceptable.

### Verification
- `npm run validate`
- `npm run build`
- Font asset size script.
- Browser visual smoke at desktop and mobile widths.
- Compare generated CSS font-face count before/after.

## 3. AIChat Bundle and Architecture

### Current Evidence
- `DeferredAIChat.tsx` uses `next/dynamic` and waits for `requestIdleCallback` or a timeout before mounting `AIChat`.
- `AIChat.tsx` directly imports:
  - `react-use-websocket`
  - `react-markdown`
  - `remark-gfm`
- `AIChat.tsx` mixes transport connection, timeout handling, message assembly, markdown rendering, session retry UI, and presentation in one component.
- The AIChat chunk is deferred, so it is not the highest first-load risk despite being a meaningful chunk.

### Best-Practice Assessment
- Status: mostly aligned for initial performance, partially improvable for maintainability.
- The lazy boundary is correct because the chat is nonessential to rendering the first route.
- The remaining issue is architectural concentration inside `AIChat.tsx`, not a proven user-visible performance bug.

### Design Decision
- Do not rewrite the chat stack only to reduce a deferred chunk.
- Split the architecture only when implementing a measured bundle reduction, a chat behavior change, or a testability improvement.
- Prefer removing dependency weight over adding new abstractions.

### Candidate Options
- Option A: keep current dependencies and split files.
  - Improves readability and testability.
  - Does not materially reduce shipped bytes.
- Option B: replace `react-use-websocket` with a small local hook around native `WebSocket`.
  - Can remove one runtime dependency.
  - Must preserve reconnection, ready-state mapping, cleanup, message ordering, and timeout behavior.
  - Native `WebSocket` has no automatic backpressure, so message volume assumptions must remain explicit.
- Option C: lazy-load Markdown rendering only after assistant text arrives.
  - Can move `react-markdown` and `remark-gfm` out of the initial AIChat render path.
  - More complexity; only worth doing if analyze output proves this chunk matters.
- Option D: remove Markdown/GFM support.
  - Biggest simplification.
  - Product behavior change; should be avoided unless markdown formatting is no longer needed.

### Recommended Implementation
1. First pass: split without behavior change.
   - `useChatSession.ts`: socket URL, send, ready state mapping, timeout, retry, message assembly.
   - `ChatMessages.tsx`: message list and markdown renderer.
   - `ChatInput.tsx`: text input, submit, disabled state.
   - `AIChat.tsx`: composition and layout only.
2. Second pass, only if needed: replace `react-use-websocket` with local native hook.
3. Third pass, only if needed: lazy-load markdown renderer behind an internal boundary.

### Verification
- Add targeted tests or script assertions around message state transitions if a hook is extracted.
- `npm run validate`
- `npm run build`
- `npm run analyze`
- Browser smoke:
  - initial fallback renders.
  - chat connects or shows unavailable state.
  - send button disabled/enabled states.
  - timeout/wake-up copy appears only after send-triggered failure or timeout.

## 4. Image Strategy

### Current Evidence
- Project images were already converted from PNG to WebP.
- Current public images total 636.2 KB raw.
- Largest images:
  - `public/image/projects/esm-seller-deal.webp`: 154,268 bytes.
  - `public/image/projects/esm-category-manager.webp`: 116,180 bytes.
  - `public/image/projects/esm-etapi.webp`: 86,270 bytes.
  - `public/logo.png`: 69,351 bytes.
  - `public/favicon/icon.png`: 69,351 bytes.
- `ProjectGallery.tsx` uses `next/image` for gallery images.
- `ImageModal.tsx` intentionally disables `@next/next/no-img-element` and renders a raw `<img>`.

### Best-Practice Assessment
- Status: aligned enough for the current static-export target.
- Because default Next image optimization is unavailable in static export, pre-optimized static assets are the right approach.
- The raw `<img>` in the modal is acceptable if it is intentionally displaying already-optimized source files without a server optimizer.

### Design Decision
- Do not prioritize image work now; image payload is no longer the bottleneck.
- Keep `next/image` for layout stability in gallery cards.
- Keep modal raw image only if the exception is documented and visual behavior is correct.

### Recommended Implementation
- Add one short comment above the lint disable in `ImageModal.tsx` explaining that static export serves already-optimized WebP assets and the modal intentionally renders the full source image.
- Consider converting `public/logo.png` and favicon variants only if visual QA shows no brand degradation.
- Avoid adding a remote image optimization service unless deployment requirements change.

### Verification
- `npm run validate`
- `npm run build`
- Browser smoke:
  - gallery cards keep stable dimensions.
  - modal opens, traps focus, closes with Escape and click.
  - images do not fail in exported `out`.

## 5. Tailwind 4 and CSS Architecture

### Current Evidence
- `src/app/globals.css` uses `@import "tailwindcss"` and `@config "../../tailwind.config.mjs"`.
- `postcss.config.mjs` uses `@tailwindcss/postcss`.
- `tailwind.config.mjs` keeps the legacy JavaScript config and `@tailwindcss/typography`.
- A prior Tailwind 4 cascade issue was fixed by keeping the universal reset inside Tailwind's `base` layer.
- Reduced-motion handling exists through `@media (prefers-reduced-motion: reduce)`.

### Best-Practice Assessment
- Status: aligned through the official compatibility path.
- CSS-first Tailwind config is the long-term direction, but `@config` is explicitly supported for incremental migration.
- Browser support is acceptable if the site does not need to support browsers older than Chrome 111, Safari 16.4, or Firefox 128.

### Design Decision
- Do not migrate the whole Tailwind config to CSS immediately.
- Keep the current JS config until there is a concrete reason to move tokens/utilities into CSS.
- Continue guarding Tailwind 4 rename/cascade risks in `design:check`.

### Recommended Implementation
- No immediate migration.
- Future CSS-first migration should be a separate PR with:
  - token mapping from `tailwind.config.mjs` to CSS variables.
  - explicit handling for typography plugin loading.
  - browser visual QA across light/dark themes.
  - regression check for spacing and border cascade.

### Verification
- `npm run design:check`
- `npm run validate`
- `npm run build`
- Browser visual smoke after any Tailwind config or global CSS change.

## 6. Navigation and Prefetch

### Current Evidence
- Navigation was split into focused desktop/mobile modules while parent state remains in `Navigation.tsx`.
- Internal navigation prefetch was disabled after static-export browser smoke showed missing RSC prefetch requests locally.

### Best-Practice Assessment
- Status: pragmatic and acceptable.
- Next prefetch defaults are generally beneficial, but the docs explicitly support `prefetch={false}` when defaults are not appropriate.
- For this static-export portfolio, avoiding noisy or failing prefetch requests is more valuable than theoretical navigation warming.

### Design Decision
- Keep current prefetch behavior unless a production Pages smoke proves it is unnecessary.
- Do not add custom hover-prefetch logic unless there is a measured navigation latency problem.

### Recommended Implementation
- No immediate code change.
- If revisiting:
  - Test exported site through the same path GitHub Pages uses.
  - Compare network requests for nav links with and without prefetch.
  - Restore default prefetch only when it does not create missing RSC payload requests.

### Verification
- Browser network smoke on exported static site.
- Direct route refresh for `/notes/`, `/agent-skills/`, and generated note paths.

## 7. React Compiler

### Current Evidence
- `next.config.ts` does not enable `reactCompiler`.
- The project has several Client Components, but no confirmed render performance bottleneck.
- Existing app size is small enough that compiler adoption is not urgent.

### Best-Practice Assessment
- Status: intentionally not adopted.
- Next 16 supports React Compiler, but enabling it adds a dev dependency and may slightly slow builds.
- The compiler is better treated as a measured performance experiment than a default cleanup item.

### Design Decision
- Do not enable React Compiler in the next cleanup pass.
- Revisit only if profiling shows avoidable re-render cost in chat, navigation, gallery, or notes filtering.

### Recommended Implementation
- No immediate code change.
- If revisiting:
  - Add `babel-plugin-react-compiler`.
  - Enable `reactCompiler` in annotation mode first.
  - Annotate a small component or hook with `"use memo"`.
  - Compare build time and interaction behavior.

### Verification
- `npm run validate`
- `npm run build`
- Browser interaction smoke for annotated components.
- Build-time comparison before/after.

## 8. Documentation and Quality Gates

### Current Evidence
- At design time, `README.md` and `AGENTS.md` still contained stale Next 15 built-in lint wording. The 2026-07-04 implementation updated the active docs to the current Next 16 / ESLint CLI validation wording.
- `scripts/check-design-system.mjs` is useful but has grown into a broad regex guard.

### Best-Practice Assessment
- Status: mixed.
- Active project docs should match the actual stack and command behavior.
- Custom regex guardrails are acceptable when they protect known regressions, but they should not become a second compiler.

### Design Decision
- Fix active stale documentation in the next minor cleanup.
- Keep `design:check`, but add new rules only for concrete regressions that are hard to catch through lint, typecheck, build, or smoke.
- Prefer extracting helper functions over adding more large inline regex blocks.

### Recommended Implementation
1. Update README and AGENTS wording to reflect:
   - Next 16.
   - ESLint CLI enforcement through `npm run validate`.
   - Node 24 CI.
2. Add no new `design:check` rule unless the implementation changes fonts, global CSS, Tailwind layers, or exported assets.
3. If `check-design-system.mjs` grows further, split rule helpers into named functions before adding new checks.

### Verification
- Markdown review.
- `npm run validate` only if documentation changes are paired with code/config changes.

## Prioritized Roadmap

### P0: No Immediate Action
- Static export architecture.
- Tailwind 4 compatibility path.
- Image strategy.
- Navigation prefetch.
- React Compiler.

### P1: Low-Risk Cleanup
- Remove unused `Noto Sans KR` weight `300`.
- Update stale README/AGENTS Next 15 lint wording.
- Document the `ImageModal` raw image lint exception.

### P2: Measured Refactor
- Split `AIChat.tsx` into a session hook and presentation components.
- Re-run bundle analysis after the split.
- Decide separately whether to replace `react-use-websocket`.

### P3: Optional Experiments
- Compare `Noto Sans KR` with a local/variable Korean font.
- Test React Compiler annotation mode on a small client component.
- Convert Tailwind config toward CSS-first tokens if future styling work already touches global design tokens.

## Acceptance Criteria for the Next PR
- The PR should not change visual design unless explicitly scoped.
- Each optimization must have a before/after measurement.
- Static export must remain the deployment boundary.
- Required checks:
  - `npm run validate`
  - `npm run build`
  - `npm run analyze` for bundle-related work
  - browser visual smoke for font, Tailwind, gallery, chat, navigation, or global CSS changes
- If external service wake-up behavior is touched, `npm run test:wake-messaging` must pass and browser smoke must confirm the wake-up copy appears only after send-triggered failure or timeout.

## Implementation Progress - 2026-07-04

### P1 Applied
- Removed unused `Noto Sans KR` weight `300` from `src/app/layout.tsx`.
- Updated stale Next 15 lint wording in `README.md` and `AGENTS.md` to the current Next 16 / ESLint CLI validation wording.
- Documented the intentional raw `<img>` exception in `src/components/ui/ImageModal.tsx`.

### P2 Applied
- Split `src/components/sections/AIChat.tsx` into:
  - `src/components/sections/ai-chat/useChatSession.ts`
  - `src/components/sections/ai-chat/ChatMessages.tsx`
  - `src/components/sections/ai-chat/ChatInput.tsx`
- Kept `react-use-websocket`, Markdown rendering, timeout duration, retry remount behavior, and wake-up copy unchanged.
- Added `scripts/check-ai-chat-architecture.mjs` and wired it into `npm run validate`.
- Updated `scripts/check-wake-messaging.mjs` and `scripts/check-design-system.mjs` to read the extracted chat files.

### Measurement
- Before: `124` `.woff2` files, `3,518,312` bytes, largest CSS chunk `308,592` bytes, `497` `@font-face` declarations.
- After clean `.next`/`out` rebuild: `124` `.woff2` files, `3,518,312` bytes, largest CSS chunk `231,536` bytes, `373` `@font-face` declarations.
- Result: removing weight `300` reduced generated font-face CSS, but did not reduce emitted `.woff2` file count or raw font asset bytes in the clean export.

### Verification Run
- `npm run test:ai-chat-architecture` failed before the split for the expected missing-file/monolith reasons.
- `npm run test:ai-chat-architecture` passed after the split.
- `npm run test:wake-messaging` passed.
- `npm run design:check` passed.
- `npm run validate` passed.
- `npm run build` passed after deleting generated `.next` and `out` and rebuilding cleanly.
- `npm run analyze` passed and wrote `.next/diagnostics/analyze`.
- Browser smoke against `serve out` passed:
  - desktop `/` rendered portfolio content and the expected chat unavailable state when `NEXT_PUBLIC_WHO_AM_AI_WS` is unset.
  - mobile width rendered portfolio/chat preview without horizontal overflow.
  - no browser console errors were reported in either smoke.
