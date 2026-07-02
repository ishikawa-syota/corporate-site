# セクションコンポーネント

このディレクトリには、LPサイトで使用するセクションコンポーネントを配置します。

## 📁 ディレクトリ構成

```
section/
├── 00Cta.astro          # ✅ CTAセクション（汎用化済み）
├── 01FV.astro           # ✅ ファーストビュー（汎用化済み）
├── 02Worries.astro      # ✅ 悩み・課題セクション（汎用化済み）
├── README.md            # このファイル
└── samples/             # 🔄 サンプルセクション（要カスタマイズ）
    ├── 03About.astro          # サービス紹介
    ├── 04Strong.astro         # 強み・特徴
    ├── 05-01Loss.astro        # 損失回避
    ├── 05-02Performance.astro # 実績・導入効果
    ├── 06Point.astro          # 特徴・ポイント
    ├── 07Case.astro           # ケーススタディ
    ├── 08Sports.astro         # 業界特化セクション
    ├── 09Cost.astro           # 料金・プラン
    ├── 10Tax.astro            # 税制・優遇措置
    ├── 11Flow.astro           # 利用の流れ
    ├── 12Faq.astro            # よくある質問
    ├── 13Contact.astro        # お問い合わせ
    └── README.md              # サンプル使用ガイド
```

## ✅ 汎用化済みセクション

すぐに使えるテンプレート対応済みセクションです。

### 00Cta.astro - CTAセクション

- **用途**: Call to Action（行動促進）
- **特徴**: `CtaContent`コンポーネントを使用、プロップスで完全カスタマイズ可能
- **設定**: `src/data/sampleContent.ts`で一括管理

### 01FV.astro - ファーストビュー

- **用途**: ページの第一印象を決めるメインビジュアル
- **特徴**: タイトル・サブタイトル・特徴リスト・CTAボタンを含む
- **設定**: プロップスまたはサンプルデータで設定可能

### 02Worries.astro - 悩み・課題セクション

- **用途**: ターゲット顧客の課題・悩みを訴求
- **特徴**: タイトル・サブタイトル・課題リスト・イメージ画像
- **設定**: プロップスまたはサンプルデータで設定可能

## 🔄 サンプルセクション

`samples/`ディレクトリに参考用のセクションがあります。  
**これらは具体的な商材のコンテンツを含むため、必ずカスタマイズが必要です。**

詳細は [`samples/README.md`](./samples/README.md) をご確認ください。

## 🚀 新しいセクションの作成

### 1. 基本構造

```astro
---
import { sampleContent } from '../data/sampleContent';

interface Props {
	id?: string;
	class?: string;
	// カスタムプロップス
}

const { id, class: className } = Astro.props;
---

<section class="p-your-section" id={id}>
	<div class="l-inner">
		<!-- セクションコンテンツ -->
	</div>
</section>

<style lang="scss">
	@use '../styles/foundation/index' as *;

	.p-your-section {
		// スタイル定義
	}
</style>
```

### 2. 命名規則

- **ファイル名**: `数字2桁+説明.astro` (例: `03About.astro`)
- **CSSクラス**: `.p-セクション名` (例: `.p-about`)
- **ID**: `セクション名` (例: `id="about"`)

## 📋 使用方法

### 1. index.astroでの使用

```astro
---
import YourSection from '../section/YourSection.astro';
---

<Layout>
	<YourSection id="your-section" />
</Layout>
```

### 2. プロップスでのカスタマイズ

```astro
<YourSection
	id="custom-section"
	title="カスタムタイトル"
	description="カスタム説明文"
	items={customItems}
/>
```

## 💡 ベストプラクティス

1. **データ分離**: 繰り返しデータは`src/data/`で管理
2. **コンポーネント再利用**: 共通部分は別コンポーネントに分離
3. **レスポンシブ対応**: `@include mq(sp)`でモバイル対応
4. **アニメーション**: `js-animation`クラスでスクロールアニメーション対応
5. **SEO対応**: 適切な見出しタグとalt属性の設定

---

効率的なLP開発にお役立てください！ 🎯
