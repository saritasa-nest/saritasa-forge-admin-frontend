import { z } from 'zod';

/** Entity summary DTO schema. Item of `GET entities`. */
export const entitySummaryDtoSchema = z.object({

    /** Entity string identifier, used in URLs. */
    stringId: z.string(),

    /** Plural entity name. */
    pluralName: z.string(),

    /** Entity description. */
    description: z.string().nullable(),

    /** Entity group. */
    group: z.object({

        /** Group name. */
        name: z.string(),

        /** Group description. */
        description: z.string().nullable(),
    }),
});

/** Entity summary DTO. */
export type EntitySummaryDto = Readonly<z.infer<typeof entitySummaryDtoSchema>>;
