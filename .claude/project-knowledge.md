# プロジェクト知見

## デザイントークン

### size()関数 - レスポンシブ単位（推奨）

Figmaのデザインカンプの数値をそのまま入れるだけでPC/SP自動切り替え。

```scss
// 使い方（これだけでOK！）
.element {
	width: size(300); // PC: 300/1536*100vw, SP: 300/390*100vw
	padding: size(40);
	font-size: size(16);
	gap: size(24);
}
```

**計算式:**

- PC（769px以上）: `値 / 1536 * 100vw`
- SP（768px以下）: `値 / 390 * 100vw`

**設定ファイル:**

- `_variable.scss`: `$design-width-pc: 1536`, `$design-width-sp: 390`
- `_mixin.scss`: `size()`関数定義
- `_reset.scss`: CSS変数`--size-unit`定義

### fluid()/fluid-sp()関数 - 従来のレスポンシブ単位

PC用とSP用で別々に指定する方式。

```scss
.element {
	width: fluid(300); // PC用

	@include mq('sp') {
		width: fluid-sp(200); // SP用
	}
}
```

### カラーパレット定義パターン

```scss
// 基本色
$white: #ffffff;
$black: #111111;

// ブランドカラー（プロジェクトごとに変更）
$primary-color: #0058db;
$secondary-color: #aaaaaa;
$accent-color: #ff6b00;

// テキスト
$text-color: #111111;
$text-color-light: #666666;

// 背景
$bg-primary: #ffffff;
$bg-secondary: #f5f5f5;
```

### タイポグラフィー

```scss
// フォントファミリー
$Font: 'Zen Kaku Gothic New', sans-serif; // メイン
$Font-Sub: 'Noto Sans JP', sans-serif; // サブ
$Font-En: 'Oswald', sans-serif; // 英字

// PC用mixin
@include head-01; // 60px
@include head-02; // 46px
@include head-03; // 38px
@include p-large; // 20px（本文大）
@include p-body; // 18px（本文）
@include p-small; // 12px
```

### Adobe Fontsのフォント名規則（重要）

**Adobe Fonts（Typekit）はフォント名を小文字・ハイフン区切りで登録する**

```scss
// NG: 元のフォント名で指定
$Font-Body: 'FOT-Cezanne ProN', sans-serif;

// OK: Typekitが登録するCSS名で指定
$Font-Body: 'fot-cezanne-pron', sans-serif;
```

**確認方法:**

1. ブラウザDevToolsで `document.fonts.forEach(f => console.log(f.family))` を実行
2. HTML要素のクラス名 `wf-[フォント名]-active` を確認
3. ネットワークタブでTypekitリクエストの成否を確認

## 実装パターン

### SCSS記述ルール（重要）

**SCSSは基本的にAstroファイル内の`<style lang="scss">`タグに記述する**

```astro
---
// frontmatter
---

<section class="p-section">
	<!-- HTML -->
</section>

<style lang="scss">
	@use '../styles/foundation/index' as *;

	.p-section {
		// スタイル
	}
</style>
```

**理由:**

- コンポーネントの凝集性が高まる
- スタイルとマークアップが同じファイルにあることで保守性向上
- Astroのスコープ付きスタイルの恩恵を受けられる

**例外（別ファイルにする場合）:**

- 複数コンポーネントで共有するスタイル
- グローバルに適用するユーティリティスタイル
- レイアウト系のスタイル

### コンポーネント作成

- `src/components/`にタイプ別配置
- BEM方法論: `.block__element--modifier`
- foundationスタイルインポート: `@use "../styles/foundation/index" as *;`

### BEM命名規則（冗長禁止ルール）

**原則: Element名にハイフン連結は使用禁止**

```scss
// NG - 長すぎる
.p-fv__cta-btn-arrow-icon {
}
.l-header__nav-list-item-link {
}

// OK - シンプルに
.p-fv__arrow {
}
.p-fv__arrowIcon {
}
.l-header__link {
}
```

