import { inject, Service } from '@angular/core';
import {
	MatDialog,
	type MatDialogConfig,
	type MatDialogRef,
} from '@angular/material/dialog';

import type { ComponentType } from '@angular/cdk/portal';
import type { AbstractDialog } from '../utils/abstracts/dialog';
import type { StrictOmit } from '../utils/types/strict-omit';

/** Configuration for a type-safe dialog. */
export type DialogConfig<TData> = StrictOmit<MatDialogConfig<TData>, 'data'> & (
	[TData] extends [void] ? Readonly<{

		/** Dialogs without an input type cannot receive data. */
		data?: never;
	}> : Readonly<{

		/** Data to be injected into the dialog component. */
		data: TData;
	}>
);

/** Opens dialogs while preserving their input and result types. */
@Service()
export class DialogService {
	private readonly matDialog = inject(MatDialog);

	/**
	 * Opens a dialog.
	 * @param component Dialog component.
	 * @param config Dialog configuration.
	 */
	public open<TData, TResult, TComponent>(
		component: ComponentType<AbstractDialog<TData, TResult> & TComponent>,
		config: DialogConfig<NoInfer<TData>>,
	): MatDialogRef<TComponent, TResult> {
		return this.matDialog.open<TComponent, TData, TResult>(component, config);
	}
}
