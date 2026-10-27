import { NextResponse, type NextRequest } from 'next/server'
import { BLOG_ORIGIN, isBlogHost } from '@/lib/blog'

/**
 * blog.kotap.dev は学習ノートだけのサイトとして見せる。
 *   blog.kotap.dev/        → /notes（一覧）
 *   blog.kotap.dev/hnsw    → /notes/hnsw
 * URL は書き換えず、中身だけ /notes 以下のページを返す。
 * ノートの URL は blog.kotap.dev に揃えるので、/notes で始まる URL はそちらへ転送する。
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get('host')
  const { pathname, search } = req.nextUrl
  const isNotes = pathname === '/notes' || pathname.startsWith('/notes/')
  const short = pathname.replace(/^\/notes/, '') || '/'

  if (isBlogHost(host)) {
    // blog.kotap.dev/notes/hnsw → blog.kotap.dev/hnsw
    if (isNotes) return NextResponse.redirect(new URL(`${short}${search}`, req.url), 308)
    const url = req.nextUrl.clone()
    url.pathname = pathname === '/' ? '/notes' : `/notes${pathname}`
    return NextResponse.rewrite(url)
  }

  // 本番の kotap.dev / www.kotap.dev だけ転送する（手元の開発やプレビューは /notes のまま見られる）
  if (isNotes && host?.endsWith('kotap.dev')) return NextResponse.redirect(`${BLOG_ORIGIN}${short}${search}`, 308)
  return NextResponse.next()
}

export const config = {
  // Next.js の内部ファイル・画像最適化・拡張子付きの静的ファイル（記事の画像など）は振り替えない
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
}
