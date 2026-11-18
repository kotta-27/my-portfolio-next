/** 学習ノートは blog.kotap.dev でも配信する。middleware がこのホストのパスを /notes 以下に振り替える */
export const BLOG_ORIGIN = 'https://blog.kotap.dev'
export const SITE_ORIGIN = 'https://www.kotap.dev'

export const isBlogHost = (host: string | null) => Boolean(host?.startsWith('blog.'))

/**
 * ノートへのリンク。本番では blog.kotap.dev、手元の開発や Vercel のプレビューでは同じサイトの /notes を開く。
 * VERCEL_ENV はサーバーでだけ読めるので、サーバーコンポーネントから呼ぶこと。
 */
export const noteUrl = (slug: string) => (process.env.VERCEL_ENV === 'production' ? `${BLOG_ORIGIN}/${slug}` : `/notes/${slug}`)
