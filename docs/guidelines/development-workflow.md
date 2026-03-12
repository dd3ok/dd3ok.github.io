# Development Workflow

## Goal
Use this repository as if it were an actively maintained product, not just a static resume.

## Preparation
- Keep project guidance in `AGENTS.md`
- Keep stable rules in `docs/guidelines`
- Keep task-specific planning and progress in `docs/plans`

## Planning Rules
- Do not jump straight into broad implementation
- Start from one clear problem statement
- Break work into small independent tasks
- Define acceptance criteria before editing code

## Execution Rules
- Work on a feature branch
- Prefer one concern per change set
- Validate with build and type check before closing a task
- Record what changed, what remains, and any follow-up risks

## Recommended Ticket Size
- Good:
  - fix lint/tooling configuration
  - improve navigation accessibility
  - externalize portfolio content data
  - refine AI demo error handling
- Too large:
  - rebuild the whole portfolio
  - redesign everything at once

## Definition of Done
- Scope is reflected in a plan document
- Code matches the agreed scope
- `npm run build` passes
- `npx tsc --noEmit` passes
- User-visible behavior or technical outcome is described in the plan
