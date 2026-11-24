import { type EntityGroupWithEntities, type EntitySummary } from '../models/entity-summary';

/**
 * Groups entities by group name.
 * Groups keep the order of first appearance after sorting entities by name.
 * @param entities Entities.
 */
export function groupEntities(entities: readonly EntitySummary[]): readonly EntityGroupWithEntities[] {
    const sortedEntities = [...entities].sort((first, second) => first.pluralName.localeCompare(second.pluralName));
    const groupsByName = Map.groupBy(sortedEntities, entity => entity.group.name);

    return Array.from(groupsByName.values(), entitiesInGroup => {
        const [firstEntity] = entitiesInGroup;
        if (firstEntity == null) {
            throw new Error('No entity in the group.');
        }

        return { ...firstEntity.group, entities: entitiesInGroup };
    });
}
