import { type HttpStatusCode } from '@angular/common/http';
import { defer, EMPTY, type Observable, type Observer, switchMap, timer } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { type MockedObject } from 'vitest';

/** Request status data. */
export type HttpStatusData = Readonly<{

    /** Http status. */
    status: number;

    /** Status represented by a human-readable string. */
    statusText: string;
}>;

/**
 * Returns status data by provided status code.
 * @param statusCode Status code.
 */
export function getHttpStatusData(statusCode: HttpStatusCode): HttpStatusData {
    return {
        status: statusCode,
        statusText: 'Dummy reason phrase',
    };
}

/** Creates observer spy object. */
export function createObserverSpy<T>(): MockedObject<Observer<T>> {
    return {
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
    };
}

/**
 * Replacement for Angular's tick() in Zoneless.
 * @param delayMs Timeout in milliseconds.
 */
export function tickAsync(delayMs = 0): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), delayMs);
    });
}

/**
 * Get selector by test ID.
 * @param id ID.
 */
export function byTestId(id: string): string {
    return `[data-testid="${id}"]`;
}

/** Create a new test scheduler. */
export function createTestScheduler(): TestScheduler {
    return new TestScheduler((actual, expected) => {
        expect(actual).deep.equal(expected);
    });
}

/**
 * Utils for reducing the boilerplate related to setting up asynchronous manipulations when testing observables.
 * Could only be used when a global test scheduler is initialized (via `initTestScheduler()`).
 */
export namespace TestSchedulerUtils {

    /**
     * Delays observable within the context of a current test scheduler.
     * @param timeMs Time in milliseconds for which the observable should be delayed.
     * @param observable$ Observable that should be delayed.
     */
    export function delayed<T>(timeMs: number, observable$: Observable<T>): Observable<T> {
        return timer(timeMs).pipe(switchMap(() => observable$));
    }

    /**
     * Delays a side effect callback within a context of a current test scheduler.
     * @param timeMs Represents time (in ms) for which the side effect should be delayed.
     * @param callback The side effect callback. Will be called when the scheduled time is passed.
     */
    export function delayedSideEffect(timeMs: number, callback: () => void): Observable<never> {
        return delayed(timeMs, defer(() => {
            callback();
            return EMPTY;
        }));
    }
}
