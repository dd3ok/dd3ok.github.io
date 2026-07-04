# Dependency Maintenance Plan

## Context
This pass checks whether the portfolio can safely refresh dependencies without changing the app's public behavior or breaking GitHub Pages static export.

## Scope
- Keep package updates inside existing semver ranges.
- Avoid major migrations such as Next 16, Tailwind 4, ESLint 10, or TypeScript 6 in this pass.
- Fix low-risk tooling drift when it directly affects validation or build stability.
- Re-check static export output after dependency changes.

## Work Items
1. Refresh lockfile dependencies with `npm update`.
2. Run install, validation, build, smoke, and audit checks.
3. Inspect remaining advisories and avoid unsafe forced fixes.
4. Verify exported routes, internal asset references, image handling, and local font output.
5. Record the remaining risk and recommended follow-up.

## Progress Log
- 2026-06-17: Created branch `codex/dependency-maintenance` and split review with subagents for dependency/audit risk and static-export compatibility risk.
- 2026-06-17: Refreshed package-lock dependencies within existing semver ranges. `npm outdated` now only reports intentionally deferred major lines for Next, Tailwind, ESLint, TypeScript, and Node types.
- 2026-06-17: Converted Tailwind config from TypeScript ESM to `tailwind.config.mjs` to remove the build-time config loading warning while keeping the same settings.
- 2026-06-17: Verified with `npm ci`, `npm run validate`, `npm run build`, static HTML reference checks, and served-route checks on `out/`.
- 2026-06-17: Investigated the remaining PostCSS advisory. Stable Next 16.2.9 still declares internal `postcss@8.4.31`, while the fixed Next line is only available on canary, so a framework upgrade is not the safe path for this portfolio.
- 2026-06-17: Resolved the remaining advisories by raising the direct `postcss` devDependency to `^8.5.15` and adding an npm override that points transitive PostCSS installs at the same patched dependency line. `npm ls postcss` now shows Next, Tailwind, and Autoprefixer all using `postcss@8.5.15`.
- 2026-06-17: Re-verified after the override with `npm install`, `npm ci`, `npm run validate`, `npm run build`, `npm audit`, `npm audit --omit=dev`, static HTML reference checks, and served-route checks on `out/`. Both audit commands now report 0 vulnerabilities.
- 2026-07-04: Upgraded the compatible stack to Next 16.2.10, React/React DOM 19.2.7, TypeScript 6.0.3, `eslint-config-next` 16.2.10, ESLint 9.39.4, PostCSS 8.5.16, Autoprefixer 10.5.2, and related type/plugin patch lines.
- 2026-07-04: Removed the removed Next 16 `eslint` config option, switched `next.config.ts` to ESM export, changed the package to `"type": "module"`, and moved PostCSS config from CommonJS `postcss.config.js` to ESM `postcss.config.mjs` so the default Turbopack production build works.
- 2026-07-04: Adjusted React hook code flagged by the updated lint stack: `useTheme` now uses `useSyncExternalStore`, `useUserIdentifier` separates initial ID state from localStorage sync, and `ImageModal` ties image error state to the failed source instead of resetting state in an effect.
- 2026-07-04: TypeScript 6 compatibility removed deprecated `baseUrl`, accepted Next 16's `jsx: "react-jsx"` requirement, and included `.next/dev/types/**/*.ts`.
- 2026-07-04: Verification passed with `npm ci`, `npm run build` (which includes validate, typecheck, static export, and smoke), `npm audit --json` reporting 0 vulnerabilities, static `out/` file checks, and a browser smoke of the exported page plus theme toggle on `http://127.0.0.1:3100/`.
- 2026-07-04: Remaining intentional `npm outdated` items are `@types/node` 26.1.0 (deferred because CI deploys on Node 20), `eslint` 10.6.0 (deferred because `eslint-plugin-react@7.37.5` in the Next lint stack only supports ESLint 9 and failed at runtime), and `tailwindcss` 4.3.2 (deferred because v4 requires a PostCSS/CSS migration, not a safe dependency-only bump).
