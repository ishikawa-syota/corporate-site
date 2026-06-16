# デバッグログ

## 重要なデバッグ記録

### getImage()に文字列パスを渡すとエラー

**エラーメッセージ:**
```
Image's and getImage's src parameter must be an imported image or an URL,
it cannot be a string filepath. Received /@fs/Users/.../img_example.png?origWidth=682&...
```

**原因:**
`getImage()`に`.src`プロパティ（文字列）を渡していた。

```javascript
// NG: .srcを渡すとエラー
const optimized = await getImage({ src: image.src, format: 'avif' });

// OK: インポートしたオブジェクトをそのまま渡す
const optimized = await getImage({ src: image, format: 'png' });
```

**解決策:**
インポートしたオブジェクトを直接`src`に渡す。

**教訓:**
- Astroの画像インポートは`ImageMetadata`オブジェクトを返す
- `getImage()`や`<Image>`コンポーネントにはこのオブジェクトを直接渡す
- `.src`プロパティは最終的なURL文字列を取得する時のみ使用

---

### ビルドキャッシュでOGPが反映されない

**エラーメッセージ:**
```
🚨 メタデータ検証エラー:
- index.html: OGP: og:imageが設定されていません
```

**状況:**
- `src/data/meta.ts`には正しい`ogImage`が設定されている
- ビルド後のHTMLを確認すると`<meta property="og:image" content>`が空

**原因:**
`.astro/`と`dist/`に古いキャッシュが残っていた。

**解決策:**
```bash
rm -rf dist .astro && npm run build:check
```

**教訓:**
- ビルドエラー発生時はまずキャッシュクリアを試す
- 特にmeta情報やデータファイルを変更した後は注意

---

### iOS Safari 追従CTA初期表示問題

**問題:**
iOS Safari でページロード時に追従CTAが一瞬表示されてしまう。

**試行錯誤:**
1. インラインスタイル `opacity: 0; visibility: hidden;` → ❌
2. `transform: translateY(100%)` で画面外に移動 → ❌
3. `display: none !important` をインラインで設定 → ❌
4. `<template>` タグで初期レンダリング防止 → ❌（クローン後即座にDOM追加でNG）

**根本原因:**
iOS Safari では、要素が DOM に存在する限り、CSS の `display: none` や `opacity: 0` でも一瞬描画されてしまう。

**解決策:**
スクロールトリガーが発火するまで要素を DOM に追加しない。

```javascript
// ❌ NG: ページロード時にDOMに追加
document.body.appendChild(clone);
clone.style.display = 'none'; // iOS Safari では一瞬見える

// ✅ OK: スクロール時に初めてDOMに追加
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.body.appendChild(clone); // ここで初めて追加
  }
});
observer.observe(targetSection);
```

**教訓:**
- iOS Safari の実機または本番環境でテストすることが重要
- 「要素を隠す」のではなく「要素を存在させない」が最も確実

---

### Adobe Fontsフォント名不一致問題

**問題:**
`font-family: FOT-Cezanne ProN`を指定しているのに、フォールバックで別フォントが適用される。

**原因:**
Adobe Fonts（Typekit）はフォント名を**小文字・ハイフン区切り**で登録する。

```javascript
// 実際に登録されているフォント名を確認
document.fonts.forEach(f => console.log(f.family, f.status));
// 出力: "fot-cezanne-pron" "loaded"
```

**解決策:**
```scss
// Before
$Font-Body: 'FOT-Cezanne ProN', sans-serif;

// After
$Font-Body: 'fot-cezanne-pron', sans-serif;
```

**教訓:**
- Adobe Fontsはフォント名を正規化（小文字・ハイフン区切り）して登録する
- `document.fonts`で実際の登録名を確認

---

### z-indexスタッキングコンテキスト問題

**問題:**
SPのハンバーガーボタン（z-index: 2001）がドロワー（z-index: 2000）の下に隠れてしまう。

**原因:**
CSSスタッキングコンテキストの仕様。

```
.l-header (z-index: 1000) ← スタッキングコンテキスト作成
  └── .l-header__menuBtn (z-index: 2001) ← 親のコンテキスト内で評価

.l-drawer (z-index: 2000) ← ルートのスタッキングコンテキストで評価
```

子要素のz-indexは親のスタッキングコンテキスト内でのみ有効。

**解決策:**
ドロワーオープン時にヘッダーのz-indexを上げる。

```scss
.l-header {
  z-index: 1000;

  &.is-drawer-open {
    @include mq('sp') {
      z-index: 2001;
    }
  }
}
```

**教訓:**
- `position: fixed`でも親のスタッキングコンテキストからは逃れられない
- 親要素のz-indexを動的に変更することで解決可能

---
<!-- 以下にデバッグ記録を追記 -->
