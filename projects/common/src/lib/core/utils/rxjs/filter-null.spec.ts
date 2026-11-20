import { createTestScheduler } from '@saanbo/common/testing/utils';

import { filterNull } from './filter-null';

describe('filterNull(x)', () => {
	it('filters only values that are non-nullable', () => {
		const subscriptionMarbles = '^------------!';
		const stream = '             -n-a-x-b--c-n-';
		const expected = '           ---a---b--c---';
		const values = {
			n: null,
			x: undefined,
			a: 1,
			b: { test: 1 },
			c: '123',
		};

		const testScheduler = createTestScheduler();
		testScheduler.run(({ cold, expectObservable }) => {
			const coldStream$ = cold(stream, values).pipe(filterNull());

			expectObservable(coldStream$, subscriptionMarbles).toBe(expected, values);
		});
	});
});
