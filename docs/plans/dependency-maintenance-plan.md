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
