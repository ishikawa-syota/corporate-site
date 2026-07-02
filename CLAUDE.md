# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

### 基本コマンド

- `npm run dev` - 開発サーバー起動（デフォルトポート 4321）
- `npm run build` - 本番用ビルド（HTML処理・解析タグ自動付与含む）
- `npm run build:check` - 検証用ビルド（HTML処理なし）
- `npm run preview` - ビルド結果をローカルでプレビュー
- `npm run lint` - ESLint実行
- `npm run lint:fix` - ESLint実行＋自動修正
- `npm run lint:check` - ESLint実行（警告0でエラー）

## 開発ルール

### Lint Check必須

**コード変更後は必ず `npm run lint:check` を実行してエラーがないことを確認する**

- コンポーネント作成・編集後
- スタイル変更後
- TypeScript/JavaScript変更後
- エラーがある場合は `npm run lint:fix` で自動修正を試みる

## プロジェクトアーキテクチャ

Astroベースのランディングページテンプレートで、以下の主要な設計決定があります：

### フレームワークスタック

- **Astro 5.x**: アイランドアーキテクチャを採用した静的サイトジェネレーター
- **TypeScript**: 全体を通じた型安全な開発
- **SCSS**: BEM方法論によるモジュラースタイリング
- **GSAP**: ScrollTriggerを使ったアニメーション
- **Sharp**: WebP/AVIF形式への自動画像最適化

### ディレクトリ構造

- `src/components/`: タイプ別に整理された再利用可能なUIコンポーネント（button/, card/, common/, form/）
- `src/layouts/`: ページレイアウトテンプレート
- `src/section/`: 大きなページセクション（01FV.astro, 02Trick.astro など）
- `src/data/`: 設定とコンテンツデータ（meta.ts, sampleContent.ts）
- `src/styles/`: FLOCSS方法論で整理されたSCSS
- `src/scripts/`: クライアントサイド機能のTypeScriptモジュール
- `src/utils/`: ユーティリティ関数とビルド時プロセッサー
- `.claude/`: 知見管理システム（後述）

### 特別なビルド機能

#### 自動解析統合

- `analyticsClassInjector.js`によるトラッキングクラスとIDのビルド時注入
- 自動クラス割り当て: `.analy-header`, `.analy-cta01`, `.analy-sec01` など
- ボタンとリンクの自動ID割り当て: `#analy-cta-btn01`, `#analy-link01` など

#### メタデータ検証

- `metaValidator.js`によるSEOメタデータのビルド時検証
- OGP、Twitterカード、メタディスクリプションの適切性をチェック
- 重要なSEO要素が不足している場合はビルドが失敗

#### 画像処理

- WebP/AVIF形式への自動変換
- 形式ごとの複数品質設定
- `src/styles/images.ts`による最適化画像のCSS変数生成

### SCSSアーキテクチャ（FLOCSSベース）

- Foundation: 変数、ミックスイン、リセットスタイル
- Layout: ヘッダー、フッター、メインコンテナスタイル
- Object/Component: 再利用可能なUIコンポーネント
- Object/Project: ページ固有のスタイル
- Utility: 上書き用ユーティリティ

### データ管理

- `src/data/meta.ts`にサイトメタデータを集約
- 簡単なカスタマイズのための`src/data/sampleContent.ts`のサンプルコンテンツ構造
- Metaコンポーネントが検証付きでSEOタグを自動処理

### アニメーションシステム

- `ScrollTrigger`を使ったGSAPベースのスクロールアニメーション
- アニメーションクラス: `.js-animation` による opacity/visibility の自動処理
- アクセシビリティのための `prefers-reduced-motion` 対応

### 本番環境最適化

- console.log除去付きTerser圧縮
- PostCSSメディアクエリ結合
- CSS nano最適化
- アセットチャンクとハッシュ化
- HTML圧縮

## フロントエンド開発ルール

### 1. 変数の使用

- **色やタイポグラフィー等、変数をできるだけ利用すること**
- 色: `$primary-color`, `$text-color` など（`_color.scss`で定義）
- フォント: `$Font`, `$Font-Sub`, `$Font-En`（`_font.scss`で定義）
- サイズ: **例外なく全ての単位は`size()`関数を使用**

### 2. size()関数（推奨）

Figmaのデザインカンプの数値をそのまま入れるだけでPC/SP自動切り替え。

