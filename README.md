# NetForge Admin client

Angular UI for the NetForge admin panel
(prefix `nf`: `nfw-` for the web app, `nfc-` for the common library).

Ported screens:

| Blazor | Angular |
| --- | --- |
| `Controls/Entities.razor` (grouped entities) | `projects/web/src/app/features/entities/entity-list` |

Data comes from read-only endpoints in the backend repo
([saritasa-forge-admin](https://github.com/saritasa-nest/saritasa-forge-admin), `src/Saritasa.NetForge/Extensions/AdminApiEndpoints.cs`)
(`GET /admin/api/entities`).
DTOs are hand-written zod schemas in `projects/common/src/lib/core/dtos`; see "SDK" below.

## Resources

- [Jira](https://saritasa.atlassian.net/jira/your-work)

## Requirements

- Node version from `.nvmrc`.
- Read access to GitHub Packages for `@saritasa-nest/eslint-config-angular`: add a token with `read:packages`
  to your user `.npmrc` (`//npm.pkg.github.com/:_authToken=...`, `@saritasa-nest:registry=https://npm.pkg.github.com`).

## Run

1. In the backend repo, start the demo host: `dotnet run --project demo/Saritasa.NetForge.Demo --launch-profile "Run Web"`.
2. Here: `npm ci`, then `npm start`, open `http://localhost:4200`.

`npm start` enables proxy mode: `/api/*` is forwarded to `https://localhost:5001/admin/api/*`
(`projects/web/src/proxy.conf.mjs`).

## Checks

`npm run build:prod`, `npm test`, `npm run lint`.

## Authentication

The admin panel has no login of its own: it uses the host application's authentication.

## SDK

The typed API client is to be generated from OpenAPI with the Saritasa SDK generator (`typescript-angular` preset).
That needs an OpenAPI document from the backend, which the library does not expose yet.
Until then, the zod DTOs are the API contract.
