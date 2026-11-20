import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { type Login } from '../models/login';
import { type PasswordChange } from '../models/password-change';
import { type PasswordReset } from '../models/password-reset';
import { type UserSecret } from '../models/user-secret';
import { AppErrorMapper } from '../mappers/app-error.mapper';
import { LoginMapper } from '../mappers/login.mapper';
import { PasswordChangeMapper } from '../mappers/password-change.mapper';
import { ResetPasswordConfirmationMapper } from '../mappers/reset-password-confirmation.mapper';
import { ResetPasswordMapper } from '../mappers/reset-password.mapper';
import { UserSecretMapper } from '../mappers/user-secret.mapper';
import { userSecretDtoSchema } from '../dtos/user-secret.dto';
import { successResponseDtoSchema } from '../dtos/success-response.dto';

import { AppUrlsConfig } from './app-urls.config';

/**
 * Performs CRUD operations for auth-related information.
 */
@Service()
export class AuthApiService {
	private readonly httpClient = inject(HttpClient);

	private readonly apiUrlsConfig = inject(AppUrlsConfig);

	/**
	 * Login a user with email and password.
	 * @param loginData Login data.
	 */
	public login(loginData: Login): Observable<UserSecret> {
		return this.httpClient.post<unknown>(
			this.apiUrlsConfig.auth.login,
			LoginMapper.toDto(loginData),
		).pipe(
			map(response => userSecretDtoSchema.parse(response)),
			map(secretDto => UserSecretMapper.fromDto(secretDto)),
			AppErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(LoginMapper),
		);
	}

	/**
	 * Refresh user's secret.
	 * @param secret Secret data.
	 */
	public refreshSecret(secret: UserSecret): Observable<UserSecret> {
		return this.httpClient.post<unknown>(
			this.apiUrlsConfig.auth.refreshSecret,
			UserSecretMapper.toDto(secret),
		).pipe(
			map(response => userSecretDtoSchema.parse(response)),
			map(secretDto => UserSecretMapper.fromDto(secretDto)),
			AppErrorMapper.catchHttpErrorToAppError(),
		);
	}

	/**
	 * Sends request to reset the password.
	 * @param data Data for password reset.
	 * @returns Success message.
	 */
	public resetPassword(data: PasswordReset.Data): Observable<string> {
		return this.httpClient.post<unknown>(
			this.apiUrlsConfig.auth.resetPassword,
			ResetPasswordMapper.toDto(data),
		).pipe(
			map(response => successResponseDtoSchema.parse(response)),
			map(responseDto => responseDto.detail),
			AppErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(ResetPasswordMapper),
		);
	}

	/**
	 * Confirms password reset and applies new passwords to the account.
	 * @param data New passwords data.
	 * @returns Success message.
	 */
	public confirmPasswordReset(data: PasswordReset.Confirmation): Observable<string> {
		return this.httpClient.post<unknown>(
			this.apiUrlsConfig.auth.confirmPasswordReset,
			ResetPasswordConfirmationMapper.toDto(data),
		).pipe(
			map(response => successResponseDtoSchema.parse(response)),
			map(responseDto => responseDto.detail),
			AppErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(ResetPasswordConfirmationMapper),
		);
	}

	/**
	 * Changes password of current user.
	 * @param data Data required for password changing.
	 */
	public changePassword(data: PasswordChange): Observable<void> {
		return this.httpClient.post<unknown>(
			this.apiUrlsConfig.user.changePassword,
			PasswordChangeMapper.toDto(data),
		).pipe(
			map(response => successResponseDtoSchema.parse(response)),
			map(() => undefined),
			AppErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(PasswordChangeMapper),
		);
	}
}
