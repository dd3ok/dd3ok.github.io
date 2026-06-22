# Portfolio Improvement Plan

## Context
This repository is a personal portfolio site built with Next.js and deployed as a static export.
It already communicates backend experience well, but several areas can be improved to make the codebase feel closer to a real product workflow.

## Current Findings
- Build works and static export succeeds
- Validation works through `npm run validate`
- Home interactions are already split into smaller client islands
- Runtime fallbacks and smoke checks are in place, but a few maintenance details still remain
- Unreleased internal destinations and tooling/documentation drift should still be tightened

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

### Ticket 9: Runtime and maintenance hardening
- Reuse shared runtime config for external AI features
- Improve modal and section-navigation interaction details
- Deduplicate shared Toys metadata and refresh project documentation

### Ticket 10: Content polish and smoke checks
- Improve contact failure messaging for sleepy external services
- Strengthen project case-study context without a large redesign
- Add a lightweight static smoke check to catch broken exports early

### Ticket 11: Project proof and smoke coverage
- Add clearer project scope/impact context to featured work
- Extend smoke checks to cover metadata and key exported links

### Ticket 12: Follow-up maintenance cleanup
- Hide or disable unreleased internal destinations until routes exist
- Tighten `/ai-fitting` runtime cleanup for repeated image generation
- Align tooling metadata and refresh plan notes after recent merges

### Ticket 13: Quality gates and chat response isolation
- Include export smoke coverage in the default build path
- Isolate AI chat retries from stale websocket response state
- Refresh docs so contributors know the stronger default verification path

### Ticket 14: Navigation accessibility and fitting UX cleanup
- Align Toys dropdown semantics with actual disclosure-style behavior
- Improve keyboard escape and focus movement for the desktop dropdown
- Reset stale fitting errors and generated results when uploaded inputs change

### Ticket 15: Dependency and status-message cleanup
- Clear the remaining dev-only audit vulnerability without broad dependency churn
- Align contact form success and error feedback with accessible live-region semantics
- Keep the stronger default quality gates green after the maintenance pass

### Ticket 16: Interaction follow-up polish
- Smooth AI chat response completion without requiring a backend protocol change
- Make the Toys dropdown trigger behavior clearer on desktop and mobile
- Expand README guidance for local AI checks, sleep states, and the recommended verification flow

### Ticket 17: Deployment workflow cleanup
- Stop reconstructing the static export artifact after `next build`
- Upload the generated `out/` directory directly after a small verification step
- Keep GitHub Pages deployment aligned with the repository's static export workflow

### Ticket 18: GitHub Actions Pages compatibility fix
- Keep GitHub Pages deployment from overriding the repository's static export settings
- Ensure CI uses the checked-in `next.config.ts` without framework-specific mutation
- Restore smoke-check compatibility in Actions by letting `next build` produce `out/` again

### Ticket 19: Runtime UI maintenance cleanup
- Extract `/ai-fitting` state and request logic into a dedicated hook
- Reuse a shared status banner pattern across runtime error and unavailable states
- Expand README troubleshooting notes for local AI checks and deployment issues