```scss
.element {
	width: size(300); // PC: 300/1536*100vw, SP: 300/390*100vw
	padding: size(40);
	font-size: size(16);
	gap: size(24);
}
```

### 3. コンポーネント化

- **可能であればコンポーネント化すること**
- 再利用可能な要素は`src/components/`に配置
- コンポーネント名は機能を表す名前（例: `CtaButton.astro`）

### 4. 命名規則

- **「Figma」という名前を変数やクラス名、ファイル名等には絶対に使用しない**
- 変数名: `$primary-color`, `$text-color` など（ツール名ではなく色や機能を表す名前）
- クラス名: BEM方法論に従う（`.c-button__text--large`）
- ファイル名: 機能を表す名前（`InfoPanel.astro`, `CtaButton.astro`）

### 5. デザイン忠実性

- **Figmaからデザインは絶対に変更しないこと**
- サイズ、色、フォント、間隔などは全てFigmaの値を正確に反映
- 独自の判断でデザインを「改善」しない

### 6. BEM命名規則（冗長禁止）

- **Element名にハイフン連結は使用禁止**
- `__cta-btn-arrow` → `__arrow` または `__arrowIcon`
- 深い階層はSCSSネストで対応

### 7. レスポンシブ対応ルール

- **PCのスタイルに絶対に影響を与えない**
- SPスタイルは必ず`@include mq('sp')`内に記述
- **SPスタイルはPCスタイルの直下に各要素ごとに記述する**

```scss
// 正しいパターン
.l-header {
	padding: size(28) size(10);

	@include mq('sp') {
		padding: size(18) size(20);
	}
}

// NGパターン: SPスタイルを別の場所にまとめて記述
```

## コンポーネントの操作

### 新しいセクションの作成

番号付き命名規則に従って`03NewSection.astro`を作成し、`src/section/`に配置

### スタイリング規約

- BEM方法論を使用: `.block__element--modifier`
- foundationスタイルをインポート: `@use "../styles/foundation/index" as *;`
- コンポーネント固有のスタイルはコンポーネントファイル内に配置

### 画像の使用

- 最適化される画像は`src/images/`に配置（`public/`ではなく）
- 処理には`src/utils/image.ts`の画像ユーティリティを使用
- 画像は自動的にモダンフォーマットに変換
- **AVIF形式を優先使用**: `getImage({ src: image, format: 'avif' })`

## 知見管理システム

このプロジェクトでは`.claude/`ディレクトリで知見を体系的に管理しています：

### `.claude/context.md`

- プロジェクトの背景、目的、制約条件
- 技術スタック選定理由
- ビジネス要件や技術的制約

### `.claude/project-knowledge.md`

- 実装パターンや設計決定の知見
- アーキテクチャの選択理由
- 避けるべきパターンやアンチパターン

### `.claude/project-improvements.md`

- 過去の試行錯誤の記録
- 失敗した実装とその原因
- 改善プロセスと結果

### `.claude/common-patterns.md`

- 頻繁に使用するコマンドパターン
- 定型的な実装テンプレート

### `.claude/debug-log.md`

- 重要なデバッグ記録
- トラブルシューティング手順

**重要**: 新しい実装や重要な決定を行った際は、該当するファイルを更新してください。

## 環境固有の動作

- 開発環境: ホットリロード、解析タグ注入なし、メタ検証なし
- 本番環境: 完全最適化、解析タグ注入、メタ検証強制実行

## iOS Safari 固有問題への対策

### 遅延DOM追加パターン（重要）

**問題:** iOS Safari では `display: none` や `opacity: 0` でも一瞬要素が描画されてしまう

**解決策:** 表示が必要になるまで要素を DOM に追加しない

```html
<template id="elementTemplate">
	<div class="my-element">...</div>
</template>
```

```javascript
const observer = new IntersectionObserver((entries) => {
	if (entries[0].isIntersecting) {
		document.body.appendChild(clone); // ここで初めて追加
	}
});
observer.observe(targetSection);
```

## Adobe Fonts（Typekit）のフォント名規則

Adobe Fonts（Typekit）はCSSフォント名を**小文字・ハイフン区切り**で登録する。

```scss
// NG
$Font-Body: 'FOT-Cezanne ProN', sans-serif;

// OK
$Font-Body: 'fot-cezanne-pron', sans-serif;
```

確認方法: `document.fonts.forEach(f => console.log(f.family))`