**ルール:**

1. **Element名は単語1〜2個まで**: `__btn`, `__title`, `__btnText`
2. **ハイフン連結禁止**: `__cta-btn` → `__ctaBtn` または `__cta`
3. **深い階層はネストで対応**: 子要素はSCSSネストで書く
4. **コンポーネント分割**: 複雑になったら別コンポーネントに切り出す

```scss
// 推奨パターン: ネストで対応
.p-fv {
	&__cta {
		// CTAコンテナ
	}
	&__btn {
		// ボタン本体
	}
	&__arrow {
		// 矢印コンテナ
		img {
			// 矢印アイコン（汎用タグで対応）
		}
	}
}
```

**命名の目安:**

- Block: `p-fv`, `c-card`, `l-header`
- Element: 最大15文字程度（`__description`, `__btnText`）
- Modifier: `--large`, `--active`, `--green`

### セクション作成

- `src/section/`に番号付き命名: `01FV.astro`, `02Trick.astro`

### 画像処理（AVIF優先）

- 最適化対象は`src/images/`に配置
- `getImage()`関数でAVIF形式に変換
- 自動でWebP/AVIF変換

```astro
---
import { getImage } from 'astro:assets';
import imagePc from '../images/example_pc.jpg';
import imageSp from '../images/example_sp.jpg';

// AVIF変換
const optimizedPc = await getImage({ src: imagePc, format: 'avif' });
const optimizedSp = await getImage({ src: imageSp, format: 'avif' });
---

<!-- PC/SP切り替え -->
<picture>
	<source
		srcset={optimizedSp.src}
		media="(max-width: 768px)"
		type="image/avif"
	/>
	<source srcset={optimizedPc.src} type="image/avif" />
	<img src={optimizedPc.src} alt="説明" loading="eager" decoding="async" />
</picture>
```

## アーキテクチャ決定

### SCSSアーキテクチャ (FLOCSS)

- Foundation: 変数、ミックスイン、リセット、デザイントークン
- Layout: ヘッダー、フッター、コンテナ
- Object/Component: 再利用UI
- Object/Project: ページ固有
- Utility: 上書き用

### Foundationファイル構成

```
foundation/
├── _variable.scss      # 変数（デザイン幅、ブレイクポイント）
├── _font.scss          # フォントファミリー
├── _color.scss         # カラーパレット
├── _mixin.scss         # size()関数、メディアクエリ
├── _keyframes.scss     # アニメーション定義
├── _reset.scss         # リセット、CSS変数
└── _index.scss         # エクスポート
```

## 開発ルール

### レスポンシブ対応ルール（重要）

**PCのスタイルに絶対に影響を与えないように実装する**

- SPスタイルは必ず`@include mq('sp')`内に記述
- PC用スタイルを変更せず、SP用スタイルのみを追加・変更する
- 既存のPC用プロパティを上書きしない
- レスポンシブ対応時はPCでの表示確認を必ず行う
- **SPスタイルはPCスタイルの直下に各要素ごとに記述する**（まとめて別の場所に書かない）
- **既存のHTML構造は変更しない**

```scss
// 正しいパターン: 各要素の直下にSPスタイルを記述
.l-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: size(28) size(10);

  @include mq('sp') {
    padding: size(18) size(20);
  }

  &__logo {
    width: size(80);
    height: size(44);

    @include mq('sp') {
      width: size(61);
      height: size(33);
    }
  }
}

// NGパターン: SPスタイルを別の場所にまとめて記述
.l-header { ... }
.l-header__logo { ... }

@include mq('sp') {
  .l-header { ... }       // NG: 別の場所にまとめている
  .l-header__logo { ... } // NG
}
```

### Lint Check必須

コード変更後は必ず `npm run lint:check` を実行してエラーがないことを確認する。

### 画像ファイルについて

**画像はユーザーが毎回ダウンロード済み。Figmaからのダウンロードは不要。**

