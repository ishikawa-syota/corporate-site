# Astro LPサイト開発テンプレート マニュアル

## 🚀 テンプレートとして使用する場合

### クイックスタート

```bash
# 1. テンプレートを新しいプロジェクトにコピー
cp -r astro-lp-template new-project-name
cd new-project-name

# 2. 依存関係のインストール
npm install

# 3. 開発サーバーの起動
npm run dev
```

#### 個別インストールする場合

astro 個別インストールする

```bash
npm create astro@latest
```

# 基本開発環境系

npm i -D sass typescript

seo

```bash
npm i -D astro-seo
```

eslint

```bash
npm i -D @eslint/js eslint eslint-import-resolver-typescript eslint-plugin-astro eslint-plugin-import-x typescript-eslint
```

prettier

```bash
npm i -D prettier prettier-plugin-astro
```

splide

```bash
npm i @splidejs/splide @splidejs/splide-extension-auto-scroll
```

GSAP

```bash
npm i gsap
```

swiper

```bash
npm i swiper
```

ビルド関連

```bash
npm i -D sharp postcss postcss-combine-media-query cssnano terser cheerio glob node-html-parser chalk npm-run-all astro-relative-links
```

### 📚 ドキュメント

- **[テンプレート利用ガイド](./docs/TEMPLATE_GUIDE.md)** - 基本的な使用方法
- **[カスタマイズガイド](./docs/CUSTOMIZATION.md)** - 詳細なカスタマイズ方法

### ✨ テンプレートの特徴

- **📱 レスポンシブ対応**: モバイルファーストで全デバイス対応
- **🎨 サンプルデータ対応**: `src/data/sampleContent.ts`で簡単にコンテンツ変更
- **🖼️ 画像最適化**: WebP形式での自動変換・最適化
- **⚡ 高速パフォーマンス**: Astroによる静的サイト生成
- **🎭 アニメーション**: GSAPによるスクロールアニメーション
- **📊 計測対応**: 自動クラス付与による計測タグ対応
- **🔍 SEO最適化**: メタデータ自動検証機能付き

### 🎯 対応セクション

- ✅ ファーストビュー（汎用化済み）
- ✅ 悩み・課題セクション（汎用化済み）
- ✅ CTAコンポーネント（汎用化済み）
- 🔄 サービス紹介・強み・実績・料金・FAQ・お問い合わせ（要カスタマイズ）

---

## 1. はじめに

このテンプレートは、Astroを使用したLPサイト開発のための基本構成です。高速なパフォーマンス、SEO対策、モダンな開発環境を提供することを目的としています。テンプレートを自社のプロジェクトに合わせてカスタマイズしてご利用ください。

## 2. 技術仕様

### フレームワーク・ライブラリ

- **Astro**: 静的サイトジェネレーター（v4.15.3以上）
- **TypeScript**: 型安全な開発環境
- **SASS/SCSS**: スタイリング
- **GSAP**: アニメーション
- **Swiper**: スライダーコンポーネント

### ビルドツール

- **Vite**: 高速な開発環境と最適化されたビルド
- **PostCSS**: CSSの最適化（メディアクエリの結合、minify）
- **Sharp**: 画像最適化

## 3. 環境構築

### 必要環境

- Node.js (v16以上)
- npmまたはpnpm

### インストール手順

```bash
# リポジトリのクローン
git clone [リポジトリURL]

# 依存関係のインストール
npm install
# または
pnpm install

# 開発サーバーの起動
npm run dev
# または
pnpm dev
```

### スクリプトコマンド

- `npm run dev`: 開発サーバーの起動
- `npm run build`: 本番用ビルド
- `npm run preview`: ビルド結果のプレビュー

## 4. プロジェクト構造

```
/
├── public/            # 静的アセット (そのままコピーされる)
├── src/
│   ├── components/    # 再利用可能なコンポーネント
│   │   ├── common/    # 共通コンポーネント (Meta、Buttonなど)
│   │   ├── form/      # フォーム関連コンポーネント
│   │   └── images/    # 画像関連コンポーネント
│   ├── data/          # サイトデータ・設定
│   ├── images/        # 最適化される画像ファイル
│   ├── layouts/       # レイアウトコンポーネント
│   ├── pages/         # ページコンポーネント
│   ├── script/        # クライアントサイドスクリプト
│   ├── section/       # サイトセクションコンポーネント
│   ├── styles/        # SCSSスタイル
│   └── utils/         # ユーティリティ関数
├── astro.config.mjs   # Astro設定ファイル
└── package.json       # 依存関係と設定
```

## 5. 処理の特徴と使い方

### 5.1 Astroコンポーネントの基本構造

```astro
---
// フロントマター: インポート、プロップス、JavaScript処理
import Component from '../components/Component.astro';

// Propsインターフェース
interface Props {
	title: string;
}

// Propsの取得
const { title } = Astro.props;

// コンポーネントロジック
const data = await fetchData();
---

<!-- HTML/コンポーネントテンプレート -->
<div class="container">
	<h1>{title}</h1>
	<Component />
</div>

<!-- スタイル (SCSSサポート) -->
<style lang="scss">
	@use '../styles/foundation/index' as *;

	.container {
		padding: 1rem;

		h1 {
			color: $primary-color;
		}
	}
</style>
```

