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
