import { createClient } from 'microcms-js-sdk';

import type { MicroCMSQueries } from 'microcms-js-sdk';

const client = createClient({
	serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
	apiKey: import.meta.env.MICROCMS_API_KEY,
});

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
