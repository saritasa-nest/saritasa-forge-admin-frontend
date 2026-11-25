import { type EntitySummary } from '../models/entity-summary';

import { groupEntities } from './group-entities';

function createEntity(pluralName: string, groupName: string): EntitySummary {
    return {
        stringId: pluralName,
        pluralName,
        description: null,
        group: { name: groupName, description: null },
    };
}

describe('groupEntities', () => {
    it('puts entities of the same group together under that group', () => {
        const groups = groupEntities([
            createEntity('Roles', 'Identity'),
            createEntity('Tokens', 'Shops'),
            createEntity('Users', 'Identity'),
        ]);

        expect(groups.map(group => group.name)).toEqual(['Identity', 'Shops']);
        expect(groups[0]?.entities.map(entity => entity.pluralName)).toEqual(['Roles', 'Users']);
        expect(groups[1]?.entities.map(entity => entity.pluralName)).toEqual(['Tokens']);
    });

    it('lists entities of a group alphabetically', () => {
        const groups = groupEntities([
            createEntity('Tokens', 'Shops'),
            createEntity('Addresses', 'Shops'),
            createEntity('Orders', 'Shops'),
        ]);

        expect(groups[0]?.entities.map(entity => entity.pluralName)).toEqual(['Addresses', 'Orders', 'Tokens']);
    });
});
