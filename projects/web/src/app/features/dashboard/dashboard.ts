import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

import { AppConfig } from '@saanbo/common/core/services/app.config';
import { UserService } from '@saanbo/common/core/services/user';
import { toggleExecutionState } from '@saanbo/common/core/utils/rxjs/toggle-execution-state';
import { LoadingSpinner } from '@saanbo/common/shared/components/loading-spinner/loading-spinner';
import { DialogService } from '@saanbo/common/core/services/dialog';
import { SnackBarService } from '@saanbo/common/core/services/snack-bar';

import { injectWebAppRoutes } from '../shared/web-route-paths';

import { ExampleDialog } from './example-dialog';

/** Placeholder dashboard. */
@Component({
	selector: 'saanbow-dashboard',
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
	imports: [
		MatIconModule,
		MatButton,
		RouterLink,
		LoadingSpinner,
	],
})
export class DashboardPage {
	/** Users service. */
	protected readonly userService = inject(UserService);

	/** App config service. */
	protected readonly appConfigService = inject(AppConfig);

	private readonly destroyRef = inject(DestroyRef);

	/** Whether the controls should be marked as in loading state. */
	protected readonly isLoading = signal(false);

	/** Route paths. */
	protected readonly routePaths = injectWebAppRoutes();

	/** Current user signal. */
	protected readonly currentUser = this.userService.currentUser;

	private readonly dialogService = inject(DialogService);

	private readonly snackBarService = inject(SnackBarService);

	/** Opens the basic dialog example. */
	protected onOpenDialog(): void {
		this.dialogService.open(ExampleDialog, {});
	}

	/** Opens Angular Material's default snackbar. */
	protected onOpenSnackBar(): void {
		this.snackBarService.open('Angular Material snackbar is ready to use.', 'Close');
	}

	/** Handles click on logout button. */
	protected onLogoutClick(): void {
		this.userService.logout().pipe(
			toggleExecutionState(isLoading => this.isLoading.set(isLoading)),
			takeUntilDestroyed(this.destroyRef),
		)
			.subscribe();
	}
}
