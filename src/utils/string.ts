/**
 * 文字列を指定された長さで切り詰める
 * @param text 対象の文字列
 * @param length 最大長
 * @param suffix 末尾に付加する文字列（デフォルトは'...'）
 * @returns 切り詰められた文字列
 */
export const truncate = (text: string, length: number, suffix: string = '...'): string => {
  if (length < 0) {
    throw new Error('Length must be a non-negative number');
  }

  const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
  const segments = Array.from(segmenter.segment(text));

  if (segments.length <= length) {
    return text;
  }

  return segments.slice(0, length).join('') + suffix;
};

/**
 * キャメルケースをケバブケースに変換
 * @param str キャメルケースの文字列
 */
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

//文字列を置換して置き換える
