# 画像ディレクトリ

このディレクトリには、LPテンプレートで使用する画像ファイルを配置します。

## 📁 ディレクトリ構成

```
images/
├── 00Common/           # 共通UI要素・アイコン（ヘッダー・フッター等）
│   ├── icon/          # 各種アイコン
│   ├── bgNoise.png    # ノイズテクスチャ
│   ├── footBg-*.jpg   # フッター背景
│   └── その他共通画像
├── samples/           # ✅ テンプレート用サンプル画像
│   ├── hero-image.svg       # ヒーロー画像
│   ├── product-image.svg    # 商品画像
│   ├── feature-icon-*.svg   # 特徴アイコン
│   ├── check-icon.svg       # チェックアイコン
│   ├── cta-bg.svg          # CTA背景
│   └── その他サンプル画像
└── README.md          # このファイル
```

## 🚀 使用方法

### 1. 新規プロジェクトでの画像設定

```bash
# プロジェクト用画像ディレクトリを作成
mkdir src/images/project-name

# サンプル画像をコピーして編集
cp src/images/samples/* src/images/project-name/
```

### 2. コンポーネントでの画像使用

```astro
---
// 画像のインポート
import heroImage from "../images/project-name/hero-image.jpg";
---

<img src={heroImage} alt="ヒーロー画像" />
```

### 3. 最適化された画像処理

```astro
---
import { processImages } from "../styles/images";
import backgroundImage from "../images/project-name/bg.jpg";

// 画像の最適化処理
const imageStyles = await processImages({
  'hero-bg': backgroundImage
});
---

<section style={imageStyles}>
  <!-- 背景画像が適用される -->
</section>
```

## 📋 画像最適化ガイドライン

### 推奨フォーマット
- **SVG**: ロゴ、アイコン、シンプルな図形
- **WebP**: 写真、複雑な画像（高圧縮率）
- **PNG**: 透明度が必要な画像
- **JPG**: 写真（WebP非対応ブラウザ用フォールバック）

### 推奨サイズ
- **ヒーロー画像**: 1200×800px
- **セクション画像**: 800×600px
- **アイコン**: 64×64px（SVG推奨）
- **背景画像**: 1400×600px

### レスポンシブ対応
```
hero-image-pc.jpg    # デスクトップ用（1200×800px）
hero-image-sp.jpg    # モバイル用（800×600px）
```

## 🎨 命名規則

### ファイル名
- **説明的な名前**: `hero-main.jpg` ❌ `img1.jpg`
- **デバイス対応**: `-pc.jpg`, `-sp.jpg`
- **小文字・ハイフン**: `section-background.jpg`

### 例
```
hero-image.svg           # 汎用ヒーロー画像
hero-image-pc.jpg        # PC用ヒーロー画像
hero-image-sp.jpg        # SP用ヒーロー画像
feature-icon-security.svg # セキュリティ特徴アイコン
```

## ⚠️ 注意事項

1. **著作権**: 商用利用可能な画像のみ使用
2. **ファイルサイズ**: 1ファイル500KB以下を推奨
3. **alt属性**: 必ず適切な代替テキストを設定
4. **遅延読み込み**: 大きな画像は `loading="lazy"` を使用

## 🔗 関連ツール

- **画像圧縮**: [TinyPNG](https://tinypng.com/)
- **SVG最適化**: [SVGO](https://github.com/svg/svgo)
- **WebP変換**: [Squoosh](https://squoosh.app/)

---

効率的な画像管理で高品質なLPを作成しましょう！ 📸✨