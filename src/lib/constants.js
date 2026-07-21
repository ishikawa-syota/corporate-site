// microCMSの画像アセット配信ドメイン（全サービス共通の固定CDNドメイン）
// SDKからは取得できないためここで一元管理する。
// astro.config.mjs からもimportするため、環境変数等に依存しないプレーンJSにしている。
export const MICROCMS_ASSETS_HOST = 'images.microcms-assets.io';
