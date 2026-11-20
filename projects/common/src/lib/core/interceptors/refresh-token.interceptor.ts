import { type HttpErrorResponse, type HttpEvent, type HttpHandlerFn, type HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { type Observable } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

import { AppUrlsConfig } from '../services/app-urls.config';
import { UserService } from '../services/user';
import { catchHttpErrorResponse } from '../utils/rxjs/catch-http-error-response';

/**
 * Whether http error should be ignored.
 * @param error Http error.
 */
function shouldHttpErrorBeIgnored(error: HttpErrorResponse): boolean {
	return error.status !== HttpStatusCode.Unauthorized;
}

/** Active request for token refresh. */
let refreshSecretRequest$: Observable<void> | null = null;

/**
 * Catches requests with outdated tokens and attempts to refresh it and then retry the request.
 * @param req An outgoing HTTP request.
 * @param next Function representing the next processing step in the interceptor chain.
 */
export function refreshTokenInterceptors(
	req: HttpRequest<unknown>,
	next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
	const userService = inject(UserService);

	const apiUrlsConfig = inject(AppUrlsConfig);

	if (!apiUrlsConfig.isApplicationUrl(req.url) || apiUrlsConfig.isAuthUrl(req.url)) {
		return next(req);
	}

	return next(req).pipe(
		catchHttpErrorResponse(error => {
			if (shouldHttpErrorBeIgnored(error)) {
				// eslint-disable-next-line @typescript-eslint/only-throw-error
				throw error;
			}

			refreshSecretRequest$ ??= userService.refreshSecret().pipe(
				shareReplay({ refCount: true, bufferSize: 1 }),
			);

			return refreshSecretRequest$.pipe(
				tap(() => {
					refreshSecretRequest$ = null;
				}),
				switchMap(() => next(req)),
			);
		}),
	);
}
