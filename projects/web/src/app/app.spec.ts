import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppConfig } from '@nf/common/core/services/app.config';
import { TestAppConfig } from '@nf/common/testing/test-app-config';

import { provideWebAppRoutes } from './features/shared/web-route-paths';
import { AppComponent } from './app';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                { provide: AppConfig, useClass: TestAppConfig },
                provideRouter([]),
                provideWebAppRoutes(),
            ],
        });
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
});
