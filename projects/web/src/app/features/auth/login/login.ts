import { Component, inject, signal } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { type FieldTree, FormField, form, required, email, FormRoot, schema, type Schema, type TreeValidationResult } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { type Observable, firstValueFrom } from 'rxjs';

import { LoadingSpinner } from '@saanbo/common/shared/components/loading-spinner/loading-spinner';
import { type Login, loginSchema } from '@saanbo/common/core/models/login';
import { UserService } from '@saanbo/common/core/services/user';
import { catchValidationData } from '@saanbo/common/core/utils/rxjs/catch-validation-error';
import { ValidationMessage } from '@saanbo/common/shared/components/validation-message/validation-message';

import { injectWebAppRoutes } from '../../shared/web-route-paths';

/** Login page. */
@Component({
	selector: 'saanbow-login',
	templateUrl: './login.html',
	styleUrls: ['../auth.css', './login.css'],
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
export class LoginPage {
	/** Auth child route paths. */
	protected readonly routePaths = injectWebAppRoutes();

	/** Auth child route paths. */
	protected readonly authChildPaths = this.routePaths.auth.children;

	private readonly userService = inject(UserService);

	private readonly model = signal<Login>({
		email: '',
		password: '',
	});

	/** Login form. */
	protected readonly loginForm = this.initLoginForm();

	private initLoginForm(): FieldTree<Login> {
		return form(
			this.model,
			this.createValidationSchema(),
			{
				submission: {
					action: fieldTree => firstValueFrom(this.handleFormSubmit(fieldTree)),
					onInvalid(field) {
						const firstError = field().errorSummary()
							.at(0);
						firstError?.fieldTree().focusBoundControl();
					},
				},

			},
		);
	}

	private handleFormSubmit(fieldTree: FieldTree<Login>): Observable<TreeValidationResult> {
		return this.userService.login(loginSchema.parse(fieldTree().value()))
			.pipe(
				catchValidationData(fieldTree),
			);
	}

	private createValidationSchema(): Schema<Login> {
		return schema<Login>(newSchema => {
			required(newSchema.email, { message: 'Email is required' });
			email(newSchema.email, { message: 'Invalid Email address' });
			required(newSchema.password, { message: 'Password is required' });
		});
	}
}
