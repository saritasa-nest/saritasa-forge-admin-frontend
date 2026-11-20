import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { type MockedObject } from 'vitest';
import { of } from 'rxjs';

import { UserService } from '@saanbo/common/core/services/user';
import { byTestId } from '@saanbo/common/testing/utils';
import { provideWebAppRoutes } from '@saanbo/web/shared/web-route-paths';

import { LoginPage } from './login';

describe('LoginComponent', () => {
	let fixture: ComponentFixture<LoginPage>;
	let userServiceSpy: MockedObject<UserService>;
	let emailInput: HTMLInputElement;
	let passwordInput: HTMLInputElement;
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
			login: vi.fn().mockName('UserService.login'),
		} as MockedObject<UserService>;

		TestBed.configureTestingModule({
			imports: [LoginPage],
			providers: [
				provideWebAppRoutes(),
				{ provide: UserService, useValue: userServiceSpy },
				{ provide: ActivatedRoute, useValue: {} },
			],
		});

		fixture = TestBed.createComponent(LoginPage);
		userServiceSpy.login.mockReturnValue(of(undefined));
		fixture.detectChanges();

		emailInput = queryByTestId<HTMLInputElement>('login-email-input');
		passwordInput = queryByTestId<HTMLInputElement>('login-password-input');
		submitButton = queryByTestId<HTMLButtonElement>('login-submit-button');
	});

	describe('inputs', () => {
		it('have placeholders', () => {
			expect(emailInput.placeholder).not.toBe('');
			expect(passwordInput.placeholder).not.toBe('');
		});

		it('have autocomplete attributes', () => {
			expect(emailInput.getAttribute('autocomplete')).toBe('email');
			expect(passwordInput.getAttribute('autocomplete')).toBe('current-password');
		});
	});

	describe('form', () => {
		describe('when submitted with valid data', () => {
			const dummyEmail = 'some-dummy-email@mail.com';
			const dummyPassword = 'some-dummy-password';

			beforeEach(() => {
				editInputValue(emailInput, dummyEmail);
				editInputValue(passwordInput, dummyPassword);
			});

			it('calls UserService.login(x) once', () => {
				click(submitButton);

				expect(userServiceSpy.login).toHaveBeenCalledWith({ email: dummyEmail, password: dummyPassword });
				expect(userServiceSpy.login).toHaveBeenCalledTimes(1);
			});
		});

		describe('when submitted with invalid', () => {
			describe('password', () => {
				const invalidPasswordValue = '';

				it('does not call UserService.login(x)', () => {
					editInputValue(queryByTestId<HTMLInputElement>('login-password-input'), invalidPasswordValue);
					click(queryByTestId<HTMLButtonElement>('login-submit-button'));

					expect(userServiceSpy.login).not.toHaveBeenCalled();
				});
			});

			describe('email', () => {
				const invalidEmailValue = 'invalid-email';

				it('does not call UserService.login(x)', () => {
					editInputValue(queryByTestId<HTMLInputElement>('login-email-input'), invalidEmailValue);
					click(queryByTestId<HTMLButtonElement>('login-submit-button'));

					expect(userServiceSpy.login).not.toHaveBeenCalled();
				});
			});
		});
	});
});
