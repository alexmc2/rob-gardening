# Repository Guidelines

## Project Structure & Module Organization

The Next.js App Router lives in `app/`, with route groups for marketing pages and shared layouts. Reusable UI and hooks sit in `components/` and `lib/`, while typed responses from Sanity land in `types/`. Sanity Studio schemas, config, and CLI helpers live under `sanity/`. Static assets belong in `public/`, and `.cursor/rules/` contains agent guardrails; review them before editing schema or frontend blocks. Use `sample-data.tar.gz` only for local seeding experiments.

## Build, Test, and Development Commands

- `npm run dev`: Start the Next.js dev server plus hot reloading.
<!-- - `npm run build`: Create a production build for Vercel or static previews. --> Do not build unless user requests it.
- `npm run start`: Serve the last production build locally.
- `npm run lint`: Run the Next.js ESLint ruleset (treat warnings as failures).
- `npm run typecheck`: Execute `tsc --noEmit` to guard cross-layer typings.
- `npm run typegen`: Regenerate `schema.json` and `sanity.types.ts` after schema changes.

## Coding Style & Naming Conventions

Write TypeScript-first React components, defaulting to server components unless browser APIs or event handlers require `"use client"`. Name files PascalCase for components, kebab-case for routes, and mirror schema file names with their exported `defineType`. Keep Tailwind utility strings concise; extract shared variants into helpers in `lib/styles`. Each Sanity schema must declare a lucide-react icon, `defineField` usage, and preview configuration.

## Testing Guidelines

Automated tests are not yet present; add Vitest + React Testing Library alongside new logic in `__tests__/` folders. For Sanity-driven flows, build fixtures under `test/fixtures/sanity/` and snapshot composite blocks once markup settles. Run `npm run lint` and `npm run typecheck` before opening a pull request, and include manual QA notes when coverage is unavailable.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects (e.g., `Add grid hero block`). Group related schema and component changes in a single commit to keep the history traceable. Pull requests should describe motivation, outline schema migrations, list testing evidence, and attach screenshots or preview URLs for visual updates. Reference Jira or GitHub issues in the description, and mention required follow-up tasks explicitly.

## Sanity & Content Operations

Coordinate schema updates with content editors; communicate breaking changes before deploying. After publishing new schema blocks, rerun `npm run typegen`, update matching query fragments in `sanity/queries/`, and note the change in `README.md` if setup steps shift. Avoid introducing orphans—remove unused schema files, components, and queries together.
