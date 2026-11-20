import { type NonNullableProperties } from './non-nullable-properties';

describe('NonNullableProperties', () => {
	describe('for properties in the selected key set', () => {
		it('removes null from the property type', () => {
			type Input = {
				name: string | null;
				id: number;
			};

			expectTypeOf<NonNullableProperties<Input, 'name'>['name']>().toEqualTypeOf<string>();
		});

		it('removes undefined from the property type', () => {
			type Input = {
				value: string | undefined;
				id: number;
			};

			expectTypeOf<NonNullableProperties<Input, 'value'>['value']>().toEqualTypeOf<string>();
		});

		it('makes optional properties required by removing undefined from the type', () => {
			type Input = {
				email?: string;
			};

			expectTypeOf<NonNullableProperties<Input, 'email'>['email']>().toEqualTypeOf<string>();
		});

		it('removes both null and undefined from nullable optional properties', () => {
			type Input = {
				age?: number | null;
			};

			expectTypeOf<NonNullableProperties<Input, 'age'>['age']>().toEqualTypeOf<number>();
		});
	});

	describe('for properties NOT in the selected key set', () => {
		it('preserves the original type including null', () => {
			type Input = {
				name: string | null;
				id: number;
			};
			expectTypeOf<NonNullableProperties<Input, 'id'>['name']>().toEqualTypeOf<string | null>();
		});

		it('retains undefined in the type for originally optional properties', () => {
			type Input = {
				email?: string;
				id: number;
			};
			expectTypeOf<NonNullableProperties<Input, 'id'>['email']>().toEqualTypeOf<string | undefined>();
		});
	});

	describe('when a subset of keys is specified', () => {
		it('transforms multiple keys at once', () => {
			type User = {
				name: string | null;
				age?: number | null;
				id: number;
			};

			type Result = NonNullableProperties<User, 'name' | 'age'>;

			expectTypeOf<Result['name']>().toEqualTypeOf<string>();
			expectTypeOf<Result['age']>().toEqualTypeOf<number>();
			expectTypeOf<Result['id']>().toEqualTypeOf<number>();
		});
	});
});
