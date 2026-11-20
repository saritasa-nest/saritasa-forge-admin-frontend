import { BehaviorSubject } from 'rxjs';

import { createTestScheduler } from '@nf/common/testing/utils';

import { toggleExecutionState } from './toggle-execution-state';

describe('toggleExecutionState(x)', () => {
    it('pushes `true` at start and `false` at finish', () => {
        const scheduler = createTestScheduler();

        scheduler.run(({ cold, flush }) => {
            const subject$ = new BehaviorSubject(false);

            expect(subject$.getValue()).toBe(false);

            cold('-a|')
                .pipe(toggleExecutionState(state => subject$.next(state)))
                .subscribe();

            expect(subject$.getValue()).toBe(true);
            flush();
            expect(subject$.getValue()).toBe(false);
        });
    });
});
