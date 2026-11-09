import type { Metadata } from 'next'
import { home } from '@/data/home'
import { getLang } from '@/lib/lang'
import { collectOutputs, groupOf, OUTPUT_GROUPS } from '@/lib/outputs'
import { SiteShell } from '@/components/home/SiteShell'
import { OutputItemCard, PageHead, SectionHead, Split } from '@/components/home/Sections'

export const metadata: Metadata = { title: 'Output — Kota Mizuno' }

/** 書いたものの一覧。ノート・技術ブログ・インタビュー・登壇・プレスの区分ごと */
export default async function OutputPage() {
  const lang = await getLang()
  const t = home[lang]
  const items = collectOutputs()
  return (
    <SiteShell lang={lang}>
      <PageHead back={t.pages.back} eyebrow={t.output.eyebrow} title={t.pages.output.title} blurb={t.pages.output.blurb} />
      {OUTPUT_GROUPS.map((g) => {
        const members = items.filter((o) => groupOf(o.kind) === g.id)
        if (members.length === 0) return null
        return (
          <Split
            key={g.id}
            id={g.id}
            head={
              <SectionHead eyebrow={`×${members.length}`} title={g.label[lang]}>
                <p className="text-[15px] leading-[1.8] text-mute">{g.blurb[lang]}</p>
              </SectionHead>
            }
          >
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((o) => (
                <li key={o.url}>
                  <OutputItemCard item={o} lang={lang} />
                </li>
              ))}
            </ul>
          </Split>
        )
      })}
    </SiteShell>
  )
}
