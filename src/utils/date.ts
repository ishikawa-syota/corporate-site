/**
 * 日付を日本語フォーマットに変換
 * @param date 日付オブジェクトまたは日付文字列
 */
export const formatJapaneseDate = (date: Date | string): string => {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const day = d.getDate();

	return `${year}年${month}月${day}日`;
};

/**
 * 日付をYYYY.MM.DD（JST）に変換
 * @param date 日付オブジェクトまたは日付文字列
 */
export const formatDotDate = (date: Date | string): string =>
	new Intl.DateTimeFormat('ja-JP', {
		timeZone: 'Asia/Tokyo',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
		.format(new Date(date))
		.replaceAll('/', '.');

/**
 * 相対的な時間表示を生成
 * @param date 日付オブジェクトまたは日付文字列
 */
export const getRelativeTime = (date: Date | string): string => {
	const d = new Date(date);
	const now = new Date();
	const diff = now.getTime() - d.getTime();

	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutes < 60) return `${minutes}分前`;
	if (hours < 24) return `${hours}時間前`;
	return `${days}日前`;
};
