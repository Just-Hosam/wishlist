# Repository Guidelines

## Project Structure & Module Organization

Playward is a Next.js App Router application. Pages, layouts, route handlers, and cron endpoints live in `app/`. Reusable React code is grouped by feature in `components/`; shared helpers and request utilities belong in `lib/`, while server actions, platform integrations, caching, and cron logic live in `server/`. Prisma schema and migrations are under `server/prisma/`. Keep static images, icons, the manifest, and service worker in `public/`; global styles live in `styles/`. Developer scripts and API notes are in `scripts/` and `docs/`. HTML samples used by platform checks belong in `fixtures/`.

## Build, Test, and Development Commands

- `npm ci` installs the locked dependency set.
- `npm run dev` starts the local Next.js development server.
- `npm run build` performs the production build and is the primary full-project verification.
- `npm run migrate` creates and applies a Prisma development migration after schema changes.
- `npx prettier --check .` checks formatting; use `npx prettier --write .` to fix it.
- `npx tsx server/platforms/test-playstation.ts` runs the existing focused PlayStation parser assertions.

Copy `.env.example` to `.env` and fill in only the credentials needed for the feature being exercised. Do not commit secrets.

## Coding Style & Naming Conventions

Use TypeScript with strict checking and the `@/` alias for repository-root imports. Prettier defines two-space indentation, no semicolons, no trailing commas, and Tailwind class sorting. Name React components and their files in PascalCase (`NotificationButton.tsx`), hooks with a `use` prefix, and ordinary helpers in camelCase. Follow Next.js route conventions such as `page.tsx`, `layout.tsx`, and `route.ts`. Keep server-only integrations out of client components.

## Testing Guidelines

There is no configured test runner or coverage threshold. Add focused checks near the relevant server module and store stable external-response samples in `fixtures/`. Before submitting, run the applicable focused check, format check, and `npm run build`. Manually verify affected routes and mobile/PWA behavior for UI changes.

## Commit & Pull Request Guidelines

History favors short, imperative summaries such as `Add notification settings` or `Refactor notification data flow`; version-only commits use `chore: Bump version to ...`. Keep each commit scoped to one concern. Pull requests should explain behavior changes, note schema or environment updates, link the relevant issue, and include screenshots for visible UI changes. Call out new migrations, cron behavior, and external API assumptions explicitly.
