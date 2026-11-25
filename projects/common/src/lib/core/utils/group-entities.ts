import { type EntityGroupWithEntities, type EntitySummary } from '../models/entity-summary';

/**
 * Groups entities by group name.
 * Groups keep the order of first appearance after sorting entities by name.
 * @param entities Entities.
 */
export function groupEntities(entities: readonly EntitySummary[]): readonly EntityGroupWithEntities[] {
    const sortedEntities = [...entities].sort((first, second) => first.pluralName.localeCompare(second.pluralName));
    const groupsByName = new Map<string, EntityGroupWithEntities & { entities: EntitySummary[]; }>();
    for (const entity of sortedEntities) {
        let group = groupsByName.get(entity.group.name);
        if (group == null) {
            group = { ...entity.group, entities: [] };
            groupsByName.set(entity.group.name, group);
        }

        group.entities.push(entity);
    }
    return [...groupsByName.values()];
}
