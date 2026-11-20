import { Component, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { type FieldTree, FormField, form, required, FormRoot, schema, type Schema, type TreeValidationResult } from '@angular/forms/signals';
import { type Observable, switchMap, first, map, firstValueFrom } from 'rxjs';
import { MatButton } from '@angular/material/button';

import { type PasswordReset, passwordResetConfirmationSchema } from '@saanbo/common/core/models/password-reset';
import { LoadingSpinner } from '@saanbo/common/shared/components/loading-spinner/loading-spinner';
import { UserService } from '@saanbo/common/core/services/user';
import { assertNonNull } from '@saanbo/common/core/utils/assert-non-null';
import { catchValidationData } from '@saanbo/common/core/utils/rxjs/catch-validation-error';
import { AppValidators } from '@saanbo/common/core/utils/validators';
import { ValidationMessage } from '@saanbo/common/shared/components/validation-message/validation-message';
import { type StrictOmit } from '@saanbo/common/core/utils/types/strict-omit';

import { injectWebAppRoutes } from '../../shared/web-route-paths';

/** Reset confirmation token query key. */
export const RESET_CONFIRMATION_TOKEN_QUERY_KEY = 'token';

const confirmResetPasswordFormDataSchema = passwordResetConfirmationSchema.omit({ key: true });
type PasswordResetForm = StrictOmit<PasswordReset.Confirmation, 'key'>;

/**
 * This page is used for confirming a password reset after it is initiated by the `ResetPasswordComponent`.
 * It is usually opened by user via link that is sent to them via email.
 * Accepts a secret token as a query parameter, and uses it to confirm the password reset.
 * @see ResetPasswordComponent.
 *
 *
 * The URL to this page is usually discussed with the BE team since they are the ones who are responsible for sending the link to a user.
 * Recommended to use this URL `/confirm-password?token=<secret-token>`.
 */
@Component({
	selector: 'saanbow-confirm-reset-password',
	templateUrl: './confirm-reset-password.html',
	styleUrls: ['../auth.css', './confirm-reset-password.css'],
	imports: [
		RouterLink,
		MatButton,
		LoadingSpinner,
		MatFormField,
		MatLabel,
		MatError,
		MatInput,
		ValidationMessage,
		FormField,
		FormRoot,
	],
})
export class ConfirmResetPasswordPage {
	/** Auth child route paths. */
	protected readonly authChildPaths = injectWebAppRoutes().auth.children;

	private readonly userService = inject(UserService);

	private readonly model = signal<PasswordResetForm>({
		password: '',
		passwordConfirmation: '',
	});

	/** Confirm reset password form. */
	protected readonly confirmForm = this.initConfirmResetPasswordForm();

	private readonly activatedRoute = inject(ActivatedRoute);

	private readonly router = inject(Router);

	private initConfirmResetPasswordForm(): FieldTree<PasswordResetForm> {
		return form(
			this.model,
			this.createValidationSchema(),
			{
				submission: {
					action: fieldTree => firstValueFrom(this.handleFormSubmit(fieldTree)),
				},
			},
		);
	}

	/** Handles the form submission. */
	private handleFormSubmit(fieldTree: FieldTree<PasswordResetForm>): Observable<TreeValidationResult> {
		return this.activatedRoute.queryParamMap.pipe(
			first(),
			map(paramMap => {
				const token = paramMap.get(RESET_CONFIRMATION_TOKEN_QUERY_KEY);
				assertNonNull(token);
				return token;
			}),
			switchMap(key => this.userService.confirmPasswordReset({
				...confirmResetPasswordFormDataSchema.parse(fieldTree().value()),
				key,
			})),
			switchMap(() => this.router.navigateByUrl(this.authChildPaths.login.url)),
			map(() => undefined),
			catchValidationData(fieldTree),
		);
	}

	private createValidationSchema(): Schema<PasswordResetForm> {
		return schema<PasswordResetForm>(newSchema => {
			required(newSchema.password, { message: 'This field is required' });
			required(newSchema.passwordConfirmation, { message: 'This field is required' });
			AppValidators.matchField(
				newSchema.passwordConfirmation,
				newSchema.password,
				{
					message: 'Passwords must mach',
				},
			);
		});
	}
}
