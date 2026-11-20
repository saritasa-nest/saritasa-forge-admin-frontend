import { type MockedObject } from 'vitest';
import { FormControl } from '@angular/forms';
import { type Observer, tap } from 'rxjs';

import { createObserverSpy, createTestScheduler } from '@nf/common/testing/utils';

import { disableControlUntilEmitOrFailed } from './disable-control-until-emit';

describe('disableControlUntilEmitOrFailed(x)', () => {
    let control: FormControl;
    let observerSpy: MockedObject<Observer<unknown>>;

    beforeEach(() => {
        control = new FormControl();
        observerSpy = createObserverSpy();
    });

    describe('value is emitted', () => {
        it('enables control', () => {
            const scheduler = createTestScheduler();
            scheduler.run(({ cold, flush }) => {
                expect(control.enabled).toBe(true);

                cold('-a|').pipe(disableControlUntilEmitOrFailed(control))
                    .subscribe(observerSpy);

                expect(control.disabled).toBe(true);
                flush();
                expect(control.enabled).toBe(true);
            });
        });
    });

    describe('stream failed', () => {
        it('enables control', () => {
            expect(control.enabled).toBe(true);
            const scheduler = createTestScheduler();

            scheduler.run(({ cold, flush }) => {
                cold('-a|')
                    .pipe(
                        tap(() => {
                            throw new Error('test');
                        }),
                        disableControlUntilEmitOrFailed(control),
                    )
                    .subscribe(observerSpy);

                expect(control.disabled).toBe(true);
                flush();
                expect(control.enabled).toBe(true);
            });
        });
    });
});