### Ticket 20: Build warning cleanup
- Refresh Browserslist data so the default build path stays quiet
- Remove stale version notes in build-related config comments
- Re-verify the static export path after the lockfile-only maintenance update

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
- 2026-03-17: Started Ticket 9 on branch `codex/runtime-accessibility-cleanup` to harden external runtime fallbacks, refine modal/section UX details, and reduce duplicated Toys metadata
- 2026-03-17: Completed Ticket 9 by routing AI features through shared env config, adding clear unavailable states for missing AI services, trapping/restoring focus in the image modal, deduplicating Toys navigation data, and refreshing README/package metadata; verified with `npm run validate` and `npm run build`
- 2026-03-17: Started Ticket 10 on branch `codex/runtime-accessibility-cleanup` to improve contact failure UX, strengthen project storytelling, lightly polish the home UI, and add a static export smoke check
- 2026-03-17: Completed Ticket 10 by clarifying contact failure states for sleeping/offline APIs, enriching project cards with role/outcome context, lightly polishing the hero/projects presentation, and adding `npm run smoke` to assert key static export output; verified with `npm run validate`, `npm run build`, and `npm run smoke`
- 2026-03-17: Started Ticket 11 on branch `codex/runtime-accessibility-cleanup` to deepen project proof points and extend smoke coverage to exported metadata and key links
- 2026-03-17: Completed Ticket 11 by adding scope/impact context to key projects and extending the smoke check to assert canonical metadata and core exported links; verified with `npm run validate`, `npm run build`, and `npm run smoke`
- 2026-03-17: Rolled back the visible page UI/content polish from Tickets 10-12 on request while keeping runtime/accessibility hardening and static smoke checks in place
- 2026-03-17: Started Ticket 12 on branch `codex/follow-up-maintenance` to clean up unreleased internal links, tighten `/ai-fitting` runtime cleanup, align React type metadata, and refresh stale plan notes
- 2026-03-17: Completed Ticket 12 by disabling the unreleased `wedding` destination in visible UI, teaching the smoke check to verify referenced internal routes exist, revoking stale `/ai-fitting` blob URLs on repeated generations, aligning React 19 type packages, and refreshing the plan summary; verified with `npm run validate`, `npm run build`, and `npm run smoke`
- 2026-03-17: Started Ticket 13 on branch `codex/quality-gates-ai-chat` to fold smoke checks into the default build path and keep AI chat retries from mixing with stale websocket response state
- 2026-03-17: Completed Ticket 13 by making `npm run build` include the export smoke check, reconnecting AI chat retries through a fresh session so delayed websocket packets do not leak into the retried answer, and refreshing README guidance for the stronger default verification path; verified with `npm run validate` and `npm run build`
- 2026-03-17: Started Ticket 14 on branch `codex/quality-gates-ai-chat` to refine Toys dropdown accessibility semantics and reset stale `/ai-fitting` errors/results when uploaded inputs change
- 2026-03-17: Completed Ticket 14 by switching the Toys dropdown toward disclosure-style semantics with keyboard escape/arrow handling, removing mismatched menu roles from desktop/mobile navigation, and clearing stale `/ai-fitting` errors/results when users replace uploaded images; verified with `npm run validate` and `npm run build`
- 2026-03-17: Started Ticket 15 on branch `codex/quality-gates-ai-chat` to clear the last dev-only audit finding and align contact form feedback announcements with the newer accessibility pattern
- 2026-03-17: Completed Ticket 15 by applying the lockfile-level `flatted` security update through `npm audit fix`, connecting contact field errors with their inputs, and adding polite/assertive live-region semantics to contact success and error feedback; verified with `npm run validate`, `npm run build`, and `npm audit`
- 2026-03-17: Started Ticket 16 on branch `codex/quality-gates-ai-chat` to polish AI chat completion behavior, clarify the Toys dropdown trigger UX, and expand local verification guidance in the README
- 2026-03-17: Completed Ticket 16 by keeping AI chat in a responding state until streamed tokens settle, turning the desktop Toys trigger into an explicit disclosure with a dedicated section link inside the dropdown, and documenting local AI checks plus sleep-state expectations; verified with `npm run validate` and `npm run build`
- 2026-03-18: Started Ticket 17 on branch `codex/quality-gates-ai-chat` to simplify the GitHub Pages deployment workflow and remove redundant post-build export assembly
- 2026-03-18: Completed Ticket 17 by deleting the manual `out/` reconstruction step from the Pages workflow, adding a direct export verification step, and keeping deployment pointed at the generated static artifact; verified with `npm run build`
- 2026-03-18: Addressed PR #8 review feedback by preserving AI chat conversation history across retry reconnects instead of resetting the widget state on remount; verified with `npm run validate` and `npm run build`
- 2026-03-18: Started Ticket 18 on branch `codex/github-pages-workflow-fix` to resolve a CI smoke-check failure caused by a mutated Next.js build path
- 2026-03-18: Completed Ticket 18 by removing `static_site_generator: next` from `actions/configure-pages`, restoring the repository's static export config in CI; verified with `npm run build` and workflow YAML parsing
- 2026-03-18: Started Ticket 19 on branch `codex/runtime-ui-maintenance` to split `/ai-fitting` state into a hook, reuse a shared runtime status banner, and improve troubleshooting notes in the README
- 2026-03-18: Completed Ticket 19 by extracting `/ai-fitting` request and upload state into `useAIFitting`, reusing a shared `StatusBanner` across AI/contact runtime states, and expanding README troubleshooting guidance; verified with `npm run validate` and `npm run build`
- 2026-03-20: Completed Ticket 20 by refreshing `caniuse-lite` data in the lockfile, updating stale Next.js lint-note comments, and re-verifying the static export path with `npm run validate` and `npm run build`

