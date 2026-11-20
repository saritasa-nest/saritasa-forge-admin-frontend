/**
 * Represents root route paths configuration.
 * @example
 * ```ts
 * const authRoutes: RoutePathsConfig = {
 *   auth: {
 *     path: 'auth',
 *     children: {
 *       login: {
 *         path: 'login',
 *       },
 *     },
 *   },
 * };
 * ```
 */
type RoutePathsConfig = Readonly<Record<string, RoutePathOptions>>;

/** Route path options. */
type RoutePathOptions = Readonly<{

	/** Path. */
	path: string;

	/** Children routes config. */
	children?: RoutePathsConfig;
}>;

/** Route path. */
type RoutePath = Readonly<{

	/** Path used in routing modules. */
	path: string;

	/** Navigation url used for navigation in components. */
	url: string;
}>;

/** Route path with children. */
type RoutePathWithChildren<T extends RoutePathsConfig> = RoutePath & Readonly<{

	/** Children routes. */
	children: RoutePaths<T>;
}>;

/** Route path with children that may be undefined. */
type RoutePathWithChildrenNullable<T extends RoutePathsConfig> = RoutePath & Readonly<{

	/** Children routes. */
	children: RoutePaths<T> | undefined;
}>;

/** Dynamic route path. */
type DynamicRoutePath<P extends Record<string, string | number>> = Readonly<{

	/** Path. */
	path: string;

	/** Dynamic navigation url. */
	url: (param: P) => string;
}>;

/** Dynamic route path with children. */
type DynamicRoutePathWithChildren<
	T extends RoutePathsConfig,
	P extends Record<string, string | number>,
> = DynamicRoutePath<P> & Readonly<{

	/** Dynamic children routes. */
	children: (params: P) => RoutePaths<T>;
}>;

/** Dynamic route path with children that may be undefined. */
type DynamicRoutePathWithChildrenNullable<
	T extends RoutePathsConfig,
	P extends Record<string, string | number>,
> = DynamicRoutePath<P> & Readonly<{

	/** Dynamic children routes. */
	children: (params: P) => RoutePaths<T> | undefined;
}>;

/**
 * Represents a type that infers a type for paths which contain dynamic route params.
 * @example
 * ```ts
 * const userEditPath = 'users/:id/edit';
 * type UserPathParams = PathParams<typeof userEditPath>;
 * // type UserPathParams = { id: string | number; }
 * ```
 */
type PathParams<T extends string> = T extends `${infer _}:${infer Param}/${infer Rest}` ?
	Record<Param | keyof PathParams<Rest>, string | number> :
	T extends `${infer _}:${infer Param}` ?
		Record<Param, string | number> :
		unknown;

type RoutePaths<T extends RoutePathsConfig> = {
	[K in keyof T]: T[K]['children'] extends RoutePathsConfig ?
		PathParams<T[K]['path']> extends Record<string, string | number> ?
			DynamicRoutePathWithChildren<T[K]['children'], PathParams<T[K]['path']>> :
			RoutePathWithChildren<T[K]['children']> :
		PathParams<T[K]['path']> extends Record<string, string | number> ?
			DynamicRoutePath<PathParams<T[K]['path']>> :
			RoutePath;
};

/**
 * Build route paths object from config.
 * Warning: Make sure every route is declared as const, so that the string types would be exact.
 * @example
 * ```ts
 * buildRoutePaths({
 *   auth: {
 *     path: 'auth',
 *     children: {
 *       login: { path: 'login' },
 *     },
 *   },
 * });
 * ```
 * @param config Route paths config.
 * @param parentPath Parent route path.
 */
export function buildRoutePaths<const T extends RoutePathsConfig>(
	config: T,
	parentPath = '/',
): RoutePaths<typeof config> {
	const result = Object.keys(config).reduce(
		(acc, key: keyof T) => {
			const routeOptions = config[key];

			if (routeOptions != null && hasParams(routeOptions.path)) {
				return {
					...acc,
					[key]: buildRoutePathWithParams(routeOptions, parentPath),
				};
			}

			if (routeOptions?.children == null) {
				return {
					...acc,
					[key]: buildRoutePath(routeOptions, parentPath),
				};
			}

			return {
				...acc,
				[key]: buildRoutePathWithChildren(routeOptions, parentPath),
			};
		},
		{} as RoutePaths<typeof config>,
	);
	return result;
}

/**
 * Build an url with a path and its parameters.
 * @example
 * ```ts
 * const userProjectEditUrl = buildNavigateUrl(
 *   'users/:userId/projects/:projectId/edit',
 *   { userId: 10, projectId: '1' },
 * );
 * // userProjectEditUrl = 'users/10/projects/1/edit'
 * ```
 * @param path Target path.
 * @param params Parameters.
 */
function buildNavigateUrl<P extends string>(path: P, params: Record<string, string | number>): string {
	return Object.keys(params).reduce(
		(acc, key) => acc.replace(`:${key}`, params[key]?.toString() ?? ''),
		path,
	);
}

/**
 * Whether path has params or not.
 * @param path Path.
 */
function hasParams(path: string): boolean {
	const params = path.match(/:(\w+)/g);
	return Boolean(params?.length);
}

/**
 * Build route path with params.
 * @param routeOptions Route options.
 * @param parentPath Parent path.
 */
function buildRoutePathWithParams<T extends RoutePathsConfig>(
	routeOptions: T[keyof T],
	parentPath: string,
): DynamicRoutePathWithChildrenNullable<RoutePathsConfig, Record<string, string | number>> {
	return {
		path: routeOptions.path,
		url: (params: Record<string, string | number>) => `${parentPath}${buildNavigateUrl(routeOptions.path, params)}`,
		children: (params: Record<string, string | number>) =>
			routeOptions.children ?
				buildRoutePaths(routeOptions.children, `${parentPath}${buildNavigateUrl(routeOptions.path, params)}/`) :
				undefined,
	};
}

/**
 * Build simple route path.
 * @param routeOptions Route options.
 * @param parentPath Parent path.
 */
function buildRoutePath<T extends RoutePathsConfig>(routeOptions: T[keyof T], parentPath: string): RoutePath {
	return {
		path: routeOptions.path,
		url: parentPath + routeOptions.path,
	};
}

/**
 * Build route path with children.
 * @param routeOptions Route options.
 * @param parentPath Parent path.
 */
function buildRoutePathWithChildren<T extends RoutePathsConfig>(
	routeOptions: T[keyof T],
	parentPath: string,
): RoutePathWithChildrenNullable<RoutePathsConfig> {
	const fullPath = parentPath + routeOptions.path;

	return {
		path: routeOptions.path,
		url: fullPath,
		children: routeOptions.children ? buildRoutePaths(routeOptions.children, `${fullPath}/`) : undefined,
	};
}
