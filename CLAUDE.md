# Portfolio — CLAUDE.md

## Commands
- `npm run dev` — 開発サーバー起動 (localhost:3000)
- `npm run build` — 本番ビルド
- `npm run lint` — ESLint チェック

## Stack
- Next.js 14 (App Router) / TypeScript / Tailwind CSS / React Icons

## Structure
- `app/` — ページ・レイアウト (App Router)
- `components/` — 再利用コンポーネント
- `data/` — コンテンツデータ (TS)
- `lib/` — ユーティリティ
- `public/` — 静的ファイル

## Rules

<important if="writing_code">
- TypeScript strict: 型を省略しない。`any` 禁止
- スタイルは Tailwind CSS のみ。インラインスタイル禁止
- コンポーネントは `components/` に配置。ページ内に直書きしない
- `react-icons` を使う。SVG を直書きしない
</important>

<important if="creating_new_components">
- 既存の `components/ui/` にあるものは必ず再利用する
- Props に型定義必須
- `"use client"` は本当に必要な場合のみ
</important>

<important if="editing_content">
- コンテンツデータは `data/` 内のファイルを編集する
- ページコンポーネントにハードコードしない
</important>

## Do NOT touch
- `package-lock.json`
- `.env*` ファイル
- `next.config.ts`（変更が必要な場合は必ず確認を取ること）