### Ticket 21: Hybrid Theme System & Premium UI/UX Redesign
- Establish hybrid theme token variables in `globals.css` (Warm Cream light / Deep Space dark)
- Build a flicker-free Blocking Script in root layout (`layout.tsx`)
- Implement interactive SVG Theme Toggle in Navigation
- Refine all sections (Hero, About, AIChat, Experience, Projects, Contact, Footer) into premium, non-AI-generated-looking modern layouts (Glassmorphism, Ambient Orbs, Claude-style AI Chat)
- Ensure all automated checks (`npm run validate` & `npm run build`) pass cleanly

### Ticket 22: Waitworthy Navigation Placement
- Move Waitworthy to the right side of Contact with a visual separator
- Keep section active states scoped to the home route so Waitworthy pages do not also highlight Home
- Preserve static export and mobile navigation behavior

## Progress Log
... (Skipping past logs to append today's entry) ...
- 2026-05-21: Started Ticket 21 on branch `feature/hybrid-theme-premium-ui`
- 2026-05-21: Designed colors and wrote the implementation plan; set up the `task.md` checkpoint.
- 2026-05-21: Implemented hybrid theme tokens, flicker-free head script, SVG ThemeToggle, Navigation, Hero, About, AIChat, Experience, Projects, ContactSection, ContactForm, and Footer. Verified with full code compilation and static checks; build and smoke-checks passed 100% cleanly.
- 2026-06-17: Started resume-agent branding cleanup on branch `codex/resume-agent-chat`; keep `who-am-ai` repository and environment identifiers unchanged while aligning visible chat/service copy to `이력서 에이전트`.
- 2026-06-17: Completed resume-agent branding cleanup by updating visible service copy, navigation label, chat avatar alt text, and static smoke coverage while preserving the `who-am-ai` repository link and runtime identifiers; verified with `npm run validate` and `npm run build`.
- 2026-06-17: Started career-agent copy follow-up on branch `codex/career-agent-copy` to replace the document-like `이력서 에이전트` wording with the more person-focused `커리어 에이전트` label.
- 2026-06-17: Completed career-agent copy follow-up by updating chat, fallback, service card, accessibility text, and smoke coverage to `커리어 에이전트`; verified with `npm run build`.
- 2026-06-18: Started compact footer cleanup on branch `codex/compact-footer` to reduce footer height, remove the footer from Waitworthy pages, and replace third-party AI tool credit copy with a right-aligned `Built by dd3ok` line.
- 2026-06-18: Patched Waitworthy note body typography on branch `codex/compact-footer` by replacing media-based `dark:` prose colors with the app's `data-theme` CSS variables.
- 2026-06-18: Fixed Waitworthy fenced code block contrast in light mode by adding theme-variable `pre` and nested `pre code` colors after the prose color cleanup.
- 2026-06-18: Removed the `/ai-fitting` route, home service card, sitemap entry, smoke-check expectation, and current docs references after retiring the AI fitting demo.
- 2026-06-18: Updated the visible repository card name from `커리어 에이전트` to `who-am-ai` while keeping the chat-facing agent copy unchanged.
- 2026-06-20: Removed finance/API skill promotions from the home page while keeping the `/agent-skills` detail route available.
- 2026-06-20: Added a `Current Focus` experience entry for post-Gmarket backend, AI agent, and automation work without exposing the private wallstreetcats repository name.
- 2026-06-20: Refined About, skills, current focus, and metadata copy around practical AI backend experiments across public repos and private toy projects without overstating production AI specialization.
- 2026-06-22: Ran a Humanize Korean pass over public UI copy, trimming translationese, stiff status text, and over-explanatory contact messages while preserving technical names and project facts.
- 2026-06-22: Started Ticket 22 on branch `codex/waitworthy-nav-active-fix` to move Waitworthy after Contact and prevent Home from appearing active on Waitworthy routes.
- 2026-06-22: Completed Ticket 22 by separating Waitworthy from the home section links, placing it after Contact with dividers, and scoping section active states to `/`; verified with `npm run build` and static HTML checks for `/` and `/notes`.
- 2026-06-22: Followed up Ticket 22 by reducing the header height, compacting nav controls, and keeping a subtle top-of-page header shadow instead of hiding it entirely.
- 2026-06-22: Fine-tuned Ticket 22 by lowering the header to 52px and increasing the Waitworthy separator contrast slightly.
