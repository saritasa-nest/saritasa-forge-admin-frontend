# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this is

Angular 22 admin UI for NetForge (backend: `saritasa-nest/saritasa-forge-admin`). Standalone app, no login of its own
(uses host app auth). Follow Saritasa boilerplate-angular style.

## Commands

- `npm start` — dev server (`NG_APP_ENV=development`, proxy on). Needs the backend demo host running at `https://localhost:5001`;
  `/api/*` is proxied to `/admin/api/*` (`projects/web/src/proxy.conf.mjs`).
- `npm run build:prod` / `build:dev`
- `npm test` — Vitest via `@ngx-env/builder:unit-test` (jsdom, no watch). `npm run test:browser` runs in chromium.
  Single project/file: `npx ng test web --no-watch --include "**/entity-list*.spec.ts"` (also `common`).
- `npm run lint` (eslint + stylelint), `lint:fix`. Husky pre-commit runs lint-staged.
- Node version pinned in `.nvmrc`/`package.json` (engineStrict). `npm ci` needs a GitHub Packages token for
  `@saritasa-nest/eslint-config-angular` (see README).

## Architecture

Two Angular projects in `projects/`:

- `common` (prefix `nfc`, alias `@nf/common/*` → `projects/common/src/lib/*`): app-agnostic code. `core/` = dtos (hand-written
  zod schemas — the API contract until an OpenAPI SDK is generated), mappers (DTO → model), models, services, utils;
  `shared/` = reusable components, pipes, directives, theme. Test helpers: `@nf/common/testing/*`.
- `web` (prefix `nfw`, alias `@nf/web/shared/*` → `projects/web/src/app/features/shared/*`): the app. Code is organised
  by feature under `app/features/<feature>/` (currently `entities/entity-list`).

ESLint forbids `web` importing other apps (`@nf/!(web|common)/*`); put shared code in `common` or `web/shared`.

## Style (enforced by eslint/editorconfig)

4-space indent (TS, HTML via prettier width 120, single attribute per line), CSS/SCSS themes in `theme/` dirs.
LF line endings (`.gitattributes`).
