# プロジェクトコンテキスト

## プロジェクト概要

- **プロジェクト名**: ケイタスプラン コーポレートサイト（株式会社ケイタスプラン）
- **種類**: コーポレートサイト（マルチページ・静的ビルド）。LP Astroテンプレートをベースに拡張
- **デザイン**: Figma「【社内】ケイタスプラン_コーポレートサイト」（PC基準幅1536 / SP基準幅768）

## 環境情報

- **ホスティング**: Vercel（クライアントのGitHub個人リポジトリと連携）。プレビューは `middleware.ts` のBasic認証で保護
- **開発サーバー**: http://localhost:4321（ユーザーが起動・管理）
- **環境変数**: `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY`（ローカルは`.env`、Vercelにも設定）

## 技術スタック

- Astro 7.x（7.0.4+。Vite 8 / sass-embedded / Lightning CSS）
- TypeScript
- SCSS (BEM + FLOCSS)
- GSAP (ScrollTrigger)
- Splide 4.1.4（スライダー）
- microcms-js-sdk 3.4（コンテンツ管理。取得はすべてビルド時 → 詳細は `project-knowledge.md`）
- Sharp (画像最適化)
- Fontsource セルフホスト（Zen Kaku Gothic New / Noto Sans JP / Oswald / Readex Pro / Roboto）

## ページ構成（src/pages/）

- `/` トップ
- `/business` 事業紹介
- `/data` 数字で見る
- `/members` メンバー一覧・`/members/{slug}` 詳細
- `/voices` お客様の声一覧（ページネーション）・詳細は雛形
- `/news` ニュース一覧（カテゴリ別・ページネーション）・`/news/detail/{id}` 詳細
- URL構造・ページサイズ等の詳細は `project-knowledge.md` の「ニュース・お客様の声のページ戦略」を参照

## 制約条件

- Figmaデザインからの変更禁止（照合手順は `.claude/figma-check.md`）
- 全ての単位は`size()`関数を使用
- 変数名・クラス名に「Figma」の使用禁止
- BEM方法論に従ったクラス命名
- コミットはユーザーの明示的な指示があるときのみ

## 関連ドキュメント

- `.claude/project-knowledge.md` — 実装パターン・microCMS戦略・設計判断
- `.claude/figma-check.md` — Figma忠実性チェック手順
