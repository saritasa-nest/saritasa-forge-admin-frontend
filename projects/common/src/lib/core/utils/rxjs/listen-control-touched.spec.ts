import { FormControl } from '@angular/forms';
import { type Subscription } from 'rxjs';

import { listenControlTouched } from './listen-control-touched';

describe('listenControlTouched(x)', () => {
	let subscriptions: Subscription[];

	beforeEach(() => {
		subscriptions = [];
	});

	afterEach(() => {
		subscriptions.forEach(subscription => subscription.unsubscribe());
	});

	describe('after subscription', () => {
		describe('control touched', () => {
			it('emits true', () => {
				const control = new FormControl(null);
				let value = false;

				subscriptions.push(
					listenControlTouched(control).subscribe(isTouched => {
						value = isTouched;
					}),
				);
				control.markAsTouched();

				expect(value).toBe(true);
			});

			it('has correct value of "touched" property', () => {
				const control = new FormControl(null);
				let value = false;

				subscriptions.push(
					listenControlTouched(control).subscribe(() => {
						value = control.touched;
					}),
				);

				control.markAsTouched();

				expect(value).toBe(true);
			});
		});

		describe('control reset', () => {
			it('emits false', () => {
				const control = new FormControl(null);
				let value = false;
				subscriptions.push(
					listenControlTouched(control).subscribe(isTouched => {
						value = isTouched;
					}),
				);

				control.markAsTouched();
				expect(value).toBe(true);
				control.reset();
				expect(value).toBe(false);
			});
		});
	});

	describe('before subscription', () => {
		describe('control touched', () => {
			it('emits true', () => {
				const control = new FormControl(null);
				let value = false;

				control.markAsTouched();
				subscriptions.push(
					listenControlTouched(control).subscribe(isTouched => {
						value = isTouched;
					}),
				);

				expect(value).toBe(true);
			});
		});

		describe('control reset', () => {
			it('emits false', () => {
				const control = new FormControl(null);
				let value = false;

				control.markAsTouched();
				control.reset();
				subscriptions.push(
					listenControlTouched(control).subscribe(isTouched => {
						value = isTouched;
					}),
				);

				expect(value).toBe(false);
			});
		});
	});
});
