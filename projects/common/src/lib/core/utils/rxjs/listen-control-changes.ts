import { type AbstractControl } from '@angular/forms';
import { defer, type Observable } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import { type z } from 'zod';

/** Default debounce time. */
export const DEFAULT_DEBOUNCE_TIME = 300;

/**
 * Listens control's `valueChanges` field.
 * Immediately starts with default value of the control.
 * Adds delay and emits value only if it was changed.
 * Uses validation to schema to make sure the return value is correct.
 * @param control Form control.
 * @param schema Validation schema.
 * @param compare Function for distinctUntilChanged.
 * @param time Debounce time.
 */
export function listenControlChanges<T extends z.ZodType<unknown>>(
    control: AbstractControl,
    schema: T,
    compare?: (x: z.infer<T>, y: z.infer<T>) => boolean,
    time: number = DEFAULT_DEBOUNCE_TIME,
): Observable<z.infer<typeof schema>> {
    return defer(() =>
        control.valueChanges.pipe(
            startWith(control.value),
            tap(value => {
                const result = schema.safeParse(value);
                if (!result.success) {
                    console.warn('Validation error: ', result.error);
                }
            }),
            filter((value): value is z.infer<typeof schema> => schema.safeParse(value).success),
            debounceTime(time),
            distinctUntilChanged(compare),
        ));
}
