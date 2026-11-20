import { default as saritasaEslintConfig } from '@saritasa-nest/eslint-config-angular';
import format from 'eslint-plugin-format';
import { defineConfig } from 'eslint/config';

export default defineConfig(
	saritasaEslintConfig,
	{
		files: ['**/*.{ts,js,mjs,cjs}'],
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/indent-binary-ops': ['error', 'tab'],
			'@stylistic/no-tabs': 'off',
		},
	},
	{
		files: ['**/*.ts'],
		rules: {
			'import-x/order': [
				'error',
				{
					'distinctGroup': false,
					'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
					'newlines-between': 'always',
					'pathGroups': [
						{
							group: 'internal',
							pattern: '@saanbo/**',
						},
					],
					'pathGroupsExcludedImportTypes': [],
				},
			],
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['@saanbo/*', '!@saanbo/common'],
							message: `You can not import from one application to another directly,
							please move the reusable/shared entities into common library.
							https://wiki.saritasa.rocks/frontend/frameworks/angular/project-structure#relationships-between-applications`,
						},
					],
				},
			],
		},
	},
	{
		files: ['projects/common/**/*.ts'],
		rules: {
			'@angular-eslint/component-selector': [
				'error',
				{
					prefix: 'saanboc',
					style: 'kebab-case',
					type: 'element',
				},
			],
			'@angular-eslint/directive-selector': [
				'error',
				{
					prefix: 'saanboc',
					style: 'camelCase',
					type: 'attribute',
				},
			],
			'@angular-eslint/pipe-prefix': [
				'error',
				{
					prefixes: ['saanboc'],
				},
			],
		},
	},
	{
		files: ['projects/web/**/*.ts'],
		rules: {
			'@angular-eslint/component-selector': [
				'error',
				{
					prefix: 'saanbow',
					style: 'kebab-case',
					type: 'element',
				},
			],
			'@angular-eslint/directive-selector': [
				'error',
				{
					prefix: 'saanbow',
					style: 'camelCase',
					type: 'attribute',
				},
			],
			'@angular-eslint/pipe-prefix': [
				'error',
				{
					prefixes: ['saanbow'],
				},
			],
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							// Restrict imports from any app that is NOT 'web' or 'common'.
							// This effectively allows `@saanbo/web/shared` while still blocking `@saanbo/mobile/*`, etc.
							group: ['@saanbo/!(web|common)/*'],
							message: 'The web app cannot import from other applications. Use \'@saanbo/common\' for shared code, or \'@saanbo/web/shared\' for web-specific shared code.',
						},
					],
				},
			],
		},
	},
	{
		files: ['projects/**/*.html', 'projects/**/*.component.html'],
		ignores: ['projects/*/src/index.html'],
		plugins: { format },
		rules: {
			'format/prettier': [
				'error', {
					arrowParens: 'avoid',
					bracketSameLine: false,
					htmlWhitespaceSensitivity: 'ignore',
					parser: 'angular',
					printWidth: 120,
					singleAttributePerLine: true,
					useTabs: true,
				},
			],
		},
	},
);
