import { createHash } from 'node:crypto'
import { Redis } from '@upstash/redis'
import { notesData } from '@/data/notes'

/*
 * ノートの「いいね」の数を Upstash Redis に持つ。
 * 接続先は Vercel の Marketplace で Upstash を追加したときに入る環境変数から読む（KV_* と UPSTASH_* のどちらでも）。
 * 未設定の環境（手元など）では null を返し、ボタンは数を出さずに押せない状態になる。
 */

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

const countKey = (slug: string) => `likes:${slug}`
/** 同じ人の連打を防ぐ印。IP はそのまま保存せず、ハッシュにする */
const voterKey = (slug: string, ip: string) => `likes:${slug}:by:${createHash('sha256').update(`${slug}:${ip}`).digest('hex').slice(0, 32)}`
/** 同じ IP から数え直せるまでの期間 */
const VOTE_TTL = 60 * 60 * 24 * 30

export const isNote = (slug: string) => notesData.some((n) => n.slug === slug)

export async function getLikes(slug: string): Promise<number | null> {
  if (!redis) return null
  return (await redis.get<number>(countKey(slug))) ?? 0
}

/** いいねする。同じ IP から既に押されていれば数は増やさない */
export async function like(slug: string, ip: string): Promise<{ count: number | null; liked: boolean }> {
  if (!redis) return { count: null, liked: false }
  const first = await redis.set(voterKey(slug, ip), 1, { nx: true, ex: VOTE_TTL })
  const count = first ? await redis.incr(countKey(slug)) : ((await redis.get<number>(countKey(slug))) ?? 0)
  return { count, liked: true }
}

/** いいねを取り消す。その IP の印があるときだけ数を減らす */
export async function unlike(slug: string, ip: string): Promise<{ count: number | null; liked: boolean }> {
  if (!redis) return { count: null, liked: false }
  const removed = await redis.del(voterKey(slug, ip))
  const count = removed ? Math.max(0, await redis.decr(countKey(slug))) : ((await redis.get<number>(countKey(slug))) ?? 0)
  return { count, liked: false }
}
