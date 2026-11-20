import { type ObjectPaths } from './object-paths';

describe('ObjectPaths', () => {
	describe('for a flat object', () => {
		it('accepts all top-level keys as valid paths', () => {
			type Input = {
				id: number;
				name: string;
			};

			const _id: ObjectPaths<Input> = 'id';
			const _name: ObjectPaths<Input> = 'name';
		});

		it('rejects keys that do not exist on the object', () => {
			type Input = {
				id: number;
			};

			// @ts-expect-error 'missing' is not a valid path on Input
			const _: ObjectPaths<Input> = 'missing';
		});
	});

	describe('for a nested object', () => {
		it('rejects dot-notation paths that do not exist', () => {
			type UserShape = {
				name: string;
			};

			type Input = {
				user: UserShape;
			};

			// @ts-expect-error 'user.missing' is not a valid path on Input
			const _: ObjectPaths<Input> = 'user.missing';
		});

		it('accepts paths at every level of a deeply nested object', () => {
			type InnerShape = {
				c: string;
			};

			type MiddleShape = {
				b: InnerShape;
			};

			type Input = {
				a: MiddleShape;
			};

			const _a: ObjectPaths<Input> = 'a';
			const _ab: ObjectPaths<Input> = 'a.b';
			const _abc: ObjectPaths<Input> = 'a.b.c';
		});
	});

	describe('for arrays', () => {
		it('accepts the array key and numeric index paths', () => {
			type ItemShape = {
				label: string;
			};

			type Input = {
				items: readonly ItemShape[];
			};

			const _items: ObjectPaths<Input> = 'items';
			const _index: ObjectPaths<Input> = 'items.0';
			const _label: ObjectPaths<Input> = 'items.0.label';
		});
	});
});
