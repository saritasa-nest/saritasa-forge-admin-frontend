import { inject, Service } from '@angular/core';
import {
    MatSnackBar,
    type MatSnackBarConfig,
    type MatSnackBarRef,
    type TextOnlySnackBar,
} from '@angular/material/snack-bar';

import type { ComponentType } from '@angular/cdk/portal';
import type { AbstractSnackBar } from '../utils/abstracts/snack-bar';
import type { StrictOmit } from '../utils/types/strict-omit';

/** Configuration for a type-safe component snack bar. */
export type SnackBarConfig<TData> = StrictOmit<MatSnackBarConfig<TData>, 'data'> & (
    [TData] extends [void] ? Readonly<{

        /** Snack bars without an input type cannot receive data. */
        data?: never;
    }> : Readonly<{

        /** Data to be injected into the snack-bar component. */
        data: TData;
    }>
);

/** Opens Angular Material snack bars. */
@Service()
export class SnackBarService {
    private readonly matSnackBar = inject(MatSnackBar);

    /**
     * Opens a default text snack bar.
     * @param message Message to display.
     * @param action Optional action label.
     * @param config Optional snack-bar configuration.
     */
    public open(
        message: string,
        action?: string,
        config?: MatSnackBarConfig,
    ): MatSnackBarRef<TextOnlySnackBar> {
        return this.matSnackBar.open(message, action, config);
    }

    /**
     * Opens a component snack bar.
     * @param component Snack-bar component.
     * @param config Snack-bar configuration.
     */
    public openFromComponent<TData, TComponent>(
        component: ComponentType<AbstractSnackBar<TData> & TComponent>,
        config: SnackBarConfig<NoInfer<TData>>,
    ): MatSnackBarRef<TComponent> {
        return this.matSnackBar.openFromComponent<TComponent, TData>(component, config);
    }
}
