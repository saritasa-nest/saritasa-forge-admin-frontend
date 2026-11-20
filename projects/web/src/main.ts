import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';

import { AppConfig } from '@nf/common/core/services/app.config';
import { provideStorage } from '@nf/common/core/utils/storage';

import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app';
import { WebAppConfig } from './app/features/shared/web-app.config';
import { provideWebAppRoutes } from './app/features/shared/web-route-paths';

bootstrapApplication(AppComponent, {
	providers: [
		provideZonelessChangeDetection(),
		importProvidersFrom(BrowserModule),
		{ provide: AppConfig, useClass: WebAppConfig },
		provideHttpClient(),
		provideRouter(appRoutes),
		provideWebAppRoutes(),
		provideStorage(),
		provideLuxonDateAdapter(),
	],
}).catch(err => console.error(err));
