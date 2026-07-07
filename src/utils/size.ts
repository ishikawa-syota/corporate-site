/**
 * サイズ関連ユーティリティ
 * SCSS の size() 関数と同じ考え方で、Figma のpx値をSP幅基準の vw calc に変換する。
 * JS からライブラリ（Splide等）へ渡す値に使用する。
 */

/** SPデザインカンプ幅（px） */
export const SP_DESIGN_WIDTH = 768;

/**
 * Figmaのpx値をSP幅基準の `calc(px / 768 * 100vw)` 文字列に変換する。
 * @example spVw(390) // => 'calc(390 / 768 * 100vw)'
 */
export function spVw(px: number): string {
	return `calc(${px} / ${SP_DESIGN_WIDTH} * 100vw)`;
}
