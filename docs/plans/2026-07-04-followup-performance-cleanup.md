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
   - Kept ESLint 10 and Tailwind 4 deferred as separate migration items.

## Verification
- `npm run validate`
- `npm run build`
- Subagent review
- Self-review of diff and generated asset size changes
