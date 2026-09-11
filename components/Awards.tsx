import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { activitiesData, articles } from '@/data/awards'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { SectionLabel } from '@/components/SectionLabel'
import { LinkCard } from '@/components/LinkCard'
import { AwardRow } from '@/components/AwardRow'

export async function Awards({ lang }: { lang: Lang }) {
  const t = ui[lang]

  const articlesWithOg = await Promise.all(
    articles.map(async (article) => ({
      ...article,
      thumbnail: await fetchOgImage(article.href),
    }))
  )

  return (
    <div id="awards">
      <SectionLabel>{t.sections.awards}</SectionLabel>
      <div className="bg-white rounded-[10px] overflow-hidden">
        {activitiesData.map((item, i) => (
          <AwardRow key={item.en} item={item} lang={lang} index={i} />
        ))}

        <div className="px-7 py-5">
          <p className="text-[9px] tracking-[.1em] uppercase text-[#999] mb-[13px]">
            {t.articlesLabel}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {articlesWithOg.map((article) => (
              <LinkCard
                key={article.href}
                card={{ url: article.href, label: article[lang], source: article.source, thumbnail: article.thumbnail }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
