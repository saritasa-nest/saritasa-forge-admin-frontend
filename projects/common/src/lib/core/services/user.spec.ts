import { type MockedObject } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { type Observer, of, throwError } from 'rxjs';
import { signal, type WritableSignal } from '@angular/core';

import { type User } from '@saanbo/common/core/models/user';
import { createObserverSpy } from '@saanbo/common/testing/utils';

import { type Login } from '../models/login';
import { type UserSecret } from '../models/user-secret';

import { AuthApiService } from './auth-api';
import { UserApiService } from './user-api';
import { UserSecretStorageService } from './user-secret-storage';
import { UserService } from './user';

describe('UserService', () => {
	let userService: UserService;
	let authServiceSpy: MockedObject<AuthApiService>;
	let userApiServiceSpy: MockedObject<UserApiService>;
	let userSecretStorageSpy: MockedObject<UserSecretStorageService>;
	let userSecretSignal: WritableSignal<UserSecret | null>;
	let observer: MockedObject<Observer<unknown>>;

	beforeEach(() => {
		observer = createObserverSpy();
		userSecretSignal = signal<UserSecret | null>(null);

		authServiceSpy = {
			login: vi.fn().mockName('AuthApiService.login'),
			refreshSecret: vi.fn().mockName('AuthApiService.refreshSecret'),
			resetPassword: vi.fn().mockName('AuthApiService.resetPassword'),
			confirmPasswordReset: vi.fn().mockName('AuthApiService.confirmPasswordReset'),
			changePassword: vi.fn().mockName('AuthApiService.changePassword'),
		} as MockedObject<AuthApiService>;

		userApiServiceSpy = {
			getCurrentUser: vi.fn().mockName('UserApiService.getCurrentUser'),
		} as MockedObject<UserApiService>;

		userSecretStorageSpy = {
			saveSecret: vi.fn().mockName('UserSecretStorageService.saveSecret'),
			removeSecret: vi.fn().mockName('UserSecretStorageService.removeSecret'),
			currentSecret: userSecretSignal,
		} as MockedObject<UserSecretStorageService>;

		TestBed.configureTestingModule({
			providers: [
				UserService,
				{ provide: AuthApiService, useValue: authServiceSpy },
				{ provide: UserApiService, useValue: userApiServiceSpy },
				{ provide: UserSecretStorageService, useValue: userSecretStorageSpy },
			],
		});

		userService = TestBed.inject(UserService);
	});

	describe('.login(x)', () => {
		const loginDummyData: Login = {
			email: 'test@test.com',
			password: '12341234',
		};

		beforeEach(() => {
			const userDummy: User = { firstName: 'first-name', id: 1, lastName: 'last-name' };
			authServiceSpy.login.mockReturnValue(of({ token: 'any-token' }));
			userApiServiceSpy.getCurrentUser.mockReturnValue(of(userDummy));

			userService.login(loginDummyData).subscribe(observer);
		});

		it('emits and completes', () => {
			expect(observer.next).toHaveBeenCalledWith(undefined);
			expect(observer.complete).toHaveBeenCalled();
		});

		it('saves user secret', () => {
			expect(userSecretStorageSpy.saveSecret).toHaveBeenCalledWith({ token: 'any-token' });
		});
	});

	describe('.logout(x)', () => {
		it('removes the secret from storage', () => {
			userService.logout().subscribe(observer);

			expect(observer.next).toHaveBeenCalledTimes(1);
			expect(observer.next).toHaveBeenCalledWith(undefined);
			expect(observer.complete).toHaveBeenCalledTimes(1);
			expect(userSecretStorageSpy.removeSecret).toHaveBeenCalled();
		});
	});

	describe('.refreshSecret(x)', () => {
		describe('without initial user secret', () => {
			it('returns an empty completion stream immediately without failing', () => {
				userService.refreshSecret().subscribe(observer);

				expect(observer.next).toHaveBeenCalledWith(undefined);
				expect(observer.complete).toHaveBeenCalled();
				expect(authServiceSpy.refreshSecret).not.toHaveBeenCalled();
			});
		});

		describe('with initial user secret', () => {
			beforeEach(() => {
				const userSecretDummy: UserSecret = { token: 'testing-123' };
				userSecretSignal.set({ token: 'dummy-initial-secret-token' });

				authServiceSpy.refreshSecret.mockReturnValue(of(userSecretDummy));

				userService.refreshSecret().subscribe(observer);
			});

			it('emits and completes', () => {
				expect(observer.next).toHaveBeenCalledTimes(1);
				expect(observer.next).toHaveBeenCalledWith(undefined);
				expect(observer.complete).toHaveBeenCalledTimes(1);
			});

			it('refreshes the secret', () => {
				expect(authServiceSpy.refreshSecret).toHaveBeenCalledWith({ token: 'dummy-initial-secret-token' });
			});

			it('saves refreshed secret to storage', () => {
				expect(userSecretStorageSpy.saveSecret).toHaveBeenCalledWith({ token: 'testing-123' });
			});
		});

		describe('when API token refresh fails', () => {
			it('clears storage credentials and propagates downstream failure errors', () => {
				userSecretSignal.set({ token: 'bad-token' });
				const mockError = new Error('Invalid Refresh Token');
				authServiceSpy.refreshSecret.mockReturnValue(throwError(() => mockError));

				userService.refreshSecret().subscribe(observer);

				expect(userSecretStorageSpy.removeSecret).toHaveBeenCalled();
				expect(observer.error).toHaveBeenCalledWith(mockError);
			});
		});
	});

	describe('.resetPassword(x)', () => {
		it('resets password', () => {
			authServiceSpy.resetPassword.mockReturnValue(of('Password reset requested'));
			userService.resetPassword({ email: 'test@test.com' }).subscribe(observer);

			expect(observer.next).toHaveBeenCalledTimes(1);
			expect(observer.next).toHaveBeenCalledWith('Password reset requested');
			expect(observer.complete).toHaveBeenCalled();
		});
	});

	describe('.confirmPasswordReset(x)', () => {
		it('completes', () => {
			authServiceSpy.confirmPasswordReset.mockReturnValue(of('Password was reset'));
			userService
				.confirmPasswordReset({
					key: '123123 123 123',
					password: '123123123',
					passwordConfirmation: '123123123',
				})
				.subscribe(observer);

			expect(observer.next).toHaveBeenCalledTimes(1);
			expect(observer.next).toHaveBeenCalledWith('Password was reset');
			expect(observer.complete).toHaveBeenCalled();
		});
	});
});
