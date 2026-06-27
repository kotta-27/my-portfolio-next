import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { careerData } from '@/data/career'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { SectionLabel } from '@/components/SectionLabel'
import { CareerCard } from '@/components/CareerCard'
import { CareerInternToggle } from '@/components/CareerInternToggle'

export async function Career({ lang }: { lang: Lang }) {
  const t = ui[lang]

  const careerWithOg = await Promise.all(
    careerData.map(async (item) => ({
      ...item,
      links: await Promise.all(
        item.links.map(async (link) => ({
          ...link,
          image: link.thumbnail ?? (await fetchOgImage(link.url)),
        }))
      ),
    }))
  )

  const mainItems = careerWithOg.filter((item) => !item.isIntern)
  const internItems = careerWithOg.filter((item) => item.isIntern)

  return (
    <div id="career" className="animate-fade-in-up [animation-delay:100ms]">
      <SectionLabel>{t.sections.career}</SectionLabel>
      <div className="flex flex-col gap-2">
        {mainItems.map((item) => (
          <CareerCard key={item.en.company} item={item} lang={lang} />
        ))}
        <CareerInternToggle lang={lang} count={internItems.length}>
          {internItems.map((item) => (
            <CareerCard key={item.en.company} item={item} lang={lang} />
          ))}
        </CareerInternToggle>
      </div>
    </div>
  )
}
