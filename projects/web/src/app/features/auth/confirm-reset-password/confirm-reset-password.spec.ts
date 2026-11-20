import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { type MockedObject } from 'vitest';

import { UserService } from '@saanbo/common/core/services/user';
import { byTestId } from '@saanbo/common/testing/utils';
import { TestAppConfig } from '@saanbo/common/testing/test-app-config';
import { AppConfig } from '@saanbo/common/core/services/app.config';
import { provideWebAppRoutes } from '@saanbo/web/shared/web-route-paths';

import { LoginPage } from '../login/login';

import { ConfirmResetPasswordPage, RESET_CONFIRMATION_TOKEN_QUERY_KEY } from './confirm-reset-password';

describe('ConfirmResetPasswordComponent', () => {
	let fixture: ComponentFixture<ConfirmResetPasswordPage>;
	let userServiceSpy: MockedObject<UserService>;
	let passwordInput: HTMLInputElement;
	let passwordConfirmationInput: HTMLInputElement;
	let submitButton: HTMLButtonElement;

	function queryByTestId<T extends Element>(testId: string): T {
		return fixture.nativeElement.querySelector(byTestId(testId));
	}

	function editInputValue(input: HTMLInputElement, value: string): void {
		input.value = value;
		input.dispatchEvent(new Event('input'));
		fixture.detectChanges();
	}

	function click(element: HTMLElement): void {
		element.click();
		fixture.detectChanges();
	}

	beforeEach(() => {
		userServiceSpy = {
			confirmPasswordReset: vi.fn().mockName('UserService.confirmPasswordReset'),
		} as MockedObject<UserService>;
		const queryParamMap$ = of(
			convertToParamMap({
				[RESET_CONFIRMATION_TOKEN_QUERY_KEY]: 'some-token',
			}),
		);

		TestBed.configureTestingModule({
			imports: [ConfirmResetPasswordPage],
			providers: [
				provideRouter([
					{
						path: 'auth/login',
						component: LoginPage,
					},
				]),
				provideWebAppRoutes(),
				{ provide: AppConfig, useClass: TestAppConfig },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParamMap: queryParamMap$,
					},
				},
				{ provide: UserService, useValue: userServiceSpy },
			],
		});

		fixture = TestBed.createComponent(ConfirmResetPasswordPage);
		fixture.detectChanges();

		passwordInput = queryByTestId<HTMLInputElement>('confirm-reset-password-password-input');
		passwordConfirmationInput = queryByTestId<HTMLInputElement>('confirm-reset-password-password-confirmation-input');
		submitButton = queryByTestId<HTMLButtonElement>('confirm-reset-password-submit-button');
	});

	describe('inputs', () => {
		it('have autocomplete attributes', () => {
			expect(passwordInput.getAttribute('autocomplete')).not.toBe('');
			expect(passwordConfirmationInput.getAttribute('autocomplete')).not.toBe('');
		});
	});

	describe('form submitted with', () => {
		describe('equal passwords', () => {
			const dummyPassword = 'some-dummy-password';

			it('calls UserService.confirmResetPassword(x)', async () => {
				userServiceSpy.confirmPasswordReset.mockReturnValue(of('Password was reset'));

				editInputValue(passwordInput, dummyPassword);
				editInputValue(passwordConfirmationInput, dummyPassword);
				click(submitButton);

				await fixture.whenStable();
				expect(userServiceSpy.confirmPasswordReset).toHaveBeenCalled();
			});
		});

		describe('different passwords', () => {
			const dummyInvalidPassword = 'some-dummy-password';
			const dummyInvalidPasswordConfirmation = 'some-other-password';

			it('shouldn\'t call UserService.confirmResetPassword(x)', () => {
				editInputValue(passwordInput, dummyInvalidPassword);
				editInputValue(passwordConfirmationInput, dummyInvalidPasswordConfirmation);
				click(submitButton);

				expect(userServiceSpy.confirmPasswordReset).not.toHaveBeenCalled();
			});
		});
	});
});
