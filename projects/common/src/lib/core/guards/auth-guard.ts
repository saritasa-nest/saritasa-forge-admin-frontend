import { map } from 'rxjs';
import { type CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { UserService } from '@saanbo/common/core/services/user';

type AuthGuardParams = Readonly<{

	/**
	 * Whether guard is configured for currently authorized user or not.
	 * If 'true', guard will prevent a current user from accessing a route if he is not authorized.
	 * If 'false', guard will prevent a current user from accessing a route if he is authorized.
	 */
	isAuthorized: boolean;
}>;

/**
 * Auth guard.
 * @param isAuthorized Whether guard is configured for currently authorized user or not.
 */
export function authGuard({ isAuthorized }: AuthGuardParams): CanMatchFn {
	return () => {
		const userService = inject(UserService);
		const router = inject(Router);

		// We need to use currentUser$ observable here to wait until the value is initialized
		return userService.currentUser$.pipe(
			map(currentUser => {
				if (isAuthorized) {
					return currentUser != null ? true : router.parseUrl('/');
				}

				return currentUser != null ? router.parseUrl('/') : true;
			}),
		);
	};
}
