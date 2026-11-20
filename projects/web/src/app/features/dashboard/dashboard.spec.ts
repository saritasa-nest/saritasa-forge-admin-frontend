import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppConfig } from '@saanbo/common/core/services/app.config';
import { DialogService } from '@saanbo/common/core/services/dialog';
import { SnackBarService } from '@saanbo/common/core/services/snack-bar';
import { TestAppConfig } from '@saanbo/common/testing/test-app-config';
import { byTestId } from '@saanbo/common/testing/utils';

import { provideWebAppRoutes } from '../shared/web-route-paths';

import { DashboardPage } from './dashboard';
import { ExampleDialog } from './example-dialog';

describe('Dashboard', () => {
	const dialogOpen = vi.fn();
	const snackBarOpen = vi.fn();

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [DashboardPage],
			providers: [
				{ provide: AppConfig, useClass: TestAppConfig },
				provideRouter([]),
				{
					provide: DialogService,
					useValue: { open: dialogOpen },
				},
				{
					provide: SnackBarService,
					useValue: { open: snackBarOpen },
				},
				provideWebAppRoutes(),
			],
		});
	});

	it('renders', () => {
		const fixture = TestBed.createComponent(DashboardPage);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('opens the dialog example', () => {
		const fixture = TestBed.createComponent(DashboardPage);
		fixture.detectChanges();

		const button = fixture.nativeElement.querySelector(
			byTestId('dashboard-open-dialog-button'),
		) as HTMLButtonElement;
		button.click();

		expect(dialogOpen).toHaveBeenCalledTimes(1);
		expect(dialogOpen).toHaveBeenCalledWith(ExampleDialog, {});
	});

	it('opens the default snackbar example', () => {
		const fixture = TestBed.createComponent(DashboardPage);
		fixture.detectChanges();

		const button = fixture.nativeElement.querySelector(
			byTestId('dashboard-open-snackbar-button'),
		) as HTMLButtonElement;
		button.click();

		expect(snackBarOpen).toHaveBeenCalledTimes(1);
		expect(snackBarOpen).toHaveBeenCalledWith(expect.any(String), 'Close');
	});
});
