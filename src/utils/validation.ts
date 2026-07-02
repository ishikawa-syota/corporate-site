/**
 * メールアドレスの検証
 * @param email メールアドレス
 */
export const isValidEmail = (email: string): boolean => {
	const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return pattern.test(email);
};

/**
 * 電話番号の検証（日本の形式）
 * @param phone 電話番号
 */
export const isValidJapanesePhone = (phone: string): boolean => {
	const pattern = /^(0[0-9]{1,4}-[0-9]{1,4}-[0-9]{4})$/;
	return pattern.test(phone);
};

/**
 * 郵便番号の検証（日本の形式）
 * @param postalCode 郵便番号
 */
export const isValidJapanesePostalCode = (postalCode: string): boolean => {
	const pattern = /^\d{3}-\d{4}$/;
	return pattern.test(postalCode);
};
