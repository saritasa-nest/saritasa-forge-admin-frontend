import { type SetNonNullable, type SetRequired } from 'type-fest';

/** Transform object with nullable properties to non-nullable. */
export type NonNullableProperties<T extends Record<string, unknown>, K extends keyof T> = SetRequired<SetNonNullable<T, K>, K>;
