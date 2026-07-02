# 頻用コマンドパターン

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 検証ビルド（HTML処理なし）
npm run build:check

# プレビュー
npm run preview

# Lint実行
npm run lint

# Lint自動修正
npm run lint:fix

# Lint厳格チェック（警告0でエラー）
npm run lint:check
```

## Git操作

```bash
# ステータス確認
git status

# 差分確認
git diff

# コミット
git add . && git commit -m "メッセージ"
```

### 共有ツリーでの並行セッション コミット戦略

2つのセッションが同じ作業ディレクトリ＋`.git`を編集し、両方が直接 `main` にコミットする場合（フィーチャーブランチ無し）。

1. **ブランチ/`git checkout` 禁止。** HEADを切り替えると共有作業ツリーが変化し、もう一方のセッションが壊れる。`main` に留まる。
2. **`git add -A` / `-i` / `-p` 禁止。** 自分のファイルだけをパス指定でステージする。
3. **`git stash` 禁止。** 何をコミットするかは `git add` で選ぶ。
4. **pre-commitフックは `npm run check`（eslint + stylelint + prettier）をツリー全体に対して実行する**（※現在このプロジェクトではフックは未設定。フォーマット修正のタイミングで再導入予定）。コミット前に、自分のファイルだけにfixerをかける:
    ```bash
    npx stylelint --fix <自分のファイル>
    npx prettier --write <自分のファイル>
    ```
5. **`src/pages/index.astro` は共有ファイル**（両セッションがセクションを差し込む）。自分の配線だけをコミットするには、自分のセクションのみのクリーンな版を書いてステージ→コミット→作業版を復元、を1つのbashブロックで原子的に行う。

```bash
npx prettier --write <自分の新規ファイル>              # 自分のファイルのみ整形
cp src/pages/index.astro /tmp/index.parallel.astro    # 共有作業版を退避

cat > src/pages/index.astro <<'EOF'
---
# 自分の＋コミット済みセクションのimportのみ（相手のは含めない）
---
<Layout>
  ...自分のセクション＋コミット済みのみ...
</Layout>
EOF
npx prettier --write src/pages/index.astro

git add <自分の新規ファイル> src/pages/index.astro    # 明示パスのみ
if git commit -q -m "..."; then C=1; else C=0; fi
cp /tmp/index.parallel.astro src/pages/index.astro    # 必ず作業ツリーを復元
[ "$C" = 1 ] && git push
```

コミット後は必ず検証: `git show --stat --oneline HEAD`（自分のファイルだけか）/ `git show HEAD:src/pages/index.astro`（自分のセクションだけか）/ `git status --short`（相手の作業が無傷か）。

コミットメッセージ末尾には必ず:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

## ファイル検索

```bash
# コンポーネント検索
ls src/components/

# セクション一覧
ls src/section/

# 画像ファイル検索
find src/images -name "*.jpg" -o -name "*.png"
```

## キャッシュクリア

```bash
# ビルドキャッシュクリア
rm -rf dist .astro

# クリアしてリビルド
rm -rf dist .astro && npm run build:check
```

## Swiper初期化パターン（v8）

```javascript
// @ts-expect-error - Swiper v8 ESM modules
import Swiper, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';

// フェードスライダー
new Swiper('.js-slider', {
	modules: [EffectFade, Autoplay],
	effect: 'fade',
	fadeEffect: { crossFade: true },
	speed: 2000,
	autoplay: { delay: 5000, disableOnInteraction: false },
	loop: true,
});
```

## GSAPアニメーションパターン

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// タイムライン
const tl = gsap.timeline({ delay: 0.5 });
tl.to(element, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });

// prefers-reduced-motion対応
const prefersReducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)'
).matches;
```

## GSAPレスポンシブパターン

```javascript
// SPでのアニメーション無効化
const mm = gsap.matchMedia();

mm.add('(min-width: 769px)', () => {
	// PCのみ適用
	gsap.to(element, {
		y: -80,
		scrollTrigger: { trigger: element, scrub: 0.8 },
	});
});
```

