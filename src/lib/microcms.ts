import { createClient } from 'microcms-js-sdk';

import type { MicroCMSImage, MicroCMSQueries } from 'microcms-js-sdk';

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
	throw new Error(
		'環境変数 MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が設定されていません。.env（Vercelでは環境変数設定）を確認してください。'
	);
}

const client = createClient({ serviceDomain, apiKey });

// microCMS画像API（imgix）: WebP変換＋アップスケール禁止で幅指定
// リッチテキスト本文内の画像用。フィールド画像はOptImage＋cmsImageSizeを使う
export const getMicroCMSImage = (url: string, width = 1280, fm = 'webp') =>
	`${url}?fm=${fm}&fit=max&w=${width}`;

// OptImageに渡す出力寸法（最大幅を上限にアスペクト比を保って縮小）
// 寸法不明の場合は空を返し、OptImage側のinferSizeに任せる
export const cmsImageSize = (img: MicroCMSImage, maxWidth: number) => {
	if (!img.width || !img.height) return {};
	const width = Math.min(maxWidth, img.width);
	return { width, height: Math.round((img.height * width) / img.width) };
};

// 高さ基準版（高さ揃えのレイアウト用）
export const cmsImageSizeByHeight = (img: MicroCMSImage, maxHeight: number) => {
	if (!img.width || !img.height) return {};
	const height = Math.min(maxHeight, img.height);
	return { width: Math.round((img.width * height) / img.height), height };
};

// microCMSのリストAPIはデフォルト10件のため、既定で全件相当を取得する
const listDefaults: MicroCMSQueries = { limit: 100 };

// 数字で見るデータ（オブジェクト形式）
export const getData = (queries?: MicroCMSQueries) =>
	client.getObject({ endpoint: 'data', queries });

// ニュース（催事レポート等）
export const getNews = (queries?: MicroCMSQueries) =>
	client.getList({
		endpoint: 'news',
		queries: { ...listDefaults, ...queries },
	});

// ニュースカテゴリ
export const getNewsCategories = (queries?: MicroCMSQueries) =>
	client.getList({
		endpoint: 'news_categories',
		queries: { ...listDefaults, ...queries },
	});

// 全件取得（100件超はSDKがオフセットで自動ページング）
// 複数ルートのgetStaticPathsから同一条件で呼ばれるため、ビルド中はメモ化して重複フェッチを防ぐ
const allContentsCache = new Map<string, Promise<unknown>>();

const memoize = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
	if (!allContentsCache.has(key)) {
		allContentsCache.set(key, fetcher());
	}
	return allContentsCache.get(key) as Promise<T>;
};

export const getAllNews = (queries?: MicroCMSQueries) =>
	memoize(`news:${JSON.stringify(queries ?? null)}`, () =>
		client.getAllContents({ endpoint: 'news', queries })
	);

export const getAllMembers = (queries?: MicroCMSQueries) =>
	memoize(`members:${JSON.stringify(queries ?? null)}`, () =>
		client.getAllContents({ endpoint: 'members', queries })
	);

export const getAllVoices = (queries?: MicroCMSQueries) =>
	memoize(`voices:${JSON.stringify(queries ?? null)}`, () =>
		client.getAllContents({ endpoint: 'voices', queries })
	);

export const getAllNewsCategories = (queries?: MicroCMSQueries) =>
	memoize(`news_categories:${JSON.stringify(queries ?? null)}`, () =>
		client.getAllContents({ endpoint: 'news_categories', queries })
	);

// メンバー
export const getMembers = (queries?: MicroCMSQueries) =>
	client.getList({
		endpoint: 'members',
		queries: { ...listDefaults, ...queries },
	});

// お客様の声
export const getVoices = (queries?: MicroCMSQueries) =>
	client.getList({
		endpoint: 'voices',
		queries: { ...listDefaults, ...queries },
	});
