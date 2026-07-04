# 2026-07-04 Dependency and Performance Review

## Scope
- Refresh the portfolio dependency stack where compatible with GitHub Pages static export.
- Verify current dependency compatibility with install, lint, typecheck, build, smoke, audit, and a small browser check.
- Identify performance, unnecessary dependency/feature, and architecture follow-ups without broad rewrites.

## Dependency Result
- Upgraded: `next` 15.5.x to 16.2.10, `react`/`react-dom` to 19.2.7, `typescript` to 6.0.3, `eslint-config-next` to 16.2.10, ESLint to the compatible 9.39.4 line, `postcss` to 8.5.16, `autoprefixer` to 10.5.2, `@tailwindcss/typography` to 0.5.20, and React/Node type packages within the compatible line.
- Converted config compatibility: `next.config.ts` uses ESM export and no longer uses the removed Next 16 `eslint` option; `package.json` is now `"type": "module"`; `postcss.config.js` moved to `postcss.config.mjs`.
- TypeScript 6 compatibility: removed deprecated `baseUrl`, kept path aliases, and accepted Next 16's `jsx: "react-jsx"` requirement.
- React lint compatibility: removed synchronous state resets inside effects in `useTheme`, `useUserIdentifier`, and `ImageModal`.

## Deferred Updates
- `eslint@10.6.0`: not compatible with the current Next lint stack. `eslint-plugin-react@7.37.5` only peers through ESLint 9 and failed with `contextOrFilename.getFilename is not a function`.
- `tailwindcss@4.3.2`: not a dependency-only bump. Tailwind 4 requires `@tailwindcss/postcss`, CSS `@import "tailwindcss"`, and review of v4 breaking changes.
- `@types/node@26.1.0`: not aligned with the GitHub Actions deployment workflow, which currently uses Node 24. Node types were advanced to the latest compatible 24.x line instead.

## Verification
- `npm ci`: passed.
- `npm run build`: passed; includes repository validation, lint, TypeScript, Next 16 Turbopack static export, and smoke check.
- `npm audit --json`: 0 vulnerabilities.
- `npm outdated --json`: only the three intentional deferred lines above.
- Browser smoke: exported page loaded from `http://127.0.0.1:3100/`; theme toggle changed `data-theme` from `light` to `dark`; no console errors observed.

## Performance Findings
- Highest ROI: optimize project screenshots under `public/image/projects`. The largest raw files are `sec-bqms.png` at ~535 KB, `esm-seller-deal.png` at ~244 KB, and `esm-category-manager.png` at ~219 KB. Because static export uses `images.unoptimized: true`, these are served as-is.
- Follow-up applied: project screenshots now use WebP assets. The largest converted files are `esm-seller-deal.webp` at ~154 KB, `esm-category-manager.webp` at ~116 KB, and `esm-etapi.webp` at ~86 KB; `sec-bqms` dropped from ~535 KB PNG to ~48 KB WebP.
- Bundle shape is acceptable but watch CSS. Largest exported CSS chunk is ~309 KB raw, ~107 KB gzip, ~17 KB brotli. The raw size mostly matters for uncached local inspection; compressed delivery is reasonable.
- Keep `DeferredAIChat` as a lazy boundary. `AIChat.tsx` imports `react-markdown`, `remark-gfm`, and `react-use-websocket`; loading it after idle and only for the desktop hero is the right performance posture.
- Global `*` transition in `src/app/globals.css` applies to every element. This is convenient for theme polish but can increase style work. Prefer scoping theme transitions to known surfaces in a future visual pass.
- Animated blurred aurora orbs use large blur radii and continuous animation. They are hidden on small screens and disabled under reduced motion, so this is a low-priority desktop polish tradeoff rather than an urgent issue.

## Architecture Findings
- `src/components/layout/Navigation.tsx` was split into parent state/interaction orchestration plus `DesktopNavigation`, `MobileNavigation`, and shared `navigationItems` modules. Dropdown keyboard/focus behavior remains centralized in the parent to avoid changing interaction semantics.
- Internal navigation prefetch is disabled for nav links where static export produced missing RSC prefetch requests during local browser smoke.
- `src/components/sections/AIChat.tsx` is ~405 lines and mixes transport, session retry, streaming message assembly, markdown rendering, timeout state, and UI. Split only when changing chat behavior; a good boundary is `useChatSession`, `ChatMessages`, and `ChatInput`.
- `ScrollAnimation` is used many times and creates one `IntersectionObserver` per wrapper. This is acceptable at current scale, but a shared observer or CSS-first reveal helper would be cleaner if more animated sections are added.
- `@next/bundle-analyzer` was removed as unused Webpack-era dev tooling. Use the Next 16 Turbopack analyzer through `npm run analyze` when bundle inspection is needed.

## Recommended Follow-Up Order
1. Done: project screenshots were converted to WebP and PNG originals were removed from the public export path.
2. Run `npm run analyze` when investigating bundle composition; no separate `@next/bundle-analyzer` package is needed for this project.
3. Done: `Navigation.tsx` was split without changing exported navigation behavior.
4. Plan Tailwind 4 as a separate migration with visual QA, not as part of routine dependency maintenance.
