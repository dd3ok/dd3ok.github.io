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
  - Optional. Enables the Who Am AI health check.
- `NEXT_PUBLIC_WHO_AM_AI_WS`
  - Optional. Enables the AI chat widget on the home page.

If the optional AI variables are missing, the portfolio still renders normally and now shows a clear unavailable state instead of failing with a broken request URL.

### Local AI Checks
- The chat now calls `POST /api/chat/sessions`, then sends the issued conversation ID and token to `/ws/chat/events`.
- Tokens stay in tab-scoped `sessionStorage` (memory fallback when storage is blocked), never in a URL. Old client-generated UUIDs are no longer used.
- `SOURCES` appears as 참고 자료; only HTTP(S) source URLs become links. `DONE` ends a response. Errors and disconnected partial answers stay marked incomplete until an explicit retry opens a new connection.
- Deploy with the matching session-enabled who-am-ai backend. Both use the WebSocket base URL's origin; the backend must allow the frontend origin for HTTP and WebSocket requests.
- To exercise the AI chat flow locally, set `NEXT_PUBLIC_WHO_AM_AI_API` and `NEXT_PUBLIC_WHO_AM_AI_WS` in `.env.local`.
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
- Repository linting is enforced through the ESLint CLI via `npm run validate` before build on the current Next 16 stack.
- Interactive demos depend on external services that may take time to wake from sleep.

### Recommended Verification Flow
1. Run `npm run validate` while implementing a ticket.
2. Run `npm run build` before sharing a branch. It already includes the static smoke check.
3. Run `npm run preview` when you want to inspect the exported `out/` result locally.
4. Spot-check `/` after previewing if the change touched runtime UX.

### Sleep and Cold Start Notes
- The first request to chat or contact can take 30-60 seconds when the external service is waking from sleep.
- A temporary timeout or unavailable banner during that window can be expected behavior.
- If the service stays unavailable after a retry, confirm the matching public environment variable is configured.

### Deployment and CI Troubleshooting
- If GitHub Pages build logs mention missing `out/index.html`, confirm the workflow is not overriding the repository's checked-in static export settings.
- If `npm run smoke` fails locally, run `npm run build` first and confirm the generated `out/` directory exists before inspecting individual files.
- If chat stays unavailable in local development, verify both `NEXT_PUBLIC_WHO_AM_AI_API` and `NEXT_PUBLIC_WHO_AM_AI_WS` are set in `.env.local`.
- If contact succeeds locally but fails in preview or production, double-check `NEXT_PUBLIC_PAGES_KOYEB_API` and watch for cold-start delays before treating it as a hard failure.
