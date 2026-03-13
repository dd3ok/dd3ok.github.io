# Portfolio Improvement Plan

## Context
This repository is a personal portfolio site built with Next.js and deployed as a static export.
It already communicates backend experience well, but several areas can be improved to make the codebase feel closer to a real product workflow.

## Current Findings
- Build works and static export succeeds
- Type check passes with `npx tsc --noEmit`
- Lint script is outdated and currently fails because `next lint` no longer matches the installed setup
- Main page uses a broad client boundary, which increases first-load JavaScript
- Portfolio content is embedded directly inside section components
- There are a few small UI and configuration issues that should be cleaned up

## Active Objective
Establish a repeatable development workflow and then improve the portfolio in small, reviewable steps.

## Phase 1
### Ticket 1: Workflow foundation
- Add repository guidance documents
- Create a branch-based working setup
- Define how plans and implementation should be tracked

### Ticket 2: Tooling baseline
- Modernize lint execution
- Align ESLint and Next.js configuration
- Stop relying on broken lint commands as documentation

### Ticket 3: Safe quality gates
- Re-enable meaningful validation in build flow
- Keep GitHub Pages compatibility intact
- Document any temporary exceptions

## Phase 2
### Ticket 4: Content structure
- Move projects, experience, and toy service metadata into dedicated data modules
- Reduce duplication inside section components
- Make content updates easier without touching layout logic

### Ticket 5: UX polish
- Fix small visual and fallback issues
- Review mobile navigation and modal behavior
- Improve accessibility where low-cost fixes exist

### Ticket 6: Performance cleanup
- Narrow client component boundaries
- Keep interactive sections client-side only where necessary
- Re-check bundle impact after changes

### Ticket 7: Interactive island split
- Defer heavyweight home interactions where possible
- Keep AI chat, project modal, and contact form as localized client islands
- Re-check home bundle impact after splitting

### Ticket 8: Config and runtime cleanup
- Scope wake-up logic to routes that actually need it
- Align local preview commands with static export behavior
- Remove dead utilities and simplify active section tracking

## Acceptance Criteria
- Every active change starts from a small ticket in this file or a follow-up plan
- Workflow documents remain in sync with the current repo state
- Each completed ticket is verified with build and type check

## Progress Log
- 2026-03-12: Created branch `codex/real-dev-workflow`
- 2026-03-12: Added `AGENTS.md`, `docs/guidelines`, and `docs/plans` scaffolding
- 2026-03-12: Started branch-based implementation flow on `codex/portfolio-workflow-setup`
- 2026-03-12: Completed Ticket 2 by migrating lint to ESLint CLI, aligning `eslint-config-next` with Next 15, and excluding generated output from lint scope
- 2026-03-12: Cleaned current lint violations in source files and verified with `npm run lint`, `npx tsc --noEmit`, and `npm run build`
- 2026-03-12: Ticket 3 removed the TypeScript build bypass and restored a build-time quality gate through `npm run validate && next build`
- 2026-03-12: Kept `eslint.ignoreDuringBuilds` temporarily because Next 15.5.10 built-in linting still conflicts with the current flat config path; repository lint is enforced before build instead
- 2026-03-13: Addressed PR review feedback on `codex/performance-cleanup` by removing the redundant `export` script, renaming `ServicesSection` to `PagesSection`, and updating stale Next.js version notes
- 2026-03-12: Started Ticket 4 on branch `codex/extract-portfolio-content-data`
- 2026-03-12: Moved about, skills, experience, projects, and services metadata into `src/data/portfolio.ts` so section components can stay focused on rendering
- 2026-03-13: Started Ticket 5 on branch `codex/polish-portfolio-ui` to fix small UX regressions in service cards, image modal fallback handling, and mobile navigation accessibility
- 2026-03-13: Completed Ticket 5 by fixing service link polish, replacing the broken image modal fallback with an inline placeholder, and tightening mobile navigation link behavior and accessibility before verifying with `npm run build`
- 2026-03-13: Started Ticket 6 on branch `codex/performance-cleanup` to narrow the home page client boundary and move static sections back toward server rendering
- 2026-03-13: Completed Ticket 6 by making `src/app/page.tsx` server-rendered again, moving Hero/About/Experience/Pages/Footer back toward server components, and keeping scroll reveals in smaller client wrappers; verified with `npm run build`, which reduced `/` from `72.6 kB / 174 kB` to `68.9 kB / 171 kB`
- 2026-03-13: Started Ticket 7 on branch `codex/performance-cleanup` to defer AI chat and split remaining home interactions into smaller client islands
- 2026-03-13: Completed Ticket 7 by deferring AI chat loading, extracting project modal behavior and contact form logic into localized client islands, and reducing `/` from `68.9 kB / 171 kB` to `16.7 kB / 119 kB` after `npm run build`
- 2026-03-13: Started Ticket 8 on branch `codex/performance-cleanup` to narrow healthcheck scope, align static preview tooling, and clean up stale runtime utilities
- 2026-03-13: Completed Ticket 8 by moving health checks from the root layout to the home page, aligning preview scripts and README with static export, deleting the unused `SectionWrapper`, and switching active-section tracking to `IntersectionObserver`; verified with `npm run build`
- 2026-03-13: Patched direct and transitive dependency vulnerabilities by updating `next` to `15.5.10`, aligning related Next tooling, updating `serve`, and applying `npm audit fix`; verified with `npm run lint`, `npx tsc --noEmit`, `npm run build`, and a clean `npm audit`
- 2026-03-13: Added follow-up polish on `codex/performance-cleanup` by restoring zoom support on `/ai-fitting`, enforcing the contact form message limit in the UI, refreshing the AI fitting footer year, and enriching site metadata for social sharing
