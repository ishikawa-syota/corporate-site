/**
 * ユーティリティ関数の統合エクスポート
 * 全てのユーティリティ関数をここからインポートできます
 */

// 文字列関連ユーティリティ
export { truncate, camelToKebab } from './string';

// 日付関連ユーティリティ
export { formatJapaneseDate, getRelativeTime } from './date';

// バリデーション関連ユーティリティ
export { isValidEmail, isValidJapanesePhone, isValidJapanesePostalCode } from './validation';

// 画像関連ユーティリティ
export { estimateWebPSize, generateImageWidths } from './image';

// 型定義
export interface CommonUtilityConfig {
  /** デフォルトの文字列切り詰め長 */
  defaultTruncateLength: number;
  /** デフォルトの画像最大幅 */
  defaultMaxImageWidth: number;
}

// 共通設定
export const DEFAULT_CONFIG: CommonUtilityConfig = {
  defaultTruncateLength: 100,
  defaultMaxImageWidth: 1920,
};

// 名前空間付きエクスポート（オプション）
export * as StringUtils from './string';
export * as DateUtils from './date';
export * as ValidationUtils from './validation';
export * as ImageUtils from './image';