import Image from 'next/image'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { careerData } from '@/data/career'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Tag } from '@/components/Tag'
import { PreviewLink } from '@/components/PreviewLink'

export async function CareerTile({ lang }: { lang: Lang }) {
  const t = ui[lang]

  const items = await Promise.all(
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

  return (
    <Tile id="career" clip={false}>
      <TileLabel>{t.sections.career}</TileLabel>
      <ul className="mt-1 grid grid-cols-1 divide-y divide-soft lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {items.map((item) => (
          <li key={item.en.company} className="flex flex-col gap-2 py-3 first:pt-1 last:pb-0 lg:px-5 lg:py-1 lg:first:pl-0 lg:last:pr-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 lg:flex-col lg:items-start">
              <div className="flex flex-wrap items-center gap-[8px]">
                {item.logo && (
                  <span className="relative h-[18px] w-[18px] shrink-0">
                    <Image src={item.logo} alt={item[lang].company} fill className="object-contain" />
                  </span>
                )}
                <span className="text-[13.5px] font-extrabold">{item[lang].company}</span>
                <span className="text-[11.5px] text-mute">{item[lang].role}</span>
                {item.isIntern && (
                  <span className="rounded-full bg-soft px-[7px] py-[2px] text-[9.5px] font-bold uppercase tracking-[.06em] text-mute">
                    {t.tiles.intern}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10.5px] text-mute tabular-nums">{item.period}</span>
            </div>
            <p className="text-[12px] leading-[1.6] text-mute">{item[lang].description}</p>
            <div className="flex flex-wrap gap-[5px]">
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            {item.links.length > 0 && (
              <div className="flex flex-col gap-[6px]">
                {item.links.map((link) => (
                  <PreviewLink
                    key={link.url}
                    card={{ url: link.url, label: link.label, source: link.source, thumbnail: link.image }}
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Tile>
  )
}
