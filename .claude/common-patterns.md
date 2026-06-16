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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  <source srcset={optimizedSp.src} media="(max-width: 768px)" type="image/avif" />
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

<section style={`--decor-image: url(${optimizedImage.src});`}>
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
