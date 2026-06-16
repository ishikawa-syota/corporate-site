import { getImage } from 'astro:assets';

import type { ImageMetadata } from 'astro';

/**
 * 画像を処理してURLを生成する関数
 * @param src - 画像メタデータ
 * @returns 画像のURL
 */
export const processImage = async (src: ImageMetadata) => {
  try {
    const originalFormat = src.format as 'png' | 'jpg' | 'jpeg';
    
    const [webpVersion] = await Promise.all([
      getImage({
        src,
        format: 'webp',
        quality: 80,
      }),
      getImage({
        src,
        format: originalFormat,
        quality: 80,
      })
    ]);

    const isDev = import.meta.env.DEV;
    const path = isDev ? webpVersion.src : `../images/${webpVersion.src.split('/').pop() || ''}`;
    
    return path;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

/**
 * 画像マップからCSS変数を生成する関数
 * @param imageMap - 画像マップ
 * @returns CSS変数オブジェクト
 */
export const generateCssVariables = async (imageMap: Record<string, ImageMetadata>) => {
  try {
    const result: Record<string, string> = {};
    
    await Promise.all(
      Object.entries(imageMap).map(async ([key, src]) => {
        const path = await processImage(src);
        const varName = `--imgurl-${key.replace(/_/g, '-')}`;
        result[varName] = `url('${path}')`;
      })
    );

    return result;
  } catch (error) {
    console.error('Error generating CSS variables:', error);
    return {}; // エラー時は空オブジェクトを返す
  }
};

/**
 * 複数の画像を一度に処理してCSSカスタムプロパティを生成する
 * @param imageMap { [key: string]: ImageMetadata } - キーとイメージのマップ
 * @returns CSS変数の文字列
 */
export const processImages = async (imageMap: { [key: string]: ImageMetadata }): Promise<string> => {
  const cssVars: string[] = [];
  
  for (const [key, image] of Object.entries(imageMap)) {
    const url = await processImage(image);
    cssVars.push(`--${key}: url('${url}')`);
  }
  
  return cssVars.join(';\n  ');
};