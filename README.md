# Kota Mizuno — Portfolio

Next.js 15 + Tailwind CSS portfolio site.

## セットアップ

```bash
cd nextjs
npm install
npm run dev
```

→ http://localhost:3000 で確認

## 写真の追加

`public/mepic2.png` に写真を追加して、`app/page.tsx` の Hero コンポーネント内のコメントを参照してください。

```tsx
// Before (placeholder):
<div className="w-[172px] h-[212px] ...">...</div>

// After (real photo):
import Image from 'next/image'

<div className="relative w-[172px] h-[212px] rounded-[10px] overflow-hidden shrink-0">
  <Image src="/mepic2.png" alt="Kota Mizuno" fill className="object-cover" />
</div>
```

## プロジェクトのスクリーンショット追加

同様に `public/orbit.png` などを追加して、Projects コンポーネントのコメントを参照してください。

## GitHub リンクの更新

`app/page.tsx` の `projectsData` 配列内の各 `href` を実際のリポジトリURLに更新してください。

## Vercel へのデプロイ

```bash
# Vercel CLI をインストール済みの場合
vercel

# または GitHub に push して Vercel と連携
```

## 静的エクスポート（GitHub Pages 等）

`next.config.ts` の `output: 'export'` のコメントアウトを外してください。

```ts
const nextConfig: NextConfig = {
  output: 'export', // ← uncomment
}
```
