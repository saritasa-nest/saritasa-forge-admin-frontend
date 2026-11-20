import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

import { AbstractDialog } from '@saanbo/common/core/utils/abstracts/dialog';

// TODO: Remove this example during project initialization.
/** Minimal example of a dialog using the shared typed foundation. */
@Component({
	selector: 'saanbow-example-dialog',
	templateUrl: './example-dialog.html',
	imports: [MatButton, MatDialogActions, MatDialogContent, MatDialogTitle],
})
export class ExampleDialog extends AbstractDialog {}
