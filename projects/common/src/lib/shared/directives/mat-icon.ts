import { Directive, input, computed } from '@angular/core';

/**
 * Material symbol configuration.
 * @see {@link [Applying Icons](https://m3.material.io/styles/icons/applying-icons)}.
 */
export type MaterialSymbolConfig = Readonly<{

    /** Icon type: Outlined = 0, Filled = 1. */
    fill?: 0 | 1;

    /** Icon weight. */
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;

    /** Icon grade. */
    grade?: -25 | 0 | 200;

    /** Icon optical size. */
    opsz?: 20 | 24 | 40 | 48;
}>;

/** Material icon settings directive. */
@Directive({
    selector: 'mat-icon[nfcMatIcon]',
    host: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '[style.font-variation-settings]': 'fontVariationSettings()',
    },
})
export class MatIconDirective {
    /** Filled or outlined. */
    public readonly isFilled = input(false);

    /** Weight (100–700). */
    public readonly weight = input<MaterialSymbolConfig['weight']>(400);

    /** Grade (-25–200). */
    public readonly grade = input<MaterialSymbolConfig['grade']>(0);

    /** Optical size (20–48). */
    public readonly opsz = input<MaterialSymbolConfig['opsz']>(24);

    /** Computed variation settings. */
    protected readonly fontVariationSettings = computed(() =>
        this.getFontVariationSettings({
            fill: this.isFilled() ? 1 : 0,
            weight: this.weight(),
            grade: this.grade(),
            opsz: this.opsz(),
        }));

    private getFontVariationSettings(config: MaterialSymbolConfig): string {
        const fill = config.fill ?? 0;
        const weight = config.weight ?? 400;
        const grade = config.grade ?? 0;
        const opsz = config.opsz ?? 24;

        return `"FILL" ${fill}, "wght" ${weight}, "GRAD" ${grade}, "opsz" ${opsz}`;
    }
}
