import { Component, input } from '@angular/core';
import { MatProgressSpinner, type ProgressSpinnerMode } from '@angular/material/progress-spinner';

/** Loading spinner component. */
@Component({
    selector: 'nfc-loading-spinner',
    templateUrl: './loading-spinner.html',
    styleUrl: './loading-spinner.css',
    imports: [MatProgressSpinner],
    host: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '[class.progress-spinner-container]': 'true',
    },
})
export class LoadingSpinner {
    /** Loading spinner mode. */
    public readonly mode = input<ProgressSpinnerMode>('indeterminate');

    /** Diameter of the spinner. */
    public readonly diameter = input(20);
}
