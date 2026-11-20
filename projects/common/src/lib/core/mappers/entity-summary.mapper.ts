import { type EntitySummary } from '../models/entity-summary';
import { type EntitySummaryDto } from '../dtos/entity-summary.dto';

/** Entity summary mapper. */
export namespace EntitySummaryMapper {

    /**
     * Maps entity summary DTO to model.
     * @param dto Entity summary DTO.
     */
    export function fromDto(dto: EntitySummaryDto): EntitySummary {
        return {
            stringId: dto.stringId,
            pluralName: dto.pluralName,
            description: dto.description,
            group: {
                name: dto.group.name,
                description: dto.group.description,
            },
        };
    }
}
