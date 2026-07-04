# 2026-07-04 Follow-up Performance Cleanup Plan

## Goal
- Apply low-risk follow-ups from the dependency/performance review after the main dependency refresh.

## Scope
- Optimize project screenshots served from static export.
- Remove or resolve unused bundle analyzer tooling.
- Evaluate whether navigation splitting is safe in this pass.
- Re-check deferred dependency updates and keep blockers evidence-based.

## Tickets
1. Project screenshot optimization
   - Done: converted `public/image/projects/*.png` to WebP assets.
   - Done: updated project data references to `.webp`.
   - Done: extended `scripts/check-projects-data.mjs` to verify referenced public image files exist.

2. Bundle analyzer tooling cleanup
   - Done: removed unused Webpack-oriented `@next/bundle-analyzer`.
   - Done: added a Next 16 `experimental-analyze --output` script for on-demand bundle inspection.
   - Keep `npm run build` static export behavior unchanged.

3. Navigation structure decision
   - Done: split desktop/mobile rendering and shared navigation data into focused modules.
   - Kept state, route scrolling, dropdown timers, and keyboard focus behavior in `Navigation.tsx`.
   - Disabled internal navigation prefetch for static-export-only nav links that produced missing RSC prefetch requests in local browser smoke.

4. Deferred dependency check
   - Re-evaluate ESLint 10, Tailwind 4, and Node types against current local config plus official/upstream evidence.
   - Move `@types/node` to the latest Node 24-compatible major because GitHub Actions now runs Node 24.
   - Done: moved `@types/node` to Node 24-compatible types.
   - Done: migrated Tailwind CSS to 4.3.2 with `@tailwindcss/postcss`, CSS import syntax, explicit JS config loading, and renamed v4 utility classes that preserve the v3 visual scale (`shadow-sm` to `shadow-xs`, v3 `rounded` to `rounded-sm`, v3 `rounded-sm` to `rounded-xs`, `outline-none` to `outline-hidden`, `backdrop-blur` to `backdrop-blur-sm`, `flex-shrink-0` to `shrink-0`).
   - Done: extended `design:check` so Tailwind 4 entrypoint drift and removed/renamed v3 utilities fail during `npm run validate`.
   - Kept ESLint 10 deferred because the current Next lint stack still fails against it.

5. Visual QA guardrail
   - Verify the exported site in a browser after Tailwind 4 because v4 changes generated CSS, hover behavior, shadows/radius names, and border defaults.
   - Check desktop and mobile navigation, theme toggle, project gallery image modal, and exported WebP assets.
   - Done: browser visual smoke on `http://127.0.0.1:3101/` checked desktop/mobile layouts, desktop dropdown, mobile menu, `light -> dark` theme toggle, WebP project images, project image modal, no horizontal overflow, no console errors, and no failed network requests.

6. PR accessibility review follow-up
   - Done: added explicit ARIA menu semantics to the desktop services dropdown.
   - Done: added screen-reader-only context for external dropdown links and simplified dropdown link prefetch handling.

## Follow-Up Result
- `tailwindcss` is now on 4.3.2 and no longer appears in `npm outdated`.
- `npm outdated --json` now only reports the intentional `eslint@10.6.0` and `@types/node@26.1.0` deferrals.
- `npm audit --json` reports 0 vulnerabilities.
- `npm run analyze` completed and wrote `.next/diagnostics/analyze`.
- Largest static chunks after Tailwind 4 remain in the same range: CSS chunk `308,592` raw / `107,029` gzip / `16,948` brotli, second CSS chunk `85,568` raw / `14,755` gzip / `12,122` brotli.

## Verification
- `npm run validate`
- `npm run build`
- Browser visual smoke on the static export
- `npm run analyze`
- `npm audit --json`
- `npm outdated --json`
- Subagent review
- Self-review of diff and generated asset size changes
