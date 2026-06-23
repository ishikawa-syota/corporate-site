import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import importPlugin from 'eslint-plugin-import-x';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	{
		plugins: {
			'import-x': importPlugin,
		},
		settings: {
			'import-x/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
				node: true,
			},
			'import-x/ignore': [
				'astro:assets',
				'\\.scss$',
				'\\.css$',
				'\\.jpg$',
				'\\.jpeg$',
				'\\.png$',
				'\\.svg$',
				'\\.webp$',
				'gsap',
				'accordion-js',
			],
		},
		rules: {
			// Import ordering rules
			'import-x/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'type',
					],
					pathGroups: [
						{
							pattern: 'astro',
							group: 'external',
							position: 'before',
						},
						{
							pattern: 'astro/**',
							group: 'external',
							position: 'before',
						},
						{
							pattern: '@/assets/**',
							group: 'internal',
							position: 'before',
						},
						{
							pattern: '@/components/**',
							group: 'parent',
						},
						{
							pattern: '@/data/**',
							group: 'sibling',
						},
						{
							pattern: '@/**',
							group: 'index',
						},
					],
					pathGroupsExcludedImportTypes: ['builtin', 'type'],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					warnOnUnassignedImports: false,
				},
			],
			'import-x/first': 'error',
			'import-x/newline-after-import': 'error',
			'import-x/no-duplicates': 'error',
			'import-x/no-unresolved': [
				'error',
				{
					ignore: [
						'astro:assets',
						'astro:types',
						'gsap',
						'gsap/ScrollTrigger',
						'accordion-js',
						'accordion-js/dist/accordion.min.css',
						// Allow relative imports for non-existent components (they might be created later)
						'\\.\\.?/.*\\.astro$',
					],
				},
			],

			// TypeScript specific rules
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',

			// General rules
			'no-console': 'off', // 開発中はconsole.logを許可（本番ビルドで自動削除）
			'prefer-const': 'error',
			'no-var': 'error',
			'no-irregular-whitespace': 'off',
		},
	},
	{
		files: ['**/*.astro'],
		languageOptions: {
			parser: eslintPluginAstro.parser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.astro'],
				sourceType: 'module',
			},
		},
		rules: {
			// Astro specific rules
			'astro/no-conflict-set-directives': 'error',
			'astro/no-unused-define-vars-in-style': 'error',
			// Import rules
			'import-x/first': 'error',
			'import-x/newline-after-import': 'error',
			'import-x/no-duplicates': 'error',
			// Allow any in Astro props as it's common
			'@typescript-eslint/no-explicit-any': 'off',
			// Allow no-undef for Astro globals
			'no-undef': 'off',
			// More lenient import resolution for assets
			'import-x/no-unresolved': [
				'error',
				{
					ignore: [
						'\\.jpg$',
						'\\.jpeg$',
						'\\.png$',
						'\\.svg$',
						'\\.webp$',
						'\\.scss$',
						'\\.css$',
						'astro:assets',
						'astro:types',
						'gsap',
						'gsap/ScrollTrigger',
						'accordion-js',
						'accordion-js/dist/accordion.min.css',
						// Allow relative imports for components that might not exist yet
						'\\.\\.?/.*\\.astro$',
						// Allow @/assets and @/components paths
						'@/assets/.*',
						'@/components/.*',
					],
				},
			],
		},
	},
	{
		files: ['**/*.mjs', '**/src/utils/*.js'],
		languageOptions: {
			globals: {
				console: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
			},
		},
		rules: {
			'no-console': 'off', // ビルドスクリプトではconsole.logを許可
		},
	},
	{
		ignores: [
			'dist/',
			'dist_bak_*/',
			'node_modules/',
			'.astro/',
			'public/',
			'*.config.*',
			'src/layouts/Layout.astro', // ESLintパーサーの問題で誤検知されるため除外
		],
	},
];
