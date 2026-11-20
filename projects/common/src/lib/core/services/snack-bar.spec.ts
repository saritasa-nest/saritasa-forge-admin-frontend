import { TestBed } from '@angular/core/testing';
import {
	MatSnackBar,
	type MatSnackBarRef,
	type TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { AbstractSnackBar } from '../utils/abstracts/snack-bar';

import { SnackBarService } from './snack-bar';

type TestSnackBarData = Readonly<{
	message: string;
}>;

class TestSnackBar extends AbstractSnackBar<TestSnackBarData> {}

describe('SnackBarService', () => {
	const snackBarRef = {} as MatSnackBarRef<TextOnlySnackBar>;
	const componentSnackBarRef = {} as MatSnackBarRef<TestSnackBar>;
	const matSnackBar = {
		open: vi.fn().mockReturnValue(snackBarRef),
		openFromComponent: vi.fn().mockReturnValue(componentSnackBarRef),
	} as unknown as MatSnackBar;

	let snackBarService: SnackBarService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SnackBarService,
				{
					provide: MatSnackBar,
					useValue: matSnackBar,
				},
			],
		});
		snackBarService = TestBed.inject(SnackBarService);
	});

	it('opens Angular Material default text snack bar', () => {
		const config = {
			duration: 3_000,
		};

		const result = snackBarService.open('Test message', 'Close', config);

		expect(result).toBe(snackBarRef);
	});

	it('opens a component snack bar with typed data', () => {
		const config = {
			data: {
				message: 'Test message',
			},
		};

		const result = snackBarService.openFromComponent(TestSnackBar, config);

		expect(result).toBe(componentSnackBarRef);
	});
});
