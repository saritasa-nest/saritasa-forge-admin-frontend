import { Component, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { type FieldTree, FormField, form, required, email, FormRoot, schema, type Schema, type TreeValidationResult } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { type Observable, tap, map, firstValueFrom } from 'rxjs';

import { LoadingSpinner } from '@saanbo/common/shared/components/loading-spinner/loading-spinner';
import { type PasswordReset, passwordResetDataSchema } from '@saanbo/common/core/models/password-reset';
import { UserService } from '@saanbo/common/core/services/user';
import { catchValidationData } from '@saanbo/common/core/utils/rxjs/catch-validation-error';
import { ValidationMessage } from '@saanbo/common/shared/components/validation-message/validation-message';

import { injectWebAppRoutes } from '../../shared/web-route-paths';

/** Page for requesting password reset. */
@Component({
	selector: 'saanbow-reset-password',
	templateUrl: './reset-password.html',
	styleUrls: ['../auth.css', './reset-password.css'],
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
export class ResetPasswordPage {
	/** Reset link result. */
	protected readonly resetResult = signal<string | null>(null);

	/** Auth child route paths. */
	protected readonly authChildPaths = injectWebAppRoutes().auth.children;

	private readonly userService = inject(UserService);

	private readonly model = signal<PasswordReset.Data>({
		email: '',
	});

	/** Reset password form. */
	protected readonly resetForm = this.initResetPasswordForm();

	private initResetPasswordForm(): FieldTree<PasswordReset.Data> {
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

	private handleFormSubmit(fieldTree: FieldTree<PasswordReset.Data>): Observable<TreeValidationResult> {
		return this.userService.resetPassword(passwordResetDataSchema.parse(fieldTree().value()))
			.pipe(
				tap(() => this.resetResult.set('Password reset link has been sent to your email')),
				map(() => undefined),
				catchValidationData(fieldTree),
			);
	}

	private createValidationSchema(): Schema<PasswordReset.Data> {
		return schema<PasswordReset.Data>(newSchema => {
			required(newSchema.email, { message: 'Email is required' });
			email(newSchema.email, { message: 'Invalid Email address' });
		});
	}
}
