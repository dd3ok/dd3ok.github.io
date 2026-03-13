## dd3ok Portfolio

정적 export 기반의 개인 포트폴리오 사이트입니다.

- Site: https://dd3ok.github.io
- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Deployment: GitHub Pages static export

### Services
- `pagesApi`: https://github.com/dd3ok/pages-koyeb
- `who-am-ai`: https://github.com/dd3ok/who-am-ai

### Commands
- Install: `npm ci`
- Dev: `npm run dev`
- Validate: `npm run validate`
- Build export: `npm run build`
- Preview static output: `npm run preview`

### Notes
- The site is exported statically, so local preview should serve the generated `out/` directory.
- Repository linting is enforced before build because Next.js 15.5.10 built-in linting still conflicts with the current flat config path.
