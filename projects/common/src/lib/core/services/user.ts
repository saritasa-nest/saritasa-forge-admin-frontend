import { inject, Service, type ResourceRef, computed } from '@angular/core';
import { catchError, concat, ignoreElements, map, type Observable, of, throwError, tap, filter } from 'rxjs';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';

import { type Login } from '../models/login';
import { type PasswordReset } from '../models/password-reset';
import { type User } from '../models/user';

import { AuthApiService } from './auth-api';
import { UserApiService } from './user-api';
import { UserSecretStorageService } from './user-secret-storage';

/**
 * Stateful service for storing/managing information about the current user.
 */
@Service()
export class UserService {
	private readonly authService = inject(AuthApiService);

	private readonly userSecretStorage = inject(UserSecretStorageService);

	private readonly userApiService = inject(UserApiService);

	private readonly _currentUserResource = this.createCurrentUserResource();

	/** Current user. 'null' if user is not authorized. */
	public readonly currentUser = this._currentUserResource.value;

	/**
	 * Current user. Use this stream where Observable is more convenient than Signal (for instance, in guards).
	 * In other cases prefer to use 'currentUser' property with Signal API.
	 */
	public readonly currentUser$ = this.createCurrentUserStream();

	/** Determines if current user is authorized. */
	public readonly isAuthorized = computed(() => this.currentUser() != null);

	/** Reloads user data. */
	public reloadUserData(): void {
		this._currentUserResource.reload();
	}

	/**
	 * Login a user with email and password.
	 * @param loginData Login data.
	 */
	public login(loginData: Login): Observable<void> {
		return this.authService.login(loginData).pipe(
			tap(secret => this.userSecretStorage.saveSecret(secret)),
			map(() => undefined),
		);
	}

	/**
	 * Logout current user.
	 */
	public logout(): Observable<void> {
		this.userSecretStorage.removeSecret();
		return of(undefined);
	}

	/** Attempts to refresh user secret, in case it is not possible logs out current user.. */
	public refreshSecret(): Observable<void> {
		const secret = this.userSecretStorage.currentSecret();
		if (secret == null) {
			return of(undefined);
		}
		return this.authService.refreshSecret(secret).pipe(
			tap(newSecret => this.userSecretStorage.saveSecret(newSecret)),
			catchError((error: unknown) =>
				concat(
					this.logout().pipe(ignoreElements()),
					throwError(() => error),
				)),
			map(() => undefined),
		);
	}

	/**
	 * Requests to reset the password.
	 * @param data Data for resetting the password.
	 * @returns Message for the user.
	 */
	public resetPassword(data: PasswordReset.Data): Observable<string> {
		return this.authService.resetPassword(data);
	}

	/**
	 * Set new password and confirm resetting.
	 * @param data Confirm password reset.
	 * @returns Success message.
	 */
	public confirmPasswordReset(data: PasswordReset.Confirmation): Observable<string> {
		return this.authService.confirmPasswordReset(data);
	}

	private createCurrentUserResource(): ResourceRef<User | null> {
		return rxResource({
			stream: () => {
				if (this.userSecretStorage.currentSecret() == null) {
					return of(null);
				}
				return this.userApiService.getCurrentUser();
			},
			defaultValue: null,
		});
	}

	private createCurrentUserStream(): Observable<User | null> {
		return toObservable(this._currentUserResource.snapshot).pipe(
			filter(snapshot => snapshot.status === 'resolved' || snapshot.status === 'local' || snapshot.status === 'error'),
			map(snapshot => (snapshot.status === 'error' ? null : snapshot.value)),
		);
	}
}
