# saritasa-angular-boilerplate

---

<!-- TODO: This section is to be removed when a project is started. -->

## Boilerplate info (to be removed)

<section>
  <ol class="next-steps">
    <li>
      Globally replace <code>saritasa-angular-boilerplate</code> to your project
      name in
      <em>kebab-case</em>
    </li>
    <li>
      Globally replace <code>saanbo</code> to your project prefix, it should be
      a short lowercased abbreviation of your project name
    </li>
    <li>Set up the environment</li>
    <li>Delete the <code>dashboard</code> feature</li>
    <li>Fill the root README with relevant data and remove this section</li>
    <li>
      Adjust <code>CODEOWNERS</code> of your application, make sure you have at
      least one code reviewer before starting a project 👨‍💻
    </li>
  </ol>

  <p>
    <strong>And that's it, your're ready to go! 🥷😎</strong>
  </p>
</section>

---

## Resources

- [Jira](https://saritasa.atlassian.net/jira/your-work)

## Requirements

Please see the `engines` section in `package.json`

## Building

Please see the `package.json` to see different build configurations


### Proxying to a backend server

Frontend applications often need a local development proxy to avoid browser CORS
restrictions, especially when the backend uses cookie-based authentication.

The boilerplate includes a development proxy in [projects/web/src/proxy.conf.mjs](projects/web/src/proxy.conf.mjs).
It is wired through [angular.json](angular.json) and loaded by the Angular dev server.

Running `npm start` enables proxy mode by default. The script sets
`NG_APP_USE_PROXY=true`, so API requests are built against the Angular dev-server
origin instead of a backend absolute URL.

When proxy mode is enabled, requests should look like `http://localhost:4200/api/...`
and the Angular dev server forwards matching requests to the configured backend target.

Start the application normally:

```bash
npm start
```

The proxy is for local development only. Production routing must be configured
separately in your hosting server, reverse proxy, or API gateway.

#### API requests

Use `AppUrlsConfig` to obtain URLs for HTTP requests:

```ts
this.httpClient.get(this.appUrlsConfig.users);
```

When proxy mode is enabled, `AppUrlsConfig` builds URLs using the Angular
development-server origin. For example:

```text
http://localhost:4200/api/users
```

The Angular development server forwards matching requests to the configured
backend target.

When proxy mode is disabled, `AppUrlsConfig` uses `NG_APP_API_URL` instead.

In proxy mode, API URLs keep the `/api` prefix so that they match the proxy
configuration. For example:

```text
http://localhost:4200/api/auth/login
```

Using the backend's absolute URL in frontend code bypasses the proxy.

If you disable proxy mode, set `NG_APP_USE_PROXY=false` or omit it and the app
will use `NG_APP_API_URL` for API requests.

#### Cookie-based authentication

`cookieDomainRewrite: 'localhost'` rewrites cookie domains returned by the
backend so that cookies can be stored and sent while the frontend runs on
localhost.

Warning: Cookie authentication may also depend on the backend's `Secure`, `SameSite`,
`Domain`, and `Path` cookie attributes.

#### WebSockets and SignalR

The `/hubs` context demonstrates an optional WebSocket or SignalR proxy.
The `ws: true` option is enabled only for that route because it is required for
WebSocket upgrades.

Applications that do not use WebSockets or SignalR can remove the `/hubs`
example entirely.

The WebSocket path does not have to be `/hubs`. Replace it with the path exposed
by the backend, such as `/ws`, `/socket`, or `/realtime`.

#### Path rewriting

By default, the proxy preserves the request path. A request to `/api/users` is
forwarded to the backend as `/api/users`.

When the backend does not expose the same prefix, use `pathRewrite`. For
example, to forward `/api/users` as `/users`:

```js
export default [
  {
    context: ['/api'],
    target: 'https://api.example.com', // Replace with your backend target.
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  },
];
```

#### Configuration options

For details about the available proxy configuration options, see the
[Vite server proxy documentation](https://vite.dev/config/server-options#server-proxy)
and the [http-proxy-3 options](https://github.com/sagemathinc/http-proxy-3#options).

### Handling `robots.txt`

> By default, `development` environment is hidden from search engines

If you need to have specific behavior from search engines, you can add the following:

`<project>` - name of the project (folder name in `projects/` directory)
`<environment>` - name of the environment (e.g: `development`/`production`/etc)

1. Copy assets from `angular.json/projects/<project>/architect/build/assets` to `angular.json/projects/<project>/architect/build/configurations/<environment>/assets`
2. Add `"projects/<project>/src/robots.txt"` to the newly-created array of assets
3. Create `projects/<project>/src/robots.txt`

## Environment

We stick to the default Angular-provided way to pass variables within the application, but, to keep the single source of truth and be able to pass bash/environment-provided variables, we also use [@ngx-env/builder](https://www.npmjs.com/package/@ngx-env/builder). See examples on how to use it in [our code](projects/web/src/app/features/shared/web-app.config.ts).

## Development (most of the practices described in [wiki](https://wiki.saritasa.rocks/frontend/frameworks/angular/best-practices))

### Architecture

Again, [wiki](https://wiki.saritasa.rocks/frontend/architecture/)

### Theming

By default, we use the following convention for properties:

```css
--primary-color: #233faa;
--primary-dark-color: #283593;
--primary-light-color: #c5cae9;
--primary-contrast-color: white;
--primary-dark-contrast-color: white;
--primary-light-contrast-color: black;

/* Then you can use 'secondary', 'tertiary', 'error', 'warning', 'success' and so on */
```

Then you can use these variables in the project or to configure ui frameworks.

To generate this palette you can take every color(contrast, dark, light...) from designs or choose main and use generators for the purpose.
Two most usable generators:

- [Ionic color generator](https://ionicframework.com/docs/theming/colors#new-color-creator). Don't look that it's made by "ionic". This generator is really convenient and we relied on it when we made the existing scheme.
- [Material design generator](http://mcg.mbitson.com/#!?mcgpalette0=%233f51b5). Use it when you define a custom theme for angular material or you just want to have a more detailed palette.

> If you use angular-material on your project, you need to define mat-theme as well. Open `material-custom-theme.scss` file to see an example how it should be done. Please, use css custom properties that you've already defined for the app, it makes it easier to refactor or add new functionality (like dark mode or dynamic theme).

### Route paths

To avoid using string literals in routes paths anywhere (modules, components, services, etc.)
we have utils to build constant route paths objects.
This approach allows you to create common paths for the entire project in `common-route-paths.ts` file and separate paths for each app (web, mobile, etc.).

To describe the paths for an app, it is proposed to use two functions: `provideAppNameRoutes()`
and `injectAppNameRoutes()`, where `appName` - name of your app.

```ts
/** Create provider for a web route paths. */
export function provideWebAppRoutes(): Provider {
  return {
    provide: WEB_ROUTE_PATHS_TOKEN,
    useValue: webRoutePaths,
  };
}
```

```ts
/** Inject web app route paths to component. */
export function injectWebAppRoutes(): WebRoutePaths {
  return inject(WEB_ROUTE_PATHS_TOKEN);
}
```

### Generating new environment

Please see [Angular guideline](https://angular.io/guide/build#using-environment-specific-variables-in-your-app) and [@ngx-env/builder](https://github.com/chihab/ngx-env#in-env) in case it's bash/environment-provided

### Generating new app

1. Create new application `npx ng g app <app_name> -p saanbo<first_letter_of_your_app_name>`
2. Add [env declaration](env.d.ts) into the [files] section of newly-created tsconfigs (`tsconfig.{app|spec}.json`). See example in the [original tsconfig files](projects/web/tsconfig.app.json)
3. Set up basic structure for this app `features`, `shared` etc.
4. (optional) Set up component libraries

   - Add Angular Material for this app ([guide](https://material.angular.io/guide/getting-started))
   - Ionic `npx ng add @ionic/angular --project <app_name>` (and `npx ionic init --multi-app` if `ionic.config.json` is not present)

5. (optional) Provide interceptors (see examples in default project's `app.module.ts`)
6. (optional) Set up environment
   1. Provide `AppConfigService` implementation, see [example](projects/web/src/app/features/shared/web-app-config.ts)
   2. Set up the `@ngx-env/builder` for this application by using `ng add @ngx-env/builder --project <app_name>`.
      > The order matters here, it's gotta be done only after Material is set up, otherwise Angular will scream at you since the builder is not the default one
