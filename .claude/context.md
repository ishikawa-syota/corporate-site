# プロジェクトコンテキスト

## プロジェクト概要

- **プロジェクト名**: LP Astro Template
- **種類**: ランディングページテンプレート
- **フレームワーク**: Astro 5.x

## 環境情報

- **本番環境**: （プロジェクトごとに設定）
- **ステージング環境**: （プロジェクトごとに設定）
- **開発サーバー**: http://localhost:4321

## 技術スタック

- Astro 5.13.5+
- TypeScript
- SCSS (BEM + FLOCSS)
- GSAP (ScrollTrigger)
- Splide 4.1.4（スライダー）
- Sharp (画像最適化)
- Google Fonts（Fontsource対応可）
- Adobe Fonts（Typekit）対応可

## 制約条件

- Figmaデザインからの変更禁止
- 全ての単位は`size()`関数を使用
- 変数名・クラス名に「Figma」の使用禁止
- BEM方法論に従ったクラス命名

## カスタマイズ時の注意

このテンプレートを新規プロジェクトに使用する際は、以下を更新すること：

1. `src/data/meta.ts` - サイトメタデータ
2. `astro.config.mjs` - base設定（サブディレクトリ配置の場合）
3. `.claude/context.md` - 本ファイルのプロジェクト情報
4. カラーパレット（`_color.scss`）
5. フォント設定（`_font.scss`）
