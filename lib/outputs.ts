import type { Lang } from '@/types'
import { articles } from '@/data/awards'
import { activitiesData } from '@/data/awards'
import { careerData } from '@/data/career'

export type OutputKind = 'article' | 'interview' | 'blog' | 'talk' | 'press' | 'page'

export type OutputItem = {
  url: string
  label: Record<Lang, string>
  /** 表示用のソース名（Zenn / Interview / Tech Blog / Talk / Press） */
  source: string
  kind: OutputKind
  /** 既知のサムネイル。無ければ OG 画像を取りに行く */
  thumbnail: string | null
}

function kindOf(source: string): OutputKind {
  const s = source.toLowerCase()
  if (s.includes('interview')) return 'interview'
  if (s.includes('blog')) return 'blog'
  if (s.includes('talk')) return 'talk'
  if (s.includes('press')) return 'press'
  if (s === 'zenn' || s === 'qiita') return 'article'
  return 'page'
}

/** 記事・インタビュー・ブログ・登壇・プレスを 1 本のリストにまとめる（URL で重複排除） */
export function collectOutputs(): OutputItem[] {
  const out: OutputItem[] = []
  const seen = new Set<string>()
  const push = (item: OutputItem) => {
    if (seen.has(item.url)) return
    seen.add(item.url)
    out.push(item)
  }

  for (const a of articles) push({ url: a.href, label: { en: a.en, ja: a.ja }, source: a.source, kind: 'article', thumbnail: null })

  for (const c of careerData) {
    for (const l of c.links) push({ url: l.url, label: { en: l.label, ja: l.label }, source: l.source, kind: kindOf(l.source), thumbnail: l.thumbnail })
  }

  for (const act of activitiesData) {
    if (act.interview) push({ url: act.interview.url, label: { en: act.interview.en, ja: act.interview.ja }, source: 'Interview', kind: 'interview', thumbnail: act.interview.thumbnail ?? null })
    if (act.pressRelease) push({ url: act.pressRelease.url, label: { en: act.pressRelease.en, ja: act.pressRelease.ja }, source: 'Press Release', kind: 'press', thumbnail: act.pressRelease.thumbnail ?? null })
  }

  // 記事 → インタビュー → ブログ → 登壇 → プレス の順
  const order: OutputKind[] = ['article', 'interview', 'blog', 'talk', 'press', 'page']
  return out.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
}

/** Output ビューの区分 */
export type OutputGroup = 'blog' | 'interview' | 'talk' | 'press'

export const OUTPUT_GROUPS: { id: OutputGroup; label: Record<Lang, string>; blurb: Record<Lang, string> }[] = [
  { id: 'blog', label: { en: 'Tech Blog', ja: 'Tech Blog' }, blurb: { en: 'Zenn posts and the company tech blog.', ja: 'Zenn と会社の Tech Blog。' } },
  { id: 'interview', label: { en: 'Interview', ja: 'Interview' }, blurb: { en: 'Conversations about internships and work.', ja: 'インターンや仕事についてのインタビュー。' } },
  { id: 'talk', label: { en: 'Talk', ja: 'Talk' }, blurb: { en: 'Slides and talks.', ja: '登壇・スライド。' } },
  { id: 'press', label: { en: 'Press Release', ja: 'Press Release' }, blurb: { en: 'Announcements I was part of.', ja: '関わった発表・プレスリリース。' } },
]

export function groupOf(kind: OutputKind): OutputGroup {
  if (kind === 'article' || kind === 'blog') return 'blog'
  if (kind === 'interview') return 'interview'
  if (kind === 'talk') return 'talk'
  return 'press'
}
