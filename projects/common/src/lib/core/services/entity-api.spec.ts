import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TestAppConfig } from '@nf/common/testing/test-app-config';

import { AppConfig } from './app.config';
import { AppUrlsConfig } from './app-urls.config';
import { EntityApiService } from './entity-api';

describe('EntityApiService', () => {
    let entityApiService: EntityApiService;
    let httpController: HttpTestingController;
    let listUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AppConfig, useClass: TestAppConfig },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });
        entityApiService = TestBed.inject(EntityApiService);
        httpController = TestBed.inject(HttpTestingController);
        listUrl = TestBed.inject(AppUrlsConfig).entities.list;
    });

    afterEach(() => {
        httpController.verify();
    });

    it('loads entities from the entities endpoint', () => {
        let result: unknown;
        entityApiService.getEntities().subscribe(entities => {
            result = entities;
        });

        const request = httpController.expectOne(listUrl);
        expect(request.request.method).toBe('GET');
        request.flush([
            {
                stringId: 'users',
                pluralName: 'Users',
                description: 'App users',
                group: { name: 'Identity', description: 'Accounts' },
            },
            {
                stringId: 'orders',
                pluralName: 'Orders',
                description: null,
                group: { name: 'Shops', description: null },
            },
        ]);

        expect(result).toEqual([
            {
                stringId: 'users',
                pluralName: 'Users',
                description: 'App users',
                group: { name: 'Identity', description: 'Accounts' },
            },
            {
                stringId: 'orders',
                pluralName: 'Orders',
                description: null,
                group: { name: 'Shops', description: null },
            },
        ]);
    });

    it('rejects a response that does not match the contract', () => {
        const onNext = vi.fn();
        const onError = vi.fn();
        entityApiService.getEntities().subscribe({ next: onNext, error: onError });

        httpController.expectOne(listUrl).flush([{ stringId: 'users' }]);

        expect(onNext).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalledOnce();
    });
});
