import { Component, computed, input } from '@angular/core';
import { type WithOptionalFieldTree, type ValidationError } from '@angular/forms/signals';

const DEFAULT_ERROR_MESSAGE = 'Value is not valid';

/** Validation error renderer for signal forms. */
@Component({
	selector: 'nfc-validation-message',
	templateUrl: './validation-message.html',
	styleUrl: './validation-message.css',
})
export class ValidationMessage {
	/** From field. */
	public readonly errors = input.required<readonly WithOptionalFieldTree<ValidationError>[]>();

	/** The first error message to display, or `null` when there are no errors. */
	protected readonly errorMessage = computed(() => {
		if (this.errors().length === 0) {
			return null;
		}

		return this.errors().at(0)?.message ?? DEFAULT_ERROR_MESSAGE;
	});
}
