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

### Commands
- Install: `npm ci`
- Dev: `npm run dev`
- Validate: `npm run validate`
- Build export: `npm run build`
- Static smoke check: `npm run smoke`
- Preview static output: `npm run preview`

### Notes
- The site is exported statically, so local preview should serve the generated `out/` directory.
- Repository linting is enforced before build because Next.js 15.5.10 built-in linting still conflicts with the current flat config path.
- Interactive demos depend on external services that may take time to wake from sleep.
