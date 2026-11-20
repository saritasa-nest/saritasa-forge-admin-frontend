import { Directive, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/** Base class for a dialog with strongly typed input data and result. */
@Directive()
export abstract class AbstractDialog<TData = void, TResult = void> {
	/** Reference to the current dialog. */
	protected readonly dialogRef = inject<MatDialogRef<this, TResult>>(MatDialogRef);

	/** Data passed to the current dialog. */
	protected readonly dialogData = inject<TData>(MAT_DIALOG_DATA);

	/**
	 * Closes the dialog.
	 * @param result Optional result returned to the caller.
	 */
	protected close(result?: TResult): void {
		this.dialogRef.close(result);
	}
}
