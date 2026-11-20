import { type Except } from 'type-fest';

/** This type is a stricter version of Omit. */
export type StrictOmit<T, K extends keyof T> = Except<T, K>;
