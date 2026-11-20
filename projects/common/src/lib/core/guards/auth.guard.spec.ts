import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { provideRouter, type Routes } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';

import { authGuard } from '@saanbo/common/core/guards/auth-guard';

import { UserService } from '../services/user';
import { type User } from '../models/user';

@Component({ selector: 'saanboc-first-fake', template: '' })
class FirstFakeComponent {}

@Component({ selector: 'saanboc-second-fake', template: '' })
class SecondFakeComponent {}

@Component({ selector: 'saanboc-third-fake', template: '' })
class ThirdFakeComponent {}

@Component({ selector: 'saanboc-fourth-fake', template: '' })
class FourthFakeComponent {}

@Component({ selector: 'saanboc-fifth-fake', template: '' })
class FifthFakeComponent {}

const ROOT_ROUTE = '';
const AUTHORIZED_LOGGED_IN_ROUTE = 'authorized-logged-in-route';
const AUTHORIZED_LOGGED_OUT_ROUTE = 'authorized-logged-out-route';
const UNAUTHORIZED_LOGGED_IN_ROUTE = 'unauthorized-logged-in-route';
const UNAUTHORIZED_LOGGED_OUT_ROUTE = 'unauthorized-logged-out-route';

const routes: Routes = [
	{
		path: ROOT_ROUTE,
		pathMatch: 'full',
		component: FirstFakeComponent,
	},
	{
		path: AUTHORIZED_LOGGED_IN_ROUTE,
		canMatch: [authGuard({ isAuthorized: true })],
		component: SecondFakeComponent,
	},
	{
		path: AUTHORIZED_LOGGED_OUT_ROUTE,
		canMatch: [authGuard({ isAuthorized: true })],
		component: ThirdFakeComponent,
	},
	{
		path: UNAUTHORIZED_LOGGED_IN_ROUTE,
		canMatch: [authGuard({ isAuthorized: false })],
		component: FourthFakeComponent,
	},
	{
		path: UNAUTHORIZED_LOGGED_OUT_ROUTE,
		canMatch: [authGuard({ isAuthorized: false })],
		component: FifthFakeComponent,
	},
];

describe('AuthGuard', () => {
	let currentUserSubject: ReplaySubject<User | null>;
	let location: Location;
	let routerTestingHarness: RouterTestingHarness;

	beforeEach(async () => {
		currentUserSubject = new ReplaySubject(1);

		TestBed.configureTestingModule({
			providers: [
				provideRouter(routes),
				{
					provide: UserService,
					useValue: {
						currentUser$: currentUserSubject,
					},
				},
			],
		});

		location = TestBed.inject(Location);
		routerTestingHarness = await RouterTestingHarness.create('/');
	});

	describe('when user is authorized', () => {
		beforeEach(() => {
			currentUserSubject.next({
				id: 0,
				firstName: 'Test',
				lastName: 'Test',
			});
		});

		it('allows to proceed to an authorized route', async () => {
			await routerTestingHarness.navigateByUrl(AUTHORIZED_LOGGED_IN_ROUTE);
			expect(location.path()).toContain(AUTHORIZED_LOGGED_IN_ROUTE);
		});

		it('does not allow to proceed to an unauthorized route', async () => {
			await routerTestingHarness.navigateByUrl(UNAUTHORIZED_LOGGED_IN_ROUTE);
			expect(location.path()).not.toContain(UNAUTHORIZED_LOGGED_IN_ROUTE);
		});
	});

	describe('when user is not authorized', () => {
		beforeEach(() => {
			currentUserSubject.next(null);
		});

		it('does not allows to proceed a authorized route', async () => {
			await routerTestingHarness.navigateByUrl(AUTHORIZED_LOGGED_OUT_ROUTE);
			expect(location.path()).not.toContain(AUTHORIZED_LOGGED_OUT_ROUTE);
		});

		it('allows to proceed to an unauthorized route', async () => {
			await routerTestingHarness.navigateByUrl(UNAUTHORIZED_LOGGED_OUT_ROUTE);
			expect(location.path()).toContain(UNAUTHORIZED_LOGGED_OUT_ROUTE);
		});
	});
});
