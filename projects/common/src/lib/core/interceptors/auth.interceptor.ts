import { type HttpEvent, type HttpHandlerFn, type HttpHeaders, type HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { type Observable } from 'rxjs';

import { type UserSecret } from '../models/user-secret';
import { AppConfig } from '../services/app.config';
import { UserSecretStorageService } from '../services/user-secret-storage';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Token';

/**
 * Checks if a request is for authorization or refresh token.
 * @param url Request url.
 * @param baseApiUrl Base api url.
 */
function shouldInterceptToken(url: string, baseApiUrl: string): boolean {
	return url.startsWith(baseApiUrl);
}

/**
 * Appends authorization header to a list of `headers`.
 * @param headers Headers list.
 * @param userSecret User secret.
 */
function appendAuthorizationHeader(headers: HttpHeaders, userSecret: UserSecret): HttpHeaders {
	return headers.set(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${userSecret.token}`);
}

/**
 * Adds JWT to requests using Authorization HTTP header.
 * @param req An outgoing HTTP request.
 * @param next Function representing the next processing step in the interceptor chain.
 */
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	const appConfigService = inject(AppConfig);

	const userSecretStorage = inject(UserSecretStorageService);

	if (shouldInterceptToken(req.url, appConfigService.apiUrl)) {
		const userSecret = userSecretStorage.currentSecret();
		if (userSecret != null) {
			const authorizedReq = req.clone({
				headers: appendAuthorizationHeader(req.headers, userSecret),
			});
			return next(authorizedReq);
		}
	}

	// Do nothing.
	return next(req);
}
