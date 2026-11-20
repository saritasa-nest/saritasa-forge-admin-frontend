import { type OperatorFunction, type Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { type WithOptionalFieldTree, type FieldTree, type TreeValidationResult, type ValidationError } from '@angular/forms/signals';

import { AppValidationError, type EntityValidationErrors } from '../../models/app-error';

/** Server error kind. */
export const SERVER_ERROR_KIND = 'serverError';

/**
 * Util operator function to catch `AppValidationError` on presentational logic.
 * @param field Form field to catch an error for.
 */
export function catchValidationData<T extends Record<string, unknown>, R>(
	field: FieldTree<T>,
): OperatorFunction<R, R | TreeValidationResult> {
	return source$ =>
		source$.pipe(
			catchValidationError(({ validationData }) => of(collectValidationErrors(validationData, field))),
		);
}

/**
 * Catch application validation error (instance of AppValidationError) operator.
 * Catches only AppValidationError<T> errors.
 * @param selector Selector.
 */
export function catchValidationError<TEntity extends Record<string, unknown>, T, R>(
	selector: (error: AppValidationError<TEntity>) => Observable<R>,
): OperatorFunction<T, T | R> {
	return catchError((error: unknown) => {
		if (error instanceof AppValidationError) {
			return selector(error);
		}

		return throwError(() => error);
	});
}

/**
 * Recursively collects ValidationErrors.
 * @param errors Entity validation errors.
 * @param field Field tree.
 */
function collectValidationErrors(
	errors: EntityValidationErrors<Record<string, unknown>>,
	field: FieldTree<Record<string, unknown>>,
): WithOptionalFieldTree<ValidationError>[] {
	return Object.keys(errors).flatMap(key => {
		const error = errors[key];

		if (error == null) {
			return [];
		}

		const fieldTree = field[key];

		if (typeof error === 'string' || Array.isArray(error)) {
			return [
				{
					kind: SERVER_ERROR_KIND,
					message: typeof error === 'string' ? error : (error.at(0) ?? ''),
					fieldTree,
				},
			];
		}

		return fieldTree != null && typeof fieldTree().value() === 'object' && isNestedValidationErrors(error) ?
			collectValidationErrors(error, fieldTree as FieldTree<Record<string, unknown>>) :
			[];
	});
}

/**
 * Type guard to check whether a validation error value is a nested entity validation errors object
 * rather than a message string or a list of messages.
 * @param value Value to check.
 */
function isNestedValidationErrors(
	value: string | readonly string[] | EntityValidationErrors<Record<string, unknown>>,
): value is EntityValidationErrors<Record<string, unknown>> {
	return typeof value === 'object' && !Array.isArray(value);
}
