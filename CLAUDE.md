# Portfolio (Town) — CLAUDE.md

## Commands
- `npm run dev` — 開発サーバー起動 (localhost:3000)
- `npm run build` — 本番ビルド
- `npm run lint` — ESLint チェック

## Stack
- Next.js 15 (App Router) / TypeScript / Tailwind CSS / React Icons / three

## Design (Lego town)
- トップは画面いっぱいの「レゴの街」。`components/town/TownView.tsx`（画面・パネル）と `lib/town/scene.ts`（three の街・人形）。建物 = セクション（`lib/town/sections.ts`）
- 建物に着くと開くパネルの中身は `components/town/Panels.tsx`。看板や操作の文言は `data/town.ts`
- トップは街だけ。詳しい中身は各一覧ページ（/projects・/career・/output）。WebGL が使えないときは、街の代わりにそのリンクを出す
- ブロックの形と材質は `lib/bricks/geometry.ts`、歯車などは `lib/bricks/technic.ts`
- 色は `tailwind.config.ts` のトークンのみ: `ground` `tile` `ink` `teal` `coral` `mustard` `mute` `soft`。生の HEX を className に書かない
- 書体: `font-sans`（Plus Jakarta Sans / Noto Sans JP）、数値は `font-mono`（JetBrains Mono）+ `tabular-nums`

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
