import Image from 'next/image'
import { PiCaretRightBold } from 'react-icons/pi'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { careerData } from '@/data/career'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Tag } from '@/components/Tag'
import { PreviewLink } from '@/components/PreviewLink'

/** 'Sep 2023 – Mar 2024' / 'Apr 2026 —' の開始月を比較用の数値にする */
function startOf(period: string): number {
  const m = period.match(/([A-Z][a-z]{2}) (\d{4})/)
  return m ? Date.parse(`${m[1]} 1, ${m[2]}`) : 0
}

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
  // 古い順に左から並べて「流れ」にする
  items.sort((a, b) => startOf(a.period) - startOf(b.period))

  return (
    <Tile id="career" clip={false}>
      <TileLabel>{t.sections.career}</TileLabel>
      <ol className="relative mt-2 grid grid-cols-1 gap-7 lg:grid-cols-4 lg:gap-6">
        {/* 軌道線: スマホは縦、lg では横 */}
        <span aria-hidden className="absolute bottom-0 left-[8px] top-0 w-[2px] rounded-full bg-soft lg:bottom-auto lg:left-0 lg:right-6 lg:top-[8px] lg:h-[2px] lg:w-auto" />
        <span aria-hidden className="absolute right-0 top-[1px] hidden text-mute lg:block">
          <PiCaretRightBold className="text-[16px]" />
        </span>
        {items.map((item) => {
          const current = !item.isIntern
          return (
            <li key={item.en.company} className="relative pl-8 lg:pl-0 lg:pt-8">
              {/* ノード */}
              <span
                className={`absolute left-0 top-0 h-[18px] w-[18px] rounded-full border-2 ${
                  current ? 'border-teal bg-teal shadow-[0_0_0_5px_rgba(14,138,140,0.18)]' : 'border-mute/60 bg-tile'
                }`}
              />
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className={`font-mono text-[11px] tabular-nums ${current ? 'font-bold text-teal' : 'text-mute'}`}>{item.period}</span>
                  {current ? (
                    <span className="rounded-full bg-teal px-[7px] py-[2px] text-[9.5px] font-bold uppercase tracking-[.06em] text-white">now</span>
                  ) : (
                    <span className="rounded-full bg-soft px-[7px] py-[2px] text-[9.5px] font-bold uppercase tracking-[.06em] text-mute">{t.tiles.intern}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  {item.logo && (
                    <span className="relative top-[3px] h-[18px] w-[18px] shrink-0">
                      <Image src={item.logo} alt={item[lang].company} fill className="object-contain" />
                    </span>
                  )}
                  <span className="text-[13.5px] font-extrabold">{item[lang].company}</span>
                  <span className="text-[11.5px] text-mute">{item[lang].role}</span>
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
                      <PreviewLink key={link.url} card={{ url: link.url, label: link.label, source: link.source, thumbnail: link.image }} />
                    ))}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </Tile>
  )
}