- 画像ファイルは`src/images/`に配置済みの前提でコーディングする
- 画像のパスが不明な場合は`find`や`ls`で確認する

## 避けるべきパターン

- `public/`への画像配置（最適化されない）
- インラインスタイルの多用
- `size()`関数を使わない単位指定（px直書きNG）
- 変数名・ファイル名に「figma」を含める
- `map.get()`での変数参照（シンプル変数`$green`等を使用）
- `_color.scss`と`_design-tokens.scss`で同名変数を定義（重複エラー）

## GSAPアニメーションパターン

### 基本パターン

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// タイムライン
const tl = gsap.timeline({ delay: 0.5 });
tl.to(element, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
```

### SPでのパララックス無効化（gsap.matchMedia()）

```javascript
const initParallax = () => {
	const mm = gsap.matchMedia();

	mm.add('(min-width: 769px)', () => {
		// PC（769px以上）のみパララックスを適用
		gsap.to(element, {
			y: -80,
			scrollTrigger: {
				trigger: element,
				start: 'top bottom',
				end: 'bottom top',
				scrub: 0.8,
			},
		});
	});
};
```

**注意:**

- `ScrollTrigger.matchMedia()`は非推奨、代わりに`gsap.matchMedia()`を使用

### gsap.fromTo()で初期位置を明示

```javascript
// SPでパララックスが動いて見えない問題の解決策
gsap.fromTo(
	element,
	{ x: 50 }, // 開始位置（右寄り）
	{ x: -100 } // 終了位置（左寄り）
);
```

### prefers-reduced-motion対応

```javascript
const prefersReducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
	element.style.opacity = '1';
} else {
	gsap.to(element, { opacity: 1, duration: 0.5 });
}
```

## HTML変更不可でのSP順序変更パターン

### display: contents + flexbox orderを使用

HTML構造を変更せずにSPでの要素順序を変更する方法。

```scss
// 親要素をflex + column
&__content {
	@include mq('sp') {
		flex-direction: column;
		gap: size(50);
	}
}

// 子要素をcontentの直下に展開
&__right {
	@include mq('sp') {
		display: contents;
	}
}

// orderで順序指定
&__titleWrap {
	@include mq('sp') {
		order: 1;
		width: 100%;
	}
}

&__left {
	@include mq('sp') {
		order: 2;
	}
}

&__features {
	@include mq('sp') {
		order: 3;
	}
}
```

**ポイント:**

- `display: contents`で要素のボックスを消し、子要素を親の直下に展開
- flexbox `order`で任意の順序に並び替え
- PCでは`display: contents`が適用されないため影響なし

## 解析タグ自動注入（analyticsClassInjector）

GTM計測用の `analy-*` クラス/IDを**ビルド時に自動付与**する仕組み。各セクション・リンクに手書きで `class="analy-sec03"` などを振らないための単一情報源。実装は `src/utils/analyticsClassInjector.js`（Viteプラグイン、`closeBundle` フックで `dist/**/*.html` を書き換え）。`astro.config.mjs` で **本番ビルド時（`NODE_ENV=production`）のみ**登録される。

### 付与ルール（このプロジェクトの実装）

**クラス（ラッパー/セクション）:**

- `.l-header` → `analy-header`
- `.l-footer` → `analy-footer`
- `.p-top-firstview` → `analy-fv`
- `.l-cta` → `analy-cta01`, `analy-cta02`, …（2桁ゼロ埋め）
- `form` → `analy-form01`, …
- `section:not(.analy-fv)` → `analy-sec01`, `analy-sec02`, …（DOM順。既に `analy-` を持つ要素はスキップ）

**ID（ボタン/リンク）:**

- `.c-btn-cta` → `#analy-cta-btn01`, …
- `button[type="submit"] / input[type="submit"]` → `#analy-form-btn01`, …
- `a:not(.c-btn-cta)`（`.l-header` / `.l-footer` 内は除外）→ `#analy-link01`, …

