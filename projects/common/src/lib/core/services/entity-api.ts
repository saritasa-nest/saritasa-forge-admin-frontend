import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { type EntitySummary } from '../models/entity-summary';
import { EntitySummaryMapper } from '../mappers/entity-summary.mapper';
import { entitySummaryDtoSchema } from '../dtos/entity-summary.dto';

import { AppUrlsConfig } from './app-urls.config';

/** Reads entities metadata. */
@Service()
export class EntityApiService {
    private readonly apiUrls = inject(AppUrlsConfig);

    private readonly httpClient = inject(HttpClient);

    /** Returns entities shown in the admin panel. */
    public getEntities(): Observable<readonly EntitySummary[]> {
        return this.httpClient.get<unknown>(this.apiUrls.entities.list).pipe(
            map(response => entitySummaryDtoSchema.array().parse(response)),
            map(entityDtos => entityDtos.map(entityDto => EntitySummaryMapper.fromDto(entityDto))),
        );
    }
}
