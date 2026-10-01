# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router project for Playward, a game wishlist and backlog manager. Route files live in `app/`, grouped by feature and dynamic segments such as `app/wishlist/[id]/page.tsx`. Shared UI and feature components live in `components/`, with reusable primitives in `components/ui/`. Server-side workflows are in `server/actions/`, `server/cron/`, `server/platforms/`, and `server/cache/`. Cross-cutting helpers live in `lib/`, shared TypeScript shapes in `types/`, Prisma schema in `server/prisma/schema.prisma`, static assets in `public/`, sample scraped pages in `fixtures/`, and operational notes in `docs/`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server.
- `npm run build`: create a production build and catch TypeScript/Next.js errors.
- `npm run migrate`: run `prisma migrate dev` using `server/prisma/schema.prisma`.
- `npm run search-keywords`: execute the search keyword data script with `.env`.
- `npm run igdb-token`: request or inspect an IGDB token using `.env`.
- `npm run deploy`: run `scripts/deploy.sh`; it expects `main` to be synced and `VERCEL_DEPLOY_HOOK` to be configured.

There is currently no `npm test` or lint script defined. Use `npm run build` as the main verification command unless adding a dedicated tool.

## Coding Style & Naming Conventions

Use TypeScript, React function components, and strict typing. Follow the existing style: two-space indentation, double quotes, no semicolons, and `@/` imports for repo-root paths. Name React components in PascalCase (`GameCarousel.tsx`), hooks with `use...`, server actions by domain, and route files according to Next.js conventions (`page.tsx`, `route.ts`). Tailwind CSS is the primary styling system; Prettier and `prettier-plugin-tailwindcss` are installed for formatting.

## Testing Guidelines

No test framework is configured in `package.json`. When adding tests, keep them close to the behavior under test and document the new command in `package.json`. For scraper or parser changes, prefer fixtures under `fixtures/` so behavior can be reproduced without live network calls.

## Commit & Pull Request Guidelines

Recent commits use short, direct subjects such as `Fix warning on missing desc comp` and `Use thumbs up/down for reviews`. Keep commits focused and written in the imperative or concise present tense. Pull requests should describe the user-facing change, list verification performed, link related issues when applicable, and include screenshots for UI changes.

## Security & Configuration Tips

Keep secrets in `.env` and out of git. API integrations include IGDB/Twitch, Steam, PlayStation, Nintendo, Upstash Redis, Auth.js/Google OAuth, Prisma, and Vercel deploy hooks, so note any required environment changes in PRs.
