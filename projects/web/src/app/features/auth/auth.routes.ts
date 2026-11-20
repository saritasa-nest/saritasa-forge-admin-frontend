import { type Routes } from '@angular/router';

import { webRoutePaths } from '../shared/web-route-paths';

import { ConfirmResetPasswordPage } from './confirm-reset-password/confirm-reset-password';
import { LoginPage } from './login/login';
import { ResetPasswordPage } from './reset-password/reset-password';

const authModulePaths = webRoutePaths.auth.children;

/** Auth routes. */
export const authRoutes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: authModulePaths.login.path },
	{ path: authModulePaths.login.path, component: LoginPage },
	{ path: authModulePaths.forgotPassword.path, component: ResetPasswordPage },
	{ path: authModulePaths.confirmPassword.path, component: ConfirmResetPasswordPage },
];
