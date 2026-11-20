import { type MockedObject } from 'vitest';
import { type Observer, of, throwError } from 'rxjs';

import { createObserverSpy, createTestScheduler } from '@nf/common/testing/utils';

import { onMessageOrFailed } from './on-message-or-failed';

describe('onMessageOrFailed(x)', () => {
	let observerSpy: MockedObject<Observer<unknown>>;

	beforeEach(() => {
		observerSpy = createObserverSpy();
	});

	describe('error observable', () => {
		it('calls error listener', () => {
			const scheduler = createTestScheduler();

			scheduler.run(({ flush }) => {
				const dummyError = new Error('test');
				const errorHandlerSpy = vi.fn();

				throwError(() => dummyError)
					.pipe(onMessageOrFailed(errorHandlerSpy))
					.subscribe(observerSpy);
				flush();

				expect(observerSpy.error).toHaveBeenCalledTimes(1);

				expect(observerSpy.error).toHaveBeenCalledWith(dummyError);
				expect(errorHandlerSpy).toHaveBeenCalledWith();
			});
		});
	});

	describe('normal observable', () => {
		it('executes emit listener', () => {
			const dummyValue = 'test';
			const emitHandlerSpy = vi.fn();

			of(dummyValue).pipe(onMessageOrFailed(emitHandlerSpy))
				.subscribe(observerSpy);

			expect(observerSpy.next).toHaveBeenCalledTimes(1);

			expect(observerSpy.next).toHaveBeenCalledWith(dummyValue);
			expect(emitHandlerSpy).toHaveBeenCalledWith();
		});
	});
});
