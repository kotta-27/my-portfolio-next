import type { Lang } from '@/types'
import { careerData, type ResolvedCareerItem } from '@/data/career'
import { fetchOgImage } from '@/lib/fetchOgImage'

const MONTH = /([A-Z][a-z]{2}) (\d{4})/g

function toMonthIndex(m: RegExpMatchArray): number {
  const d = new Date(`${m[1]} 1, ${m[2]}`)
  return d.getFullYear() * 12 + d.getMonth()
}

function months(period: string): RegExpMatchArray[] {
  return [...period.matchAll(MONTH)]
}

/** 終了月が書かれていない期間（'Apr 2026 —'）は現職 */
export function isOngoing(period: string): boolean {
  return months(period).length < 2
}

/** 会社全体の期間。最古のポジションの開始 〜 最新のポジションの終了 */
export function companyPeriod(item: { positions: { period: string }[] }): string {
  const newest = item.positions[0].period
  const oldest = item.positions[item.positions.length - 1].period
  const [start] = months(oldest)
  const [, end] = months(newest)
  if (!start) return newest
  return end ? `${start[0]} – ${end[0]}` : `${start[0]} —`
}

/** 在籍期間（両端の月を含む）。終了月が無ければ今月まで */
export function durationLabel(period: string, lang: Lang, now = new Date()): string {
  const [start, end] = months(period)
  if (!start) return ''
  const last = end ? toMonthIndex(end) : now.getFullYear() * 12 + now.getMonth()
  const total = Math.max(1, last - toMonthIndex(start) + 1)
  const y = Math.floor(total / 12)
  const m = total % 12
  if (lang === 'ja') return `${y ? `${y}年` : ''}${m ? `${m}ヶ月` : ''}`
  const yy = y ? `${y} yr${y > 1 ? 's' : ''}` : ''
  const mm = m ? `${m} mo${m > 1 ? 's' : ''}` : ''
  return [yy, mm].filter(Boolean).join(' ')
}

/** 並べ替え用: 最後に在籍していた月（現職は最大）→ 開始月 */
function recency(period: string): [number, number] {
  const [start, end] = months(period)
  return [end ? toMonthIndex(end) : Number.MAX_SAFE_INTEGER, start ? toMonthIndex(start) : 0]
}

/** リンクのサムネイルを解決し、在籍が古い順（現職が最後）に並べる */
export async function loadCareer(): Promise<ResolvedCareerItem[]> {
  const items = await Promise.all(
    careerData.map(async (item) => ({
      ...item,
      positions: await Promise.all(
        item.positions.map(async (pos) => ({
          ...pos,
          links: await Promise.all(
            pos.links.map(async (link) => ({
              ...link,
              image: link.thumbnail ?? (await fetchOgImage(link.url)),
            })),
          ),
        })),
      ),
    })),
  )
  return items.sort((a, b) => {
    const [ae, as] = recency(companyPeriod(a))
    const [be, bs] = recency(companyPeriod(b))
    return ae - be || as - bs
  })
}
