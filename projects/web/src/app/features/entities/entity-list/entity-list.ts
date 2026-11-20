import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';

import { EntityApiService } from '@nf/common/core/services/entity-api';
import { groupEntities } from '@nf/common/core/utils/group-entities';
import { LoadingSpinner } from '@nf/common/shared/components/loading-spinner/loading-spinner';

/** Entities grouped by their configured group. */
@Component({
    selector: 'nfw-entity-list',
    templateUrl: './entity-list.html',
    styleUrl: './entity-list.css',
    imports: [
        MatListModule,
        MatTooltip,
        LoadingSpinner,
    ],
})
export class EntityListPage {
    private readonly entityApiService = inject(EntityApiService);

    /** Entities. */
    protected readonly entities = rxResource({
        stream: () => this.entityApiService.getEntities(),
    });

    /** Entities grouped by group name. */
    protected readonly groups = computed(() => groupEntities(this.entities.value() ?? []));
}
