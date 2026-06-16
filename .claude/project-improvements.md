# プロジェクト改善履歴

## 改善プロセス記録

### テンプレート初期セットアップ

**基本構成:**
- Astro 5.x ベースの静的サイトジェネレーター
- TypeScript による型安全な開発
- SCSS (BEM + FLOCSS) によるスタイリング
- GSAP ScrollTrigger によるアニメーション

---

### size()関数導入

**Before: fluid()/fluid-sp()方式**
```scss
.element {
  width: fluid(300);
  @include mq('sp') {
    width: fluid-sp(200);
  }
}
```

**After: size()関数方式**
```scss
.element {
  width: size(300); // PC/SP自動切り替え
}
```

**効果:**
- コード量削減
- Figmaの値をそのまま入力可能
- ブレイクポイントでの自動切り替え

---

### BEM命名規則リファクタリング

**変更内容:**
- Element名のハイフン連結を禁止するルールを策定
- 深い階層はSCSSネストで対応する方針を確立

**Before:**
```scss
.p-fv__cta-btn-arrow-icon { }
```

**After:**
```scss
.p-fv__arrow {
  img { }
}
```

---

### 画像最適化（AVIF配信）

**変更内容:**
- JPG/PNG → AVIF形式に変更（ファイルサイズ大幅削減）
- `getImage()`関数でビルド時にAVIF変換
- `<picture>`要素でPC/SP画像切り替え実装

---

### iOS Safari対応パターン確立

**遅延DOM追加パターン:**
- `<template>`タグで初期レンダリング防止
- スクロールトリガー発火時に初めてDOMに追加
- iOS Safari固有の一瞬表示問題を解決

---

### GSAPレスポンシブ対応

**gsap.matchMedia()導入:**
- SPでのパララックス無効化
- PC/SP別のアニメーション制御

**gsap.fromTo()活用:**
- 初期位置を明示的に指定
- SPでの見切れ防止

---

### z-indexスタッキングコンテキスト解決

**問題:**
- 子要素のz-indexが親のコンテキスト内でしか効かない

**解決策:**
- 親要素のz-indexを動的に変更するパターン確立

---
<!-- 以下に改善履歴を追記 -->
