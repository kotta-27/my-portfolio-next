import { NextResponse, type NextRequest } from 'next/server'
import { getLikes, isNote, like, unlike } from '@/lib/likes'

// 数は毎回読む（キャッシュしない）
export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ slug: string }> }

/** Vercel では x-forwarded-for の先頭が訪問者の IP */
const clientIp = (req: NextRequest) => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'

async function guard(ctx: Ctx) {
  const { slug } = await ctx.params
  return isNote(slug) ? slug : null
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const slug = await guard(ctx)
  if (!slug) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json({ count: await getLikes(slug) })
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const slug = await guard(ctx)
  if (!slug) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(await like(slug, clientIp(req)))
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const slug = await guard(ctx)
  if (!slug) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(await unlike(slug, clientIp(req)))
}
