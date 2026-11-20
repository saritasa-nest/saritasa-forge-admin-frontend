import { FormControl } from '@angular/forms';
import { type Subscription } from 'rxjs';
import { z } from 'zod';

import { tickAsync } from '@nf/common/testing/utils';

import { listenControlChanges } from './listen-control-changes';

describe('listenControlChanges(x)', () => {
	let subscriptions: Subscription[] = [];

	beforeEach(() => {
		subscriptions = [];
	});

	afterEach(() => {
		subscriptions.forEach(subscription => subscription.unsubscribe());
	});

	it('emits initial value', async () => {
		const initControlValue = 'Hello world!';
		const testControl = new FormControl<string>(initControlValue);

		const values: string[] = [];
		const DEBOUNCE_MS = 50;
		subscriptions.push(
			listenControlChanges(testControl, z.string(), undefined, DEBOUNCE_MS).subscribe(val => {
				values.push(val);
			}),
		);

		await tickAsync(DEBOUNCE_MS);

		expect(values).toContain(initControlValue);
	});

	it('emits new value', async () => {
		const initControlValue = 'Hello world!';
		const newValue = 'New value';
		const testControl = new FormControl<string>(initControlValue);

		const values: string[] = [];
		const DEBOUNCE_MS = 50;
		subscriptions.push(
			listenControlChanges(testControl, z.string(), undefined, DEBOUNCE_MS).subscribe(val => {
				values.push(val);
			}),
		);
		await tickAsync(DEBOUNCE_MS);
		testControl.setValue(newValue);
		await tickAsync(DEBOUNCE_MS);

		expect(values).toContain(initControlValue);
		expect(values).toContain(newValue);
	});
});
