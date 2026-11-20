import { defer, EMPTY, merge, type MonoTypeOperatorFunction } from 'rxjs';
import { finalize, ignoreElements, shareReplay } from 'rxjs/operators';

/**
 * Toggles loading state when observable execution starts and ends.
 * @param setState Function to set loading state.
 */
export function toggleExecutionState<T>(setState: (isLoading: boolean) => void): MonoTypeOperatorFunction<T> {
    const startLoadingSideEffect$ = defer(() => {
        setState(true);
        return EMPTY;
    });

    return source$ => {
        const sharedSource$ = source$.pipe(shareReplay({ refCount: true, bufferSize: 1 }));
        const finishLoadingSideEffect$ = sharedSource$.pipe(
            ignoreElements(),
            finalize(() => setState(false)),
        );

        return merge(
            startLoadingSideEffect$,
            finishLoadingSideEffect$,
            sharedSource$,
        );
    };
}
