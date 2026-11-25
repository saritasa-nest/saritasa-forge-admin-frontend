import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { type Observable, NEVER, of, throwError } from 'rxjs';

import { type EntitySummary } from '@nf/common/core/models/entity-summary';
import { EntityApiService } from '@nf/common/core/services/entity-api';

import { EntityListPage } from './entity-list';

function createEntity(
    pluralName: string,
    groupName: string,
    options: Readonly<{ description?: string | null; groupDescription?: string | null; }> = {},
): EntitySummary {
    return {
        stringId: pluralName,
        pluralName,
        description: options.description ?? null,
        group: { name: groupName, description: options.groupDescription ?? null },
    };
}

describe('EntityListPage', () => {
    function createPage(entities$: Observable<readonly EntitySummary[]>): ComponentFixture<EntityListPage> {
        TestBed.configureTestingModule({
            imports: [EntityListPage],
            providers: [
                {
                    provide: EntityApiService,
                    useValue: { getEntities: () => entities$ },
                },
            ],
        });
        return TestBed.createComponent(EntityListPage);
    }

    async function renderLoaded(entities$: Observable<readonly EntitySummary[]>): Promise<HTMLElement> {
        const fixture = createPage(entities$);
        await fixture.whenStable();
        fixture.detectChanges();
        return fixture.nativeElement as HTMLElement;
    }

    it('shows a spinner while entities are loading', () => {
        const fixture = createPage(NEVER);
        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;
        expect(element.querySelector('[role="progressbar"]')).not.toBeNull();
    });

    it('shows an error message when loading fails', async () => {
        const element = await renderLoaded(throwError(() => new Error('boom')));

        expect(element.textContent).toContain('Failed to load entities.');
    });

    it('shows an empty message when there are no entities', async () => {
        const element = await renderLoaded(of([]));

        expect(element.textContent).toContain('No entities configured to be displayed.');
    });

    async function renderItemTexts(entities: readonly EntitySummary[]): Promise<string[]> {
        const element = await renderLoaded(of(entities));
        return Array.from(element.querySelectorAll('mat-list-item'), item => (item.textContent ?? '').trim());
    }

    it('lists an entity with its description', async () => {
        const entities = [createEntity('Users', 'Identity', { description: 'App users' })];

        const items = await renderItemTexts(entities);

        expect(items).toHaveLength(1);
        expect(items[0]).toContain('Users');
        expect(items[0]).toContain('App users');
    });

    it('lists an entity without a description by its name only', async () => {
        const entities = [createEntity('Orders', 'Shops')];

        const items = await renderItemTexts(entities);

        expect(items).toEqual(['Orders']);
    });

    it('lists every entity of a group', async () => {
        const entities = [
            createEntity('Users', 'Identity'),
            createEntity('Roles', 'Identity'),
            createEntity('Orders', 'Shops'),
        ];

        const items = await renderItemTexts(entities);

        expect(items).toHaveLength(3);
        expect(items).toEqual(expect.arrayContaining(['Users', 'Roles', 'Orders']));
    });

    it('shows each group title with the group description as a tooltip', async () => {
        const fixture = createPage(of([
            createEntity('Users', 'Identity', { groupDescription: 'Accounts and roles' }),
        ]));
        await fixture.whenStable();
        fixture.detectChanges();

        const tooltips = fixture.debugElement.queryAll(By.directive(MatTooltip));

        expect(tooltips).toHaveLength(1);
        expect((tooltips[0]?.nativeElement as HTMLElement).textContent?.trim()).toBe('Identity');
        expect(tooltips[0]?.injector.get(MatTooltip).message).toBe('Accounts and roles');
    });
});
