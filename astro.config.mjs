import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import relativeLinks from 'astro-relative-links';
import postcssMediaQueriesCombinator from 'postcss-combine-media-query';
import cssnano from 'cssnano';
// 開発中は検証を無効化して、ビルド時のみ読み込むようにコメントアウト
// import { metaValidator } from './src/utils/metaValidator.js';

// 環境に応じて条件付きインポート
const plugins = [];
if (process.env.NODE_ENV === 'production') {
	// 本番環境（ビルド時）のみメタバリデータを読み込む
	const { metaValidator } = await import('./src/utils/metaValidator.js');
	plugins.push(metaValidator());

	// 本番環境（ビルド時）のみanalyticsClassInjectorを読み込む
	const { analyticsClassInjector } = await import(
		'./src/utils/analyticsClassInjector.js'
	);
	plugins.push(analyticsClassInjector());
}

export default defineConfig({
	// 本番サイトのURLを設定してください（例: https://example.com）
	// NOTE: astro-relative-linksとの相性問題により、
	// sitemapは public/sitemap.xml に手動で配置しています
	integrations: [relativeLinks()],
	vite: {
		plugins,
		build: {
			assetsDir: 'assets',
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						let extType = assetInfo.name.split('.')[1];
						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							extType = 'images';
						}
						return `assets/${extType}/[name]-[hash][extname]`;
					},
					manualChunks: {
						vendor: ['astro/client'],
					},
				},
			},
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
				},
			},
			cssMinify: true,
		},
		css: {
			preprocessorOptions: {
				scss: {
					loadPaths: [
						fileURLToPath(new URL('./src', import.meta.url)),
					],
					additionalData: `@use "styles/foundation/index" as *;`,
				},
			},
			postcss: {
				plugins: [
					postcssMediaQueriesCombinator(),
					cssnano({
						preset: [
							'default',
							{
								discardComments: {
									removeAll: true,
								},
								mergeLonghand: true,
								mergeRules: true,
								mergeIdents: true,
								reduceIdents: true,
								minifySelectors: true,
							},
						],
					}),
				],
			},
		},
		optimizeDeps: {
			exclude: ['astro:content'],
		},
		ssr: {
			noExternal: ['astro:content'],
		},
	},
	compressHTML: true,
});
