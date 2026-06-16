/**
 * メタデータ検証用Viteプラグイン
 * ビルド時に必要なメタタグやOGP設定が適切に構成されているかチェックします
 */

// サーバーサイドでのみ実行される処理
// Astroのビルド時にのみ読み込まれるため、直接importしても問題ない
import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import { parse } from 'node-html-parser';

/**
 * HTMLファイル内のメタタグを検証するViteプラグイン
 */
export function metaValidator() {
  return {
    name: 'vite-plugin-meta-validator',
    
    // ビルド完了後に実行
    // Viteプラグインのライフサイクルフックであり、クライアントコードに影響しない
    closeBundle: async () => {
      try {
        const distDir = path.resolve(process.cwd(), 'dist');
        
        // distディレクトリが存在しない場合はスキップ
        if (!fs.existsSync(distDir)) {
          console.log(chalk.yellow('\n⚠️ distディレクトリが見つからないため、メタデータ検証をスキップします'));
          return;
        }
        
        const errors = [];
        
        // HTMLファイルを検索して検証
        await validateHtmlFiles(distDir, errors);
        
        // エラーがあればビルドを失敗させる
        if (errors.length > 0) {
          console.error(chalk.red('\n🚨 メタデータ検証エラー:'));
          errors.forEach((error) => {
            console.error(chalk.yellow(`- ${error.file}: ${error.message}`));
          });
          throw new Error('メタデータの検証に失敗しました。上記の問題を修正してください。');
        } else {
          console.log(chalk.green('\n✅ メタデータ検証に成功しました！'));
        }
      } catch (error) {
        if (!error.message.includes('メタデータの検証に失敗しました')) {
          console.error(chalk.red('\n🚨 メタデータ検証中にエラーが発生しました:'), error);
        }
        process.exit(1);
      }
    }
  };
}

/**
 * 指定ディレクトリ内のHTMLファイルを再帰的に検索して検証
 */
async function validateHtmlFiles(dir, errors, relativePath = '') {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // ディレクトリの場合は再帰的に検索
      await validateHtmlFiles(
        filePath, 
        errors, 
        path.join(relativePath, file)
      );
    } else if (file.endsWith('.html')) {
      // HTMLファイルの場合は内容を検証
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const relativeFilePath = path.join(relativePath, file);
      
      validateHtmlContent(fileContent, relativeFilePath, errors);
    }
  }
}

/**
 * HTML内容を検証
 */
function validateHtmlContent(html, filePath, errors) {
  try {
    const root = parse(html);
    
    // メタタイトルのチェック
    const title = root.querySelector('title');
    if (!title || !title.text || title.text.trim() === '') {
      errors.push({
        file: filePath,
        message: 'ページ固有のメタタイトルがありません'
      });
    } else if (title.text.trim() === 'Astro' || title.text.trim() === 'サイト名') {
      errors.push({
        file: filePath,
        message: `メタタイトルがデフォルト値のままです: "${title.text.trim()}"`
      });
    }
    
    // メタキーワードのチェック
    // const keywords = root.querySelector('meta[name="keywords"]');
    // if (!keywords || !keywords.getAttribute('content') || keywords.getAttribute('content').trim() === '') {
    //   errors.push({
    //     file: filePath,
    //     message: 'ページ固有のメタキーワードがありません'
    //   });
    // }
    
    // メタディスクリプションのチェック
    const description = root.querySelector('meta[name="description"]');
    if (!description || !description.getAttribute('content') || description.getAttribute('content').trim() === '') {
      errors.push({
        file: filePath,
        message: 'ページ固有のメタディスクリプションがありません'
      });
    }
    
    // ファビコンのチェック
    const favicon = root.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (!favicon) {
      errors.push({
        file: filePath,
        message: 'ファビコンが設定されていません'
      });
    }
    
    // OGPのチェック
    const ogTitle = root.querySelector('meta[property="og:title"]');
    const ogDescription = root.querySelector('meta[property="og:description"]');
    const ogType = root.querySelector('meta[property="og:type"]');
    const ogImage = root.querySelector('meta[property="og:image"]');
    
    if (!ogTitle || !ogTitle.getAttribute('content')) {
      errors.push({
        file: filePath,
        message: 'OGP: og:titleが設定されていません'
      });
    }
    
    if (!ogDescription || !ogDescription.getAttribute('content')) {
      errors.push({
        file: filePath,
        message: 'OGP: og:descriptionが設定されていません'
      });
    }
    
    if (!ogType || !ogType.getAttribute('content')) {
      errors.push({
        file: filePath,
        message: 'OGP: og:typeが設定されていません'
      });
    }
    
    if (!ogImage || !ogImage.getAttribute('content')) {
      errors.push({
        file: filePath,
        message: 'OGP: og:imageが設定されていません'
      });
    }
    
    // OG:URLとOG:imageの絶対パスチェック
    const ogUrl = root.querySelector('meta[property="og:url"]');
    if (!ogUrl || !ogUrl.getAttribute('content')) {
      errors.push({
        file: filePath,
        message: 'OGP: og:urlが設定されていません'
      });
    } else if (!isAbsoluteUrl(ogUrl.getAttribute('content'))) {
      errors.push({
        file: filePath,
        message: 'OGP: og:urlが絶対パスではありません'
      });
    }
    
    if (ogImage && ogImage.getAttribute('content') && !isAbsoluteUrl(ogImage.getAttribute('content'))) {
      errors.push({
        file: filePath,
        message: 'OGP: og:imageが絶対パスではありません'
      });
    }
    
    // Twitterカードのチェック
    const twitterCard = root.querySelector('meta[name="twitter:card"]');
    if (!twitterCard || twitterCard.getAttribute('content') !== 'summary_large_image') {
      errors.push({
        file: filePath,
        message: 'Twitter Card: <meta name="twitter:card" content="summary_large_image">が設定されていません'
      });
    }
    
  } catch (error) {
    errors.push({
      file: filePath,
      message: `HTML解析中にエラーが発生しました: ${error.message}`
    });
  }
}

/**
 * URLが絶対パスかどうかをチェック
 */
function isAbsoluteUrl(url) {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
} 