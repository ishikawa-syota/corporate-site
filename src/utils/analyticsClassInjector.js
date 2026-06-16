/**
 * クラス・ID自動付与用Viteプラグイン
 * ビルド時にHTMLファイルにセクション計測用クラス名とボタン・リンクIDを自動的に付与します
 */

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import { parse } from 'node-html-parser';

/**
 * HTMLファイルにクラスとIDを付与するViteプラグイン
 */
export function analyticsClassInjector() {
  return {
    name: 'vite-plugin-analytics-class-injector',
    
    // ビルド完了後に実行
    closeBundle: async () => {
      try {
        const distDir = path.resolve(process.cwd(), 'dist');
        
        // distディレクトリが存在しない場合はスキップ
        if (!fs.existsSync(distDir)) {
          console.log(chalk.yellow('\n⚠️ distディレクトリが見つからないため、クラス・ID付与をスキップします'));
          return;
        }
        
        console.log(chalk.blue('\n🔍 解析用クラス・ID自動付与を開始...'));
        
        // HTMLファイルを検索して処理
        await processHtmlFiles(distDir);
        
        console.log(chalk.green('\n✅ 解析用クラス・ID付与が完了しました！'));
      } catch (error) {
        console.error(chalk.red('\n🚨 クラス・ID付与中にエラーが発生しました:'), error);
      }
    }
  };
}

/**
 * 指定ディレクトリ内のHTMLファイルを再帰的に検索して処理
 */
async function processHtmlFiles(dir, relativePath = '') {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // ディレクトリの場合は再帰的に検索
      await processHtmlFiles(
        filePath, 
        path.join(relativePath, file)
      );
    } else if (file.endsWith('.html')) {
      // HTMLファイルの場合は内容を処理
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const relativeFilePath = path.join(relativePath, file);
      
      try {
        const updatedContent = processHtmlContent(fileContent);
        if (updatedContent !== fileContent) {
          fs.writeFileSync(filePath, updatedContent, 'utf-8');
          console.log(chalk.blue(`  ✓ 更新: ${relativeFilePath}`));
          
          // 変更されたクラスを表示（デバッグ用）
          const modifiedClasses = getModifiedClasses(fileContent, updatedContent);
          console.log(chalk.yellow(`    追加されたクラス: ${modifiedClasses.join(', ')}`));
        } else {
          console.log(chalk.yellow(`  ⚠ 変更なし: ${relativeFilePath}`));
        }
      } catch (error) {
        console.error(chalk.red(`  ⚠ 処理エラー: ${relativeFilePath} - ${error.message}`));
      }
    }
  }
}

/**
 * 変更されたクラスを取得（デバッグ用）
 * HTML解析ライブラリを使用してより安全に処理
 */
function getModifiedClasses(oldContent, newContent) {
  try {
    const oldRoot = parse(oldContent);
    const newRoot = parse(newContent);

    // 旧HTMLからanaly-クラスを収集
    const oldAnalyClasses = new Set();
    const oldElements = oldRoot.querySelectorAll('[class*="analy-"]');
    oldElements.forEach(element => {
      const classes = element.classNames.split(' ').filter(cls => cls.startsWith('analy-'));
      classes.forEach(cls => oldAnalyClasses.add(cls));
    });

    // 新HTMLからanaly-クラスを収集
    const newAnalyClasses = new Set();
    const newElements = newRoot.querySelectorAll('[class*="analy-"]');
    newElements.forEach(element => {
      const classes = element.classNames.split(' ').filter(cls => cls.startsWith('analy-'));
      classes.forEach(cls => newAnalyClasses.add(cls));
    });

    // 追加されたクラスを抽出
    const addedAnalyClasses = [];
    newAnalyClasses.forEach(cls => {
      if (!oldAnalyClasses.has(cls)) {
        addedAnalyClasses.push(cls);
      }
    });

    return addedAnalyClasses;
  } catch (error) {
    console.error(chalk.yellow(`  ⚠ クラス変更検出エラー: ${error.message}`));
    return [];
  }
}

/**
 * HTML内容を処理
 */