## 画像最適化パターン（AVIF + PC/SP対応）

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

## CSS変数 + 擬似要素で画像表示パターン

```astro
---
import { getImage } from 'astro:assets';
import decorImage from '../images/decoration.png';

// 透過PNGはPNG形式のまま
const optimizedImage = await getImage({ src: decorImage, format: 'png' });
---

<section style={`--decor-image: url(${optimizedImage.src});`}></section>
```

```scss
.section {
	&::before {
		content: '';
		position: absolute;
		background-image: var(--decor-image);
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
}
```

## iOS Safari対応 - 遅延DOM追加パターン

```html
<!-- template内の要素はレンダリングされない -->
<template id="elementTemplate">
	<div class="my-element">...</div>
</template>
```

```javascript
const initElement = () => {
	const targetSection = document.querySelector('.target-section');
	let element = null;

	const createAndShowElement = () => {
		if (element) return;

		const template = document.getElementById('elementTemplate');
		const clone = template.content.cloneNode(true);

		document.body.appendChild(clone);
		element = document.querySelector('.my-element');

		// フェードイン
		requestAnimationFrame(() => {
			element.style.opacity = '1';
		});
	};

	// トリガー時に初めてDOMに追加
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting) createAndShowElement();
		},
		{ rootMargin: '-20% 0px 0px 0px' }
	);
	observer.observe(targetSection);
};
```

## SPハンバーガーメニュー - z-index解決パターン

```scss
.l-header {
	z-index: 1000;

	&.is-drawer-open {
		@include mq('sp') {
			z-index: 2001; // ドロワーより前面に
		}
	}
}

.l-drawer {
	z-index: 2000;
}
```

```javascript
const openDrawer = () => {
	drawer.classList.add('is-open');
	header?.classList.add('is-drawer-open');
};

const closeDrawer = () => {
	drawer.classList.remove('is-open');
	header?.classList.remove('is-drawer-open');
};
```

## SP順序変更 - display: contents パターン

```scss
.parent {
	display: flex;

	@include mq('sp') {
		flex-direction: column;
	}
}

.wrapper {
	@include mq('sp') {
		display: contents;
	}
}

.first-item {
	@include mq('sp') {
		order: 1;
	}
}

.second-item {
	@include mq('sp') {
		order: 2;
	}
}
```

## Splideカルーセルパターン

このプロジェクトのカルーセルは **Splide**（`@splidejs/splide`）を使用（Swiperは不使用）。実例: `01FV.astro` / `05Member.astro` / `06Voice.astro`。

```js
import Splide from '@splidejs/splide';

new Splide(el, {
	// オプション
}).mount();
```

- **カスタム矢印**は `.splide__arrows` とボタンを `.splide` の**中**に置くと Splide が自動でバインドする（`splide.go()` の手書きハンドラ不要）。
- **`[prev][dots][next]` の並び替えはCSSで。** 矢印ラッパーに `display: contents` + flex `order` を使い、JSでDOMを動かさない。
- **中央ピーク**は `focus: 'center'` + padding（または `fixedWidth`）。セクションpaddingとSplide paddingの**二重padding**でカードが縮む点に注意。
- **初期スライド**は `start:` ではなく**データ配列の並び順**で決める。

## GSAPアニメーション（パス追従 / Safari対策）

- **パス追従・ループ**は GSAP MotionPath。定速ループは `ease: 'none'` + `repeat: -1`。**`duration` が速度**（小さいほど速い）。
- **動くSVG要素のグロー**は SVG内 `<filter>` を使う（CSSの `filter`/`drop-shadow` はSafariがtransform中のSVGに描画しない）。
- Safariは `filter` 内の `calc`/`vw`/`var` を拒否する → 固定値かSVG内フィルタを使う。
- 開いた曲線 → 画面内のパス範囲だけをアニメ。全円 → `0→1` をループし `overflow: hidden` でクリップ。
- 必ず `prefers-reduced-motion` でガードする。