### 注意点

- **ビルド時のみ動作。** `npm run dev` ではクラスは付かない → `npm run build` + `npm run preview` で確認する。
- **番号は出現順（positional）。** セクションの追加・並び替えで `analy-secNN` の番号がずれる。GTM仕様と一致するか確認する。
- **対象を変えるとき**は上記セレクタ（`.l-header` / `.l-cta` / `.c-btn-cta` / `section` など）を `analyticsClassInjector.js` 内で直接編集する（設定ブロックは無し）。
- `node-html-parser` で再シリアライズされるため、有効化後は構造（doctype・`<h1>`・`<section>`数・`</html>`）を軽く点検する。

## コード品質ルール（Lint外の判断・ハマりどころ）

stylelint / eslint / prettier が機械的なルールを担保する。ここはツールで拾えない**判断とハマりどころ**（`size()`・BEM冗長禁止・PC-first `mq('sp')` は上記に既出のため割愛）。

### スタイル

- **hoverは必ず `@media (hover: hover)` でガード。** 素の `:hover` は禁止（タッチ端末でhover状態が残る）。
- **タイポグラフィmixinはルールの先頭に。** `ty-*`（`ty-heading` / `ty-body` など）を使うときは、レイアウト/見た目プロパティより**前**に書く。ブロック付き `@include mq('sp')` は宣言の後（後述の宣言順ルール）。
- **コンポーネントをまたぐ指定は `:global()` が必要。** 親のスコープ付きクラスから子コンポーネントの要素へは届かない（Astroのスコープが別）。子をラップするか `:global()` を使う。
- **素の要素セレクタ（`img` / `a`）や `:global()` を足す前に `_reset.scss` を確認。** ベースで既に効いているものを再宣言しない。
- **宣言順は stylelint `order/order` に従う:** カスタムプロパティ → `$変数` → ブロック無し `@include` → 宣言 → ブロック付き `@include` → `@media` → ネストした `&` ルール。メディアクエリ結合（postcss-combine-media-query）がベース宣言を上書きしないよう、必要なら `@media` 内でプロパティを再宣言する。

### テキスト・レスポンシブ

- **1536(PC)と768(SP)の両方で確認してから「完了」。** SPは任意ではない。デスクトップのスクロールバー(~15px)が `vw` 実測を縮めるので、"少し小さい"はスクロールバー除去で再確認する。
- **Figmaのtracking N = `letter-spacing: 0.0Nem`。**
- **正確な改行は `set:html` + `<br>` で明示。** 幅任せの折り返しは貪欲で、1行目が2行目より短い分割は作れない。

### 品質ゲート（「完了」/コミット前）

1. `npm run check`（eslint + stylelint + prettier）**と** `npm run build` が通る。
2. Figma 3種チェック（`.claude/figma-check.md`）— computed CSS・rendered geometry・visual を**両ブレークポイント**で。リファクタや構造変更後は**再実行**する。
3. スクリーンショット / `.playwright-mcp` の生成物を掃除する。
4. **一致したもの/しなかったもの**を px差分＋原因付きで報告する。「見た目OK」だけは禁止。

### ワーキングアグリーメント（再利用・推測しない）

- **既存の実ファイルを再利用する。docs/仕様から作り直さない。** 兄弟プロジェクトに実装がある場合はそのファイルをコピーし、プロジェクト固有部分だけ直す。
- **スコープを勝手に広げない。** 頼まれたことだけをやる。docsの整理を勝手に機能追加・設定変更へ広げない。
- **差異は「行動」でなく「質問」として上げる。** コピーした設定がこのプロジェクトに合わない場合、黙って直さず確認する。
- **質問には質問で答える。** 「どうやるの?」は説明を求めている。ツール実行ではない。
- **docsを最新に保つ。** 現実が変わったら（ファイル追加・参照が陳腐化）これらのdocsを更新する。
