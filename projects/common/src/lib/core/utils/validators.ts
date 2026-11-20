import { validate, type SchemaPath, type LogicFn } from '@angular/forms/signals';

export namespace AppValidators {

	/** Mach field error kind. */
	export const matchFieldKind = 'matchField';

	/** Configuration object with options for the match validator. */
	type MatchConfig<TValue> = Readonly<{

		/** A reactive function determining when the validator is active. */
		when?: LogicFn<TValue, boolean>;

		/** Custom error message string. */
		message?: string;
	}>;

	/**
	 * Registers a validator that ensures the current field value matches another field.
	 * @param path Schema path of the field to validate.
	 * @param matchTo Second field to check matching with.
	 * @param config Optional validator configuration.
	 * @example
	 * ```ts
	 * AppValidators.matchField(
	 *  schema.passwordConfirmation,
	 *  schema.password,
	 *  {
	 *     message: 'Passwords don\'t match',
	 *  },
	 * );
	 * ```
	 */
	export function matchField<TValue>(
		path: SchemaPath<TValue>,
		matchTo: SchemaPath<TValue>,
		config?: MatchConfig<TValue>,
	): void {
		validate(path, context => {
			if (config?.when != null && !config.when(context)) {
				return null;
			}

			const currentValue = context.value();
			const targetValue = context.valueOf(matchTo);

			if (currentValue != null && targetValue != null && currentValue !== targetValue) {
				return {
					kind: matchFieldKind,
					message: config?.message ?? 'Fields do not match.',
				};
			}

			return null;
		});
	}
}
