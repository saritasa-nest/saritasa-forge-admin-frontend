import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { type MockedObject } from 'vitest';

import { UserService } from '@saanbo/common/core/services/user';
import { byTestId } from '@saanbo/common/testing/utils';
import { provideWebAppRoutes } from '@saanbo/web/shared/web-route-paths';

import { ResetPasswordPage } from './reset-password';

describe('ResetPasswordComponent', () => {
	let fixture: ComponentFixture<ResetPasswordPage>;
	let userServiceSpy: MockedObject<UserService>;
	let emailInput: HTMLInputElement;
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
			resetPassword: vi.fn().mockName('UserService.resetPassword'),
		} as MockedObject<UserService>;

		TestBed.configureTestingModule({
			imports: [ResetPasswordPage],
			providers: [
				provideWebAppRoutes(),
				{ provide: UserService, useValue: userServiceSpy },
				{ provide: ActivatedRoute, useValue: {} },
			],
		});

		fixture = TestBed.createComponent(ResetPasswordPage);
		fixture.detectChanges();

		emailInput = queryByTestId<HTMLInputElement>('reset-password-email-input');
		submitButton = queryByTestId<HTMLButtonElement>('reset-password-submit-button');
	});

	describe('input', () => {
		it('has autocomplete attribute', () => {
			expect(emailInput.getAttribute('autocomplete')).not.toBe('');
		});

		it('has placeholder', () => {
			expect(emailInput.placeholder).not.toBe('');
		});
	});

	describe('form', () => {
		describe('when submitted with valid data', () => {
			const dummyEmail = 'some-dummy-email@mail.com';

			it('calls UserService.resetPassword(x)', () => {
				userServiceSpy.resetPassword.mockReturnValue(of('Email was sent'));
				editInputValue(emailInput, dummyEmail);
				click(submitButton);

				expect(userServiceSpy.resetPassword).toHaveBeenCalledTimes(1);

				expect(userServiceSpy.resetPassword).toHaveBeenCalledWith({ email: dummyEmail });
			});
		});

		describe('when submitted with invalid data', () => {
			const dummyInvalidEmail = 'some-dummy-email';

			it('shouldn\'t call UserService.resetPassword(x)', () => {
				editInputValue(emailInput, dummyInvalidEmail);
				click(submitButton);

				expect(userServiceSpy.resetPassword).not.toHaveBeenCalled();
			});
		});
	});
});
