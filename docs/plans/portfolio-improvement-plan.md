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

## Acceptance Criteria
- Every active change starts from a small ticket in this file or a follow-up plan
- Workflow documents remain in sync with the current repo state
- Each completed ticket is verified with build and type check

## Progress Log
- 2026-03-12: Created branch `codex/real-dev-workflow`
- 2026-03-12: Added `AGENTS.md`, `docs/guidelines`, and `docs/plans` scaffolding
