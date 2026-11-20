import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

/** Root component. */
@Component({
	selector: 'nfw-root',
	templateUrl: './app.html',
	styleUrl: './app.css',
	imports: [RouterOutlet],
})
export class AppComponent {
	private readonly matIconReg: MatIconRegistry = inject(MatIconRegistry);

	public constructor() {
		this.setupDefaultIconFontSet();
	}

	private setupDefaultIconFontSet(): void {
		// Replace the material-icons class with material-symbols-outlined (and keep the rest of the default font sets)
		// See: https://github.com/angular/components/issues/24845#issuecomment-1511399687
		const defaultFontSetClasses = this.matIconReg.getDefaultFontSetClass();
		const outlinedFontSetClasses = defaultFontSetClasses
			.filter(fontSetClass => fontSetClass !== 'material-icons')
			.concat(['material-symbols-outlined']);
		this.matIconReg.setDefaultFontSetClass(...outlinedFontSetClasses);
	}
}
