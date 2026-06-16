// Twitter Cardの型定義
type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

interface SiteMetadata {
	title: string;
	description: string;
	keywords: string;
	ogImage: string;
	type: string;
	siteUrl: string;
	siteName: string;
	locale: string;
	twitterCard: TwitterCardType;
	favicon: string;
}

export const siteMetadata: SiteMetadata = {
	title: 'title',
	description: 'description',
	keywords: 'keywords',
	ogImage: '', // TODO: 画像を追加（ogImage.src）
	type: 'website',
	siteUrl: 'https://example.com/',
	siteName: 'siteName',
	locale: 'ja_JP',
	twitterCard: 'summary_large_image',
	favicon: '', // TODO: 画像を追加（favicon.src）
};
