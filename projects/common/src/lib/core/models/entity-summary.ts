/** Entity group. */
export type EntityGroup = Readonly<{

    /** Group name. */
    name: string;

    /** Group description. */
    description: string | null;
}>;

/** Entity shown in the entities list. */
export type EntitySummary = Readonly<{

    /** Entity string identifier, used in URLs. */
    stringId: string;

    /** Plural entity name. */
    pluralName: string;

    /** Entity description. */
    description: string | null;

    /** Entity group. */
    group: EntityGroup;
}>;

/** Group with its entities. */
export type EntityGroupWithEntities = EntityGroup & Readonly<{

    /** Entities in the group, sorted by name. */
    entities: readonly EntitySummary[];
}>;
