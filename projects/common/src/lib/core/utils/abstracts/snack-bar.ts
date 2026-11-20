import { Directive, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

/** Base class for a snack bar with strongly typed input data. */
@Directive()
export abstract class AbstractSnackBar<TData = void> {
	/** Reference to the current snack bar. */
	protected readonly snackBarRef = inject<MatSnackBarRef<this>>(MatSnackBarRef);

	/** Data passed to the current snack bar. */
	protected readonly snackBarData = inject<TData>(MAT_SNACK_BAR_DATA);

	/** Dismisses the snack bar. */
	protected dismiss(): void {
		this.snackBarRef.dismiss();
	}
}
