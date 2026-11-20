import { HttpClient, HttpErrorResponse, HttpStatusCode, provideHttpClient, withInterceptors } from '@angular/common/http';
import { merge } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { type Mock } from 'vitest';

import { TestAppConfig } from '@saanbo/common/testing/test-app-config';
import { createTestScheduler, getHttpStatusData, TestSchedulerUtils } from '@saanbo/common/testing/utils';

import { AppUrlsConfig } from '../services/app-urls.config';
import { UserService } from '../services/user';
import { AppConfig } from '../services/app.config';

import { refreshTokenInterceptors } from './refresh-token.interceptor';

describe('RefreshTokenInterceptor', () => {
	let httpClient: HttpClient;
	let httpTestingController: HttpTestingController;
	let apiUrlsConfig: AppUrlsConfig;
	let refreshSecret: Mock;
	let errorObserverSpy: Mock;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([refreshTokenInterceptors])),
				provideHttpClientTesting(),
				UserService,
				{ provide: AppConfig, useClass: TestAppConfig },
				AppUrlsConfig,
			],
		});

		httpClient = TestBed.inject(HttpClient);
		httpTestingController = TestBed.inject(HttpTestingController);
		apiUrlsConfig = TestBed.inject(AppUrlsConfig);

		const userService = TestBed.inject(UserService);
		refreshSecret = vi.spyOn(userService, 'refreshSecret');
		errorObserverSpy = vi.fn();
	});

	function expectErrorToBePassed(url: string) {
		httpClient.get(url).subscribe({ error: errorObserverSpy });
		const testRequest = httpTestingController.expectOne(url, 'GET');
		testRequest.flush({}, getHttpStatusData(HttpStatusCode.Unauthorized));

		expect(errorObserverSpy).toHaveBeenCalledTimes(1);

		expect(errorObserverSpy).toHaveBeenCalledWith(expect.any(HttpErrorResponse));
		expect(refreshSecret).not.toHaveBeenCalled();
	}

	describe('when client calls application-scoped url that is not auth-related', () => {
		describe('and the request fails with "Unauthorized"', () => {
			const unauthorizedStatusData = getHttpStatusData(HttpStatusCode.Unauthorized);

			describe('with no requests in parallel', () => {
				let url: string;

				beforeEach(() => {
					url = apiUrlsConfig.user.currentProfile;
				});

				function testStandaloneRefresh() {
					const scheduler = createTestScheduler();
					scheduler.run(({ cold, flush, expectObservable, time }) => {
						const marbles = {
							subscription: '                       ^----------------!',
							firstErrorResponse: '                 --|               ',
							refreshSecret: '                        ---(x|)         ',
							secondSuccessResponse: '              ------------|     ',
							expected: '                           ------------(n|)  ',
						} as const;
						const values = { x: undefined, n: null };

						refreshSecret.mockReturnValue(cold(marbles.refreshSecret));

						const firstResponse$ = TestSchedulerUtils.delayedSideEffect(time(marbles.firstErrorResponse), () =>
							httpTestingController.expectOne(url, 'GET').flush({}, unauthorizedStatusData));

						const secondResponse$ = TestSchedulerUtils.delayedSideEffect(time(marbles.secondSuccessResponse), () =>
							httpTestingController.expectOne(url, 'GET').flush(null));

						expectObservable(merge(httpClient.get(url), firstResponse$, secondResponse$), marbles.subscription)
							.toBe(marbles.expected, values);
						flush();
					});
				}

				it('refreshes the secret', () => {
					const TEST_TIMES_AMOUNT = 5;

					// Test it several times since the interceptor is a stateful singleton,
					// need to make sure it works correctly even if it was already called before
					for (let i = 0; i < TEST_TIMES_AMOUNT; i++) {
						testStandaloneRefresh();

						// Verify that refreshSecret was called exactly once in this iteration
						expect(refreshSecret).toHaveBeenCalledTimes(i + 1);

						// Verify no pending HTTP requests from this iteration
						httpTestingController.verify();
					}

					expect(refreshSecret).toHaveBeenCalledTimes(TEST_TIMES_AMOUNT);
				});
			});

			describe('with several requests in parallel', () => {
				it('waits for the first refresh request to complete', () => {
					const testScheduler = createTestScheduler();
					const firstUrl = apiUrlsConfig.user.changePassword;
					const secondUrl = apiUrlsConfig.user.currentProfile;

					/**
					 * 1. Make a request
					 * 2. Make a second request in parallel
					 * 3. Fail the first request with 401
					 *      The interceptor starts refreshing the secret, since the first request is failed
					 *      and schedules a retry after the token is refreshed
					 * 4. Fail the second request with 401, while the token is being refreshed
					 *      The interceptor schedules a retry of a second request
					 * 5. Assure there is no second refresh called, since we're already refreshing it at the time (after first fail)
					 * 6. Make sure both requests are retried.
					 */
					const marbles = {
						subscription: '               ^---------------!',
						firstRequest: '               -|               ',
						firstRequestErrorResponse: '   ---|            ',
						refreshSecret: '                 ----(x|)      ',
						firstRequestRetryResponse: '  -----------|     ',
						secondRequest: '              --|              ',
						secondRequestErrorResponse: ' -----|           ',
						secondRequestRetryResponse: ' -------------|   ',
						expected: '                   -----------n-(n|)',
					};
					const values = { n: null, x: undefined };

					testScheduler.run(({ cold, time, flush, expectObservable }) => {
						const refreshToken$ = cold(marbles.refreshSecret, values);
						refreshSecret.mockReturnValue(refreshToken$);

						const firstRequest$ = TestSchedulerUtils.delayed(time(marbles.firstRequest), httpClient.get(firstUrl));
						const secondRequest$ = TestSchedulerUtils.delayed(time(marbles.secondRequest), httpClient.get(secondUrl));

						const firstRequestResponse$ = TestSchedulerUtils.delayedSideEffect(time(marbles.firstRequestErrorResponse), () =>
							httpTestingController.match(firstUrl).at(0)
								?.flush({}, unauthorizedStatusData));

						const secondRequestResponse$ = TestSchedulerUtils.delayedSideEffect(time(marbles.secondRequestErrorResponse), () =>
							httpTestingController.match(secondUrl).at(0)
								?.flush({}, unauthorizedStatusData));

						const firstRequestRetryResponse$ = TestSchedulerUtils.delayedSideEffect(
							time(marbles.firstRequestRetryResponse),
							() => httpTestingController.match(firstUrl).at(0)
								?.flush(null),
						);

						const secondRequestRetryResponse$ = TestSchedulerUtils.delayedSideEffect(
							time(marbles.secondRequestRetryResponse),
							() => httpTestingController.match(secondUrl).at(0)
								?.flush(null),
						);

						expectObservable(
							merge(
								firstRequest$,
								secondRequest$,
								firstRequestResponse$,
								secondRequestResponse$,
								firstRequestRetryResponse$,
								secondRequestRetryResponse$,
							),
							marbles.subscription,
						)
							.toBe(marbles.expected, values);
						flush();

						expect(refreshSecret).toHaveBeenCalledTimes(1);
						expect(refreshToken$.subscriptions.length).toBe(1);
					});
				});
			});
		});

		describe('and the request fails with an error that is not "Unauthorized"', () => {
			it('passes the error', () => {
				const url = apiUrlsConfig.user.changePassword;

				httpClient.get(url).subscribe({ error: errorObserverSpy });
				httpTestingController.expectOne(url, 'GET').flush({}, getHttpStatusData(HttpStatusCode.BadRequest));

				expect(refreshSecret).not.toHaveBeenCalled();
				expect(errorObserverSpy).toHaveBeenCalledTimes(1);
				expect(errorObserverSpy).toHaveBeenCalledWith(expect.any(HttpErrorResponse));
			});
		});
	});

	describe('when client calls auth-related url', () => {
		it('passes the error', () => {
			const authUrl = apiUrlsConfig.auth.login;
			expect(apiUrlsConfig.isAuthUrl(authUrl)).toBe(true);

			expectErrorToBePassed(authUrl);
		});
	});

	describe('when client calls url outside of the application scope', () => {
		it('ignores the error', () => {
			const externalUrl = 'example.com/test/';
			expect(apiUrlsConfig.isApplicationUrl(externalUrl)).toBe(false);
			expect(apiUrlsConfig.isAuthUrl(externalUrl)).toBe(false);

			expectErrorToBePassed(externalUrl);
		});
	});
});
