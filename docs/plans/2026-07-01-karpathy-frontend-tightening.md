# 2026-07-01 Karpathy Frontend Tightening

## Context
The home page already has the main portfolio sections and design tokens in place.
This pass keeps the redesign small: preserve routes, data shape, and runtime behavior while reducing visible generic card patterns.

## Assumptions
- GitHub Pages static export compatibility must remain unchanged.
- No new runtime dependency is needed for this pass.
- Existing user changes in unrelated files should stay untouched.

## Tickets
1. Add design-system checks for the specific UI regressions this pass targets.
2. Keep the full career agent chat on desktop, but use a compact mobile preview in the hero.
3. Split Projects into featured case-study cards and a compact supporting work list.
4. Replace Lab emoji-first cards with quieter typed marks and simpler card surfaces.
5. Refresh a few visible copy lines only where the design change needs clearer hierarchy.

## Verification
- `npm run design:check`
- `npm run validate`
- `npm run build`
- Browser smoke check on the local dev server

## Progress
- 2026-07-01: Started small-scope Karpathy-guided frontend tightening pass.
- 2026-07-01: Added failing design checks for mobile hero chat, project hierarchy, Lab emoji marks, and uppercase CTAs.
- 2026-07-01: Implemented the hero preview, project split layout, quieter Lab cards, and targeted copy refresh.
- 2026-07-01: Removed local frontend dev noise by skipping automatic Pages API health checks when no local API URL is configured.
- 2026-07-01: Removed typed Lab marks, reshaped Projects into a primary case plus supporting work ranges, and softened overstrong portfolio copy.
- 2026-07-01: Replaced the awkward `서비스 안쪽 흐름` phrasing with `백엔드 중심 업무`.
- 2026-07-01: Added a project data invariant check after PR review and loosened design checks that were tied to exact source markup.
