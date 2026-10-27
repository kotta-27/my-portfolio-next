import { NextResponse, type NextRequest } from 'next/server'
import { isBlogHost } from '@/lib/blog'

/**
 * blog.kotap.dev は学習ノートだけのサイトとして見せる。
 *   blog.kotap.dev/        → /notes（一覧）
 *   blog.kotap.dev/hnsw    → /notes/hnsw
 * URL は書き換えず、中身だけ /notes 以下のページを返す。
 */
export function middleware(req: NextRequest) {
  if (!isBlogHost(req.headers.get('host'))) return NextResponse.next()
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/notes')) return NextResponse.next()
  const url = req.nextUrl.clone()
  url.pathname = pathname === '/' ? '/notes' : `/notes${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Next.js の内部ファイル・画像最適化・拡張子付きの静的ファイルは振り替えない
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
}
