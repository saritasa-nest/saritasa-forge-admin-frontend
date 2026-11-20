import { type StrictOmit } from './strict-omit';

describe('StrictOmit', () => {
    describe('when omitting existing keys', () => {
        it('removes a single property', () => {
            type Input = {
                id: number;
                name: string;
                email: string;
            };

            type Result = StrictOmit<Input, 'name'>;

            expectTypeOf<Result['id']>().toEqualTypeOf<number>();
            expectTypeOf<Result['email']>().toEqualTypeOf<string>();

            // @ts-expect-error 'name' has been omitted
            type _ = Result['name'];
        });

        it('removes multiple properties', () => {
            type Input = {
                id: number;
                name: string;
                email: string;
            };

            type Result = StrictOmit<Input, 'name' | 'email'>;

            expectTypeOf<Result['id']>().toEqualTypeOf<number>();

            // @ts-expect-error 'name' has been omitted
            type _Name = Result['name'];

            // @ts-expect-error 'email' has been omitted
            type _Email = Result['email'];
        });
    });

    describe('when omitting non-existent keys', () => {
        it('produces a compile-time error', () => {
            type Input = {
                id: number;
                name: string;
            };

            // @ts-expect-error 'missing' is not a key of Input
            type _ = StrictOmit<Input, 'missing'>;
        });
    });
});
