// We have to use 'interface' here because 'type' doesn't support declaration merging.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {

    /** Env. */
    readonly env: ImportMetaEnv;
}

/* eslint-disable @typescript-eslint/naming-convention */
type ImportMetaEnv = Readonly<{

    /**
     * Built-in environment variable.
     * @see {@link [Docs](https://github.com/chihab/ngx-env#ng_app_env)}.
     */
    NG_APP_ENV: string;

    /** App version. */
    NG_APP_VERSION: string;

    /** App commit. */
    NG_APP_COMMIT: string;

    /** Use Angular dev-server proxy for API calls. */
    NG_APP_USE_PROXY: string;

    /** API url. */
    NG_APP_API_URL: string;
}>;