function processHtmlContent(html) {
  try {
    const root = parse(html);
    let modified = false;
    const changes = [];
    
    // ヘッダーにクラスを付与
    const header = root.querySelector('.l-header');
    if (header && !header.classList.contains('analy-header')) {
      header.classList.add('analy-header');
      changes.push('analy-header を .l-header に追加');
      modified = true;
    }
    
    // フッターにクラスを付与
    const footer = root.querySelector('.l-footer');
    if (footer && !footer.classList.contains('analy-footer')) {
      footer.classList.add('analy-footer');
      changes.push('analy-footer を .l-footer に追加');
      modified = true;
    }
    
    // ファーストビューにクラスを付与
    const fv = root.querySelector('.p-top-firstview');
    if (fv && !fv.classList.contains('analy-fv')) {
      fv.classList.add('analy-fv');
      changes.push('analy-fv を .p-top-firstview に追加');
      modified = true;
    }
    
    // CTAセクションにクラスを付与
    const ctaSections = root.querySelectorAll('.l-cta');
    ctaSections.forEach((section, index) => {
      const ctaClassName = `analy-cta${(index + 1).toString().padStart(2, '0')}`;
      if (!hasAnalyClass(section, 'analy-cta')) {
        section.classList.add(ctaClassName);
        changes.push(`${ctaClassName} を .l-cta に追加`);
        modified = true;
      }
    });
    
    // フォームにクラスを付与
    const formSections = root.querySelectorAll('form');
    formSections.forEach((section, index) => {
      const formClassName = `analy-form${(index + 1).toString().padStart(2, '0')}`;
      if (!hasAnalyClass(section, 'analy-form')) {
        section.classList.add(formClassName);
        changes.push(`${formClassName} を form に追加`);
        modified = true;
      }
    });
    
    // その他セクションにクラスを付与
    const sections = root.querySelectorAll('section:not(.analy-fv)');
    let secCount = 1;
    
    sections.forEach((section) => {
      if (!hasAnalyClass(section, 'analy-')) {
        const secClassName = `analy-sec${secCount.toString().padStart(2, '0')}`;
        section.classList.add(secClassName);
        changes.push(`${secClassName} を section に追加`);
        secCount++;
        modified = true;
      }
    });
    
    // CTAボタンにIDを付与
    const ctaButtons = root.querySelectorAll('.c-btn-cta');
    ctaButtons.forEach((button, index) => {
      if (!button.id) {
        button.id = `analy-cta-btn${(index + 1).toString().padStart(2, '0')}`;
        changes.push(`ID: analy-cta-btn${(index + 1).toString().padStart(2, '0')} を .c-btn-cta に追加`);
        modified = true;
      }
    });
    
    // フォーム送信ボタンにIDを付与
    const submitButtons = root.querySelectorAll('button[type="submit"], input[type="submit"]');
    submitButtons.forEach((button, index) => {
      if (!button.id) {
        button.id = `analy-form-btn${(index + 1).toString().padStart(2, '0')}`;
        changes.push(`ID: analy-form-btn${(index + 1).toString().padStart(2, '0')} をsubmitボタンに追加`);
        modified = true;
      }
    });
    
    // テキストリンクにIDを付与
    const textLinks = root.querySelectorAll('a:not(.c-btn-cta)');
    textLinks.forEach((link, index) => {
      if (!link.id && !link.closest('.l-header') && !link.closest('.l-footer')) {
        link.id = `analy-link${(index + 1).toString().padStart(2, '0')}`;
        changes.push(`ID: analy-link${(index + 1).toString().padStart(2, '0')} をリンクに追加`);
        modified = true;
      }
    });
    
    if (modified) {
      console.log(chalk.cyan('  変更内容:'));
      changes.forEach(change => {
        console.log(chalk.cyan(`    - ${change}`));
      });
    }
    
    // 直接HTMLを操作する代替手段（node-html-parserが正しく動作しない場合）
    if (modified && !root.toString().includes('analy-')) {
      console.log(chalk.red('  ⚠ node-html-parserの出力にanaly-クラスが含まれていません。直接HTMLを操作します。'));
      
      // 直接テキスト置換による代替処理
      let modifiedHtml = html;
      
      // ヘッダーにクラスを付与
      modifiedHtml = modifiedHtml.replace(
        /class="l-header([^"]*)"/g, 
        'class="l-header$1 analy-header"'
      );
      
      // フッターにクラスを付与
      modifiedHtml = modifiedHtml.replace(
        /class="l-footer([^"]*)"/g, 
        'class="l-footer$1 analy-footer"'
      );
      
      // ファーストビューにクラスを付与
      modifiedHtml = modifiedHtml.replace(
        /class="p-top-firstview([^"]*)"/g, 
        'class="p-top-firstview$1 analy-fv"'
      );
      
      // CTAセクションにクラスを付与
      let ctaCount = 1;
      modifiedHtml = modifiedHtml.replace(
        /class="l-cta([^"]*)"/g, 
        (match, p1) => {
          const ctaClassName = `analy-cta${ctaCount.toString().padStart(2, '0')}`;
          ctaCount++;
          return `class="l-cta${p1} ${ctaClassName}"`;
        }
      );
      
      return modifiedHtml;
    }
    
    return modified ? root.toString() : html;
  } catch (error) {
    console.error(chalk.yellow(`  ⚠ HTML解析エラー: ${error.message}`));
    return html;
  }
}

/**
 * 要素が特定のプレフィックスを持つクラスを持っているか確認
 */
function hasAnalyClass(element, prefix) {
  return Array.from(element.classNames.split(' ')).some(className => className.startsWith(prefix));
} 