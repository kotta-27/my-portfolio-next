/** 学習ノートは blog.kotap.dev でも配信する。middleware がこのホストのパスを /notes 以下に振り替える */
export const BLOG_ORIGIN = 'https://blog.kotap.dev'
export const SITE_ORIGIN = 'https://www.kotap.dev'

export const isBlogHost = (host: string | null) => Boolean(host?.startsWith('blog.'))
