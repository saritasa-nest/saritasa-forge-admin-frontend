import { default as saritasaEslintConfig } from '@saritasa-nest/eslint-config-angular';
import format from 'eslint-plugin-format';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    saritasaEslintConfig,
    {
        files: ['**/*.{ts,js,mjs,cjs}'],
        rules: {
            '@stylistic/indent': ['error', 4],
            '@stylistic/indent-binary-ops': ['error', 4],
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
                            pattern: '@nf/**',
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
                            group: ['@nf/*', '!@nf/common'],
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
                    prefix: 'nfc',
                    style: 'kebab-case',
                    type: 'element',
                },
            ],
            '@angular-eslint/directive-selector': [
                'error',
                {
                    prefix: 'nfc',
                    style: 'camelCase',
                    type: 'attribute',
                },
            ],
            '@angular-eslint/pipe-prefix': [
                'error',
                {
                    prefixes: ['nfc'],
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
                    prefix: 'nfw',
                    style: 'kebab-case',
                    type: 'element',
                },
            ],
            '@angular-eslint/directive-selector': [
                'error',
                {
                    prefix: 'nfw',
                    style: 'camelCase',
                    type: 'attribute',
                },
            ],
            '@angular-eslint/pipe-prefix': [
                'error',
                {
                    prefixes: ['nfw'],
                },
            ],
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            // Restrict imports from any app that is NOT 'web' or 'common'.
                            // This effectively allows `@nf/web/shared` while still blocking `@nf/mobile/*`, etc.
                            group: ['@nf/!(web|common)/*'],
                            message: 'The web app cannot import from other applications. Use \'@nf/common\' for shared code, or \'@nf/web/shared\' for web-specific shared code.',
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
                    tabWidth: 4,
                    useTabs: false,
                },
            ],
        },
    },
);
