import Image from 'next/image'
import { PiCaretRightBold, PiCaretUpBold } from 'react-icons/pi'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { companyPeriod, isOngoing, loadCareer } from '@/lib/career'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Tag } from '@/components/Tag'
import { ViewSwitchLink } from '@/components/ViewSwitchLink'
import { Pill } from '@/components/Pill'

export async function CareerTile({ lang }: { lang: Lang }) {
  const t = ui[lang]

  // 古い順に並べる。lg では左→右の「流れ」、スマホでは逆順に積んで最新を上にする（Career タブと同じ向き）
  const items = await loadCareer()

  return (
    <Tile id="career" clip={false}>
      <div className="flex items-center justify-between gap-3">
        <TileLabel step={3} qty={items.length}>{t.sections.career}</TileLabel>
        <ViewSwitchLink view="career" label={t.tiles.careerMore} />
      </div>
      <ol className="relative mt-2 flex flex-col-reverse gap-7 pt-7 lg:grid lg:grid-cols-4 lg:gap-6 lg:pt-0">
        {/* 軌道線: スマホは縦（上が新しい）、lg では横（右が新しい） */}
        <span aria-hidden className="absolute left-0 top-0 w-[18px] text-center text-mute lg:hidden">
          <PiCaretUpBold className="inline text-[16px]" />
        </span>
        <span aria-hidden className="absolute bottom-0 left-[8px] top-[14px] w-[2px] rounded-full bg-soft lg:bottom-auto lg:left-0 lg:right-6 lg:top-[8px] lg:h-[2px] lg:w-auto" />
        <span aria-hidden className="absolute right-0 top-[1px] hidden text-mute lg:block">
          <PiCaretRightBold className="text-[16px]" />
        </span>
        {items.map((item) => {
          const [latest, ...earlier] = item.positions
          const current = isOngoing(latest.period)
          return (
            <li key={item.company.en} className="relative pl-8 lg:pl-0 lg:pt-8">
              {/* ノード */}
              <span
                className={`stud-dot absolute left-0 top-0 h-[18px] w-[18px] ${current ? 'stud-dot--on' : ''}`}
              />
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className={`font-mono text-[11px] tabular-nums ${current ? 'font-bold text-teal' : 'text-mute'}`}>{companyPeriod(item)}</span>
                  {current ? (
                    <span className="flat-tile bg-teal px-[7px] py-[2px] text-[9.5px] font-bold uppercase tracking-[.06em] text-paper">now</span>
                  ) : (
                    latest.isIntern && <Pill size="xs">{t.tiles.intern}</Pill>
                  )}
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  {item.logo && (
                    <span className="relative top-[3px] h-[18px] w-[18px] shrink-0 dark:rounded-[4px] dark:bg-white">
                      {/* 黒いロゴがダークで沈まないよう、ダーク時は白い台に載せる */}
                      <Image src={item.logo} alt={item.company[lang]} fill sizes="18px" className="object-contain dark:p-[2px]" />
                    </span>
                  )}
                  <span className="text-[13.5px] font-extrabold">{item.company[lang]}</span>
                  <span className="text-[11.5px] text-mute">{latest.role[lang]}</span>
                </div>
                {/* インターンから続いている場合などは、以前のポジションを一行で添える */}
                {earlier.map((p) => (
                  <p key={p.period} className="font-mono text-[10.5px] tabular-nums text-mute">
                    {p.role[lang]} · {p.period}
                  </p>
                ))}
                <p className="text-[12px] leading-[1.6] text-mute">{latest.description[lang]}</p>
                <div className="flex flex-wrap gap-[5px]">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </Tile>
  )
}