### 5.2 レイアウト使用方法

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="ページタイトル">
	<div>ページコンテンツ</div>
</Layout>
```

### 5.3 画像最適化

`src/styles/images.ts`モジュールを使って画像の最適化が可能です：

```typescript
import { processImage, generateCssVariables } from '../styles/images';
import myImage from '../images/myImage.jpg';

// 単一画像の処理
const imageUrl = await processImage(myImage);

// 複数画像のCSS変数生成
const images = { hero: myImage, logo: logoImage };
const cssVars = await generateCssVariables(images);
```

### 5.4 環境変数の使用

開発環境と本番環境での条件分岐：

```typescript
const isDev = import.meta.env.DEV;

if (isDev) {
	// 開発環境でのみ実行
} else {
	// 本番環境でのみ実行
}
```

### 5.5 メタデータの設定

`src/data/meta.ts`でサイト全体のメタデータを定義し、個別ページで上書き可能：

```typescript
// meta.ts
export const siteMetadata = {
  siteName: 'サイト名',
  description: 'サイト説明',
  siteUrl: 'https://example.com/',
  // 他のSEO関連メタデータ
};

// ページコンポーネントでの使用
import { siteMetadata } from '../data/meta';
import Meta from '../components/common/Meta.astro';

<Meta
  title="カスタムタイトル"
  description="カスタム説明"
/>
```

## 6. コーディング規約

### 6.1 BEM命名規則

```scss
.block {
	&__element {
		&--modifier {
		}
	}
}
```

例：

```html
<div class="card">
	<div class="card__header">
		<h2 class="card__title card__title--large">タイトル</h2>
	</div>
</div>
```

### 6.2 コンポーネント設計

- 単一責任の原則に従う
- 再利用可能なコンポーネントを作成
- Propsによる柔軟な設定

### 6.3 パフォーマンス最適化

- 画像は必ず最適化する（WebP形式推奨）
- JavaScriptは必要な場所でのみ読み込む
- CSSのメディアクエリは結合される

## 7. デプロイ

### ビルドと配信

```bash
# ビルド実行
npm run build

# dist/ ディレクトリが生成される
# このディレクトリをサーバーにアップロードまたはホスティングサービスにデプロイ
```

### 環境変数の設定

本番環境では、`.env`ファイルまたはホスティングサービスの環境変数設定機能を使用して環境変数を設定します。

## 8. トラブルシューティング

### 一般的な問題

1. **画像が表示されない**
    - `public/`ではなく`src/images/`に配置されているか確認
    - 正しい相対パスを使用しているか確認

2. **スタイルが適用されない**
    - SCSSのインポートが正しいか確認
    - スコープされたスタイルの場合、対象要素にクラスが適用されているか確認

3. **ビルドエラー**
    - TypeScriptエラーを修正
    - 依存関係のバージョンを確認

## 9. 参考リソース

- [Astro公式ドキュメント](https://docs.astro.build/)
- [TypeScriptドキュメント](https://www.typescriptlang.org/docs/)
- [SASS/SCSSドキュメント](https://sass-lang.com/documentation/)

## 10. セクション・ボタン自動計測機能

本テンプレートには、解析・コンバージョン計測のための自動クラス名・ID付与機能が実装されています。

### 10.1 機能概要

各セクション要素に計測用クラス名を、ボタンやリンク要素に個別IDを自動的に付与します。これにより、解析ツールでの計測やイベントトラッキングが容易になります。この機能は2つの方法で実装されています：

1. **ビルド時の自動付与** (推奨方式)：
    - ビルド時に静的HTMLにクラス名・IDを埋め込みます
    - JavaScriptが無効な環境でも動作し、SEO対応にも有効です
    - ページ読み込み時のパフォーマンスへの影響がありません

2. **クライアントサイドでの自動付与** (代替方式)：
    - ページ読み込み時にJavaScriptでクラス名・IDを動的に付与します
    - 開発環境でのプレビュー確認に便利です

### 10.2 セクション計測用クラス名

以下のルールでクラス名が自動付与されます：

| 対象セクション   | セクションクラス名 | 付与ロジック                             |
| ---------------- | ------------------ | ---------------------------------------- |
| ヘッダー         | analy-header       | `.l-header`要素に付与                    |
| フッター         | analy-footer       | `.l-footer`要素に付与                    |
| ファーストビュー | analy-fv           | `.p-top-firstview`要素に付与             |
| CTAセクション    | analy-cta01～      | `.l-cta`要素に連番で付与                 |
| フォーム         | analy-form01～     | `form`要素に連番で付与                   |
| その他セクション | analy-sec01～      | `section:not(.analy-fv)`要素に連番で付与 |

### 10.3 ボタン・リンク個別ID

以下のルールでIDが自動付与されます：

| 対象要素           | ID命名規則         | 付与ロジック                                                      |
| ------------------ | ------------------ | ----------------------------------------------------------------- |
| CTAボタン          | analy-cta-btn01～  | `.c-btn-cta`要素に連番で付与                                      |
| フォーム送信ボタン | analy-form-btn01～ | `button[type="submit"], input[type="submit"]`要素に連番で付与     |
| テキストリンク     | analy-link01～     | `a:not(.c-btn-cta)`要素に連番で付与（ヘッダー・フッター内を除く） |

### 10.4 ビルド時自動付与の仕組み

ビルド時の自動付与は、Viteプラグイン「analyticsClassInjector」によって実装されています。このプラグインは以下の処理を行います：

1. ビルド完了後、生成されたHTMLファイルを解析
2. 対象要素にクラス名とIDを付与
3. 変更されたHTMLファイルを保存

```javascript
// astro.config.mjsでの設定（自動的に組み込まれています）
if (process.env.NODE_ENV === 'production') {
	const { analyticsClassInjector } =
		await import('./src/utils/analyticsClassInjector.js');
	plugins.push(analyticsClassInjector());
}
```

### 10.5 使用方法

#### ビルド時自動付与（推奨）

本番ビルド時に自動的に実行されるため、特別な設定は不要です。

```bash
# ビルド実行（クラス名・ID自動付与が含まれます）
npm run build
```

#### クライアントサイド自動付与（オプション）

開発中にクライアントサイドでの自動付与を有効にする場合は、Layout.astroにスクリプトを追加します。

```astro
<!-- Layout.astroのhead内に追加 -->
<script src="../script/analytics-helper.js" type="module"></script>
```

### 10.6 手動指定との併用

必要に応じて特定の要素には手動でクラスやIDを指定することも可能です。手動で設定された値は自動付与によって上書きされません。

```astro
<!-- 手動でクラスを指定する例 -->
<Header id="header" class="analy-header" />

