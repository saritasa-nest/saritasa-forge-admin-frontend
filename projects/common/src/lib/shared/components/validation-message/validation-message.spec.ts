import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { type ValidationError, type WithOptionalFieldTree } from '@angular/forms/signals';

import { byTestId } from '@nf/common/testing/utils';

import { ValidationMessage } from './validation-message';

describe('ValidationMessageComponent', () => {
	let fixture: ComponentFixture<ValidationMessage>;

	function queryMessageElement(): HTMLElement | null {
		return fixture.nativeElement.querySelector(byTestId('message'));
	}

	/**
	 * Generates a mock item satisfying the internal ValidationError structural contracts.
	 * @param kind Validation error kind.
	 * @param extra Additional error fields.
	 */
	function createValidationError(
		kind: string,
		extra: Record<string, unknown> = {},
	): WithOptionalFieldTree<ValidationError> {
		return {
			kind,
			...extra,
		};
	}

	beforeEach(() => {
		fixture = TestBed.createComponent(ValidationMessage);
	});

	describe('with error passed', () => {
		describe('and error is a ValidationErrorCode', () => {
			it('shows a message', () => {
				const mockError = createValidationError('mockError', { message: 'Error' });

				fixture.componentRef.setInput('errors', [mockError]);
				fixture.detectChanges();

				expect(queryMessageElement()).not.toBeNull();
				expect(queryMessageElement()?.textContent?.trim()).toBe('Error');
			});
		});

		describe('and a custom error passed', () => {
			beforeEach(() => {
				const mockError = createValidationError('someCustomErrorKey', {
					message: 'Error for testing',
				});

				fixture.componentRef.setInput('errors', [mockError]);
				fixture.detectChanges();
			});

			it('shows a message', () => {
				expect(queryMessageElement()).not.toBeNull();
				expect(queryMessageElement()?.textContent?.trim()).toBe('Error for testing');
			});
		});

		describe('and error contains no explicit message payload', () => {
			it('renders the default system fallback error text', () => {
				const mockError = createValidationError('required');

				fixture.componentRef.setInput('errors', [mockError]);
				fixture.detectChanges();

				expect(queryMessageElement()).not.toBeNull();
				expect(queryMessageElement()?.textContent?.trim()).toBe('Value is not valid');
			});
		});
	});

	describe('without an error passed', () => {
		it('shows no message container', () => {
			fixture.componentRef.setInput('errors', []);
			fixture.detectChanges();
			expect(queryMessageElement()).toBeNull();
		});
	});
});
