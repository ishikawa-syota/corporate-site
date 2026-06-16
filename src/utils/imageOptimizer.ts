import fs from 'fs/promises';
import path from 'path';

import sharp from 'sharp';

interface OptimizeImageOptions {
  quality?: number;
  width?: number;
  height?: number;
}

/**
 * 画像を最適化してWebP形式に変換
 * @param inputPath 入力画像のパス
 * @param outputPath 出力先のパス
 * @param options 最適化オプション
 */
export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: OptimizeImageOptions = {}
): Promise<void> {
  const { quality = 80, width, height } = options;
  
  try {
    const image = sharp(inputPath);
    
    if (width || height) {
      image.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }
    
    // WebP形式で保存
    await image
      .webp({ quality })
      .toFile(outputPath.replace(/\.[^/.]+$/, '.webp'));
      
    // 元のフォーマットでも保存（フォールバック用）
    await image
      .toFile(outputPath);
      
    console.log(`Optimized: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
    throw error;
  }
}

/**
 * 複数の画像を一括で最適化
 * @param inputDir 入力ディレクトリ
 * @param outputDir 出力ディレクトリ
 * @param options 最適化オプション
 */
export async function optimizeImages(
  inputDir: string,
  outputDir: string,
  options: OptimizeImageOptions = {}
): Promise<void> {
  try {
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    await Promise.all(
      imageFiles.map(file => {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);
        return optimizeImage(inputPath, outputPath, options);
      })
    );
    
    console.log('All images optimized successfully');
  } catch (error) {
    console.error('Error optimizing images:', error);
    throw error;
  }
}