<!-- 手動でIDを指定する例 -->
<CtaButton href="#contact" id="my-special-cta-button" />
```

### 10.7 カスタマイズ

クラス名・ID命名規則やセレクタを変更する場合は、`src/utils/analyticsClassInjector.js`を編集してください。

```javascript
// クラス名変更例
const ctaClassName = `analy-cta${(index + 1).toString().padStart(2, '0')}`;
// ↓変更後
const ctaClassName = `custom-cta${(index + 1).toString().padStart(2, '0')}`;

// 対象セレクタ変更例
const header = root.querySelector('.l-header');
// ↓変更後
const header = root.querySelector('.my-header-class');
```

### 10.8 注意事項

- ビルド時の自動付与を使用する場合、プラグインが適切に処理できるようにHTMLの構造を維持してください
- ビルド時とクライアントサイドの両方で自動付与を有効にした場合、クラス・IDが重複する可能性があります（競合はしません）
- DOM構造が大幅に変更される場合は、`analyticsClassInjector.js`のセレクタも更新する必要があります

## 11. メタデータ・OGP自動検証機能

本テンプレートには、メタデータとOGP設定が適切に構成されているかを自動的に検証する機能が実装されています。

### 11.1 機能概要

ビルド時に各HTMLファイルのメタデータとOGP設定をチェックし、必要なタグが不足している場合にはエラーを表示してビルドを失敗させます。これにより、SEO対策やSNSシェア時の表示に必要な設定漏れを未然に防ぐことができます。

### 11.2 検証項目

以下の項目が各ページで適切に設定されているかを検証します：

1. **メタタイトル**: 各ページに固有のタイトルが設定されているか
2. **メタキーワード**: 各ページに適切なキーワードが設定されているか
3. **メタディスクリプション**: 各ページに適切な説明文が設定されているか
4. **ファビコン**: サイト全体にファビコンが設定されているか
5. **OGP基本設定**: og:title, og:description, og:type, og:imageが設定されているか
6. **OGP URL/画像パス**: og:urlとog:imageが絶対パスで指定されているか
7. **Twitterカード**: twitter:cardが適切に設定されているか

### 11.3 使用方法

ビルド時に自動的に検証が実行されます。問題がある場合はエラーメッセージが表示され、ビルドが失敗します。

```bash
# 通常のビルド（HTML置換処理あり）
npm run build

# メタデータ検証のみ実行（HTML置換処理なし）
npm run build:check
```

### 11.4 エラーメッセージの例

```
🚨 メタデータ検証エラー:
- index.html: ページ固有のメタキーワードがありません
- about/index.html: OGP: og:imageが絶対パスではありません
- contact/index.html: Twitter Card: <meta name="twitter:card" content="summary_large_image">が設定されていません

メタデータの検証に失敗しました。上記の問題を修正してください。
```

### 11.5 カスタマイズ

検証ルールをカスタマイズする場合は、`src/utils/metaValidator.js`を編集してください。特定の検証を無効化したり、新しいルールを追加したりすることができます。

```javascript
// 特定のチェックを無効化する例
// メタキーワードのチェックをコメントアウトして無効化
/*
const keywords = root.querySelector('meta[name="keywords"]');
if (!keywords || !keywords.getAttribute('content') || keywords.getAttribute('content').trim() === '') {
  errors.push({
    file: filePath,
    message: 'ページ固有のメタキーワードがありません'
  });
}
*/
```
