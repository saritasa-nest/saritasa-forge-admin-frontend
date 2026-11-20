import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal, type WritableSignal } from '@angular/core';

import { TestAppConfig } from '@saanbo/common/testing/test-app-config';

import { type UserSecret } from '../models/user-secret';
import { AppConfig } from '../services/app.config';
import { UserSecretStorageService } from '../services/user-secret-storage';

import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
	let userSecret: WritableSignal<UserSecret | null>;
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let appConfig: AppConfig;

	beforeEach(() => {
		userSecret = signal<UserSecret | null>(null);

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([authInterceptor])),
				provideHttpClientTesting(),
				{ provide: AppConfig, useClass: TestAppConfig },
				{
					provide: UserSecretStorageService,
					useValue: {
						currentSecret: userSecret,
					},
				},
			],
		});

		httpClient = TestBed.inject(HttpClient);
		httpTestingController = TestBed.inject(HttpTestingController);
		appConfig = TestBed.inject(AppConfig);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	function expectAuthHeaderForUrl(url: string, expectedHeaderValue: string | null): void {
		httpClient.get(url).subscribe();
		const testRequest = httpTestingController.expectOne(url, 'GET');
		expect(testRequest.request.headers.get('Authorization')).toEqual(expectedHeaderValue);
		testRequest.flush(null);
	}

	describe('when a client calls an application-scoped route', () => {
		let applicationScopedUrl: string;

		beforeEach(() => {
			applicationScopedUrl = new URL('any-api-url', appConfig.apiUrl).toString();
		});

		describe('with user secret', () => {
			beforeEach(() => {
				userSecret.set({ token: 'any-token' });
			});

			it('appends authorization token', () => {
				expectAuthHeaderForUrl(applicationScopedUrl, 'Token any-token');
			});
		});

		describe('without user secret', () => {
			beforeEach(() => {
				userSecret.set(null);
			});

			it('does not append authorization token', () => {
				expectAuthHeaderForUrl(applicationScopedUrl, null);
			});
		});
	});

	describe('when client calls external endpoint', () => {
		const externalUrl = 'https://some.external.testing.url.com/undefined-endpoint/';

		it('does not append authorization header', () => {
			expectAuthHeaderForUrl(externalUrl, null);
		});
	});
});
