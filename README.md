## dd3ok Portfolio

정적 export 기반의 개인 포트폴리오 사이트입니다.

- Site: https://dd3ok.github.io
- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Deployment: GitHub Pages static export

### Services
- `pagesApi`: https://github.com/dd3ok/pages-koyeb
- `who-am-ai`: https://github.com/dd3ok/who-am-ai

### Environment
- `NEXT_PUBLIC_PAGES_KOYEB_API`
  - Optional in production because a hosted default is used for the contact API.
- `NEXT_PUBLIC_WHO_AM_AI_API`
  - Optional. Enables the AI fitting page and Who Am AI health check.
- `NEXT_PUBLIC_WHO_AM_AI_WS`
  - Optional. Enables the AI chat widget on the home page.

If the optional AI variables are missing, the portfolio still renders normally and now shows a clear unavailable state instead of failing with a broken request URL.

### Local AI Checks
- To exercise the AI chat and AI fitting flow locally, set `NEXT_PUBLIC_WHO_AM_AI_API` and `NEXT_PUBLIC_WHO_AM_AI_WS` in `.env.local`.
- To test the contact flow against your own backend, set `NEXT_PUBLIC_PAGES_KOYEB_API`. If you do not, the hosted default is still used for the portfolio contact endpoint.
- Missing optional AI variables are treated as a supported state. The UI should show an unavailable message instead of throwing a runtime error.

### Commands
- Install: `npm ci`
- Dev: `npm run dev`
- Validate: `npm run validate`
- Build export: `npm run build`
  - Includes the static smoke check after export.
- Static smoke check: `npm run smoke`
- Preview static output: `npm run preview`

### Notes
- The site is exported statically, so local preview should serve the generated `out/` directory.
- Repository linting is enforced before build because Next.js 15.5.10 built-in linting still conflicts with the current flat config path.
- Interactive demos depend on external services that may take time to wake from sleep.

### Recommended Verification Flow
1. Run `npm run validate` while implementing a ticket.
2. Run `npm run build` before sharing a branch. It already includes the static smoke check.
3. Run `npm run preview` when you want to inspect the exported `out/` result locally.
4. Spot-check `/` and `/ai-fitting` after previewing if the change touched runtime UX.

### Sleep and Cold Start Notes
- The first request to chat, contact, or AI fitting can take 30-60 seconds when the external service is waking from sleep.
- A temporary timeout or unavailable banner during that window can be expected behavior.
- If the service stays unavailable after a retry, confirm the matching public environment variable is configured.
