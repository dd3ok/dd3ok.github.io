# AGENTS.md

## Project Summary
- Personal portfolio site for `dd3ok`
- Primary goal: present backend experience, production project history, and interactive demos
- Secondary goal: use the site itself as a lightweight proof of engineering quality

## Architecture Overview
- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS + global utility classes
- Deployment target: GitHub Pages via static export
- External integrations:
  - `pagesApi` for contact and healthcheck
  - `whoAmAiApi` for chat and AI fitting

## Key Directories
- `src/app`: routes and page-level layout
- `src/components/layout`: nav and footer
- `src/components/sections`: landing page sections
- `src/components/ui`: shared UI primitives
- `src/hooks`: client-side interaction hooks
- `src/utils`: runtime configuration helpers
- `public`: static assets for the portfolio
- `docs/guidelines`: stable project rules and conventions
- `docs/plans`: change plans, task breakdowns, and progress notes

## Development Rules
- Keep GitHub Pages compatibility in mind for every change
- Prefer server rendering or static rendering by default; use client components only when needed
- Avoid introducing runtime dependencies unless there is a clear product benefit
- Keep copywriting professional, concise, and portfolio-focused
- Favor small, reviewable changes over broad rewrites

## Commands
- Install: `npm ci`
- Dev server: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit`
- Lint: `npm run lint`
- Validate: `npm run validate`

## Working Style
1. Write or update a plan in `docs/plans`
2. Split work into small tickets
3. Implement one ticket at a time on a feature branch
4. Verify with build and type check
5. Leave a short progress note in the active plan

## Current Constraints
- The site is statically exported, so Next.js runtime-only features are limited
- Some user-facing features depend on external services waking up from sleep
- Next.js 15.5.2 built-in linting still conflicts with the current flat config path, so repository lint is enforced before build via `npm run validate`
