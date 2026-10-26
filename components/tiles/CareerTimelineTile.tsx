import Image from 'next/image'
import { PiArrowUpRight, PiCaretUpBold, PiCheckCircleFill } from 'react-icons/pi'
import type { Lang } from '@/types'
import type { ResolvedCareerPosition } from '@/data/career'
import { ui } from '@/data/ui'
import { companyPeriod, durationLabel, isOngoing, loadCareer } from '@/lib/career'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Tag } from '@/components/Tag'
import { Pill } from '@/components/Pill'
import { Thumb } from '@/components/Thumb'
import { ArrowBadge } from '@/components/ArrowBadge'

/** キャリアタブ用。最新を一番上に、下へ遡る縦のタイムラインで各社の詳細まで見せる */
export async function CareerTimelineTile({ lang }: { lang: Lang }) {
  const t = ui[lang]
  const items = (await loadCareer()).reverse()

  return (
    <Tile id="career-timeline" clip={false} className="p-5 sm:p-8">
      <TileLabel>{t.sections.career}</TileLabel>
      <ol className="mt-4">
        {/* 軌道の先端: 上へ行くほど新しい */}
        <li aria-hidden className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[150px_18px_minmax(0,1fr)] sm:gap-x-6">
          <div className="hidden sm:block" />
          <div className="flex h-[30px] flex-col items-center">
            <PiCaretUpBold className="shrink-0 text-[16px] text-mute" />
            <span className="-mt-[2px] w-[2px] flex-1 rounded-full bg-soft" />
          </div>
          <div />
        </li>
        {items.map((item, i) => {
          const [latest] = item.positions
          const current = isOngoing(latest.period)
          const multiple = item.positions.length > 1
          const last = i === items.length - 1
          const period = companyPeriod(item)
          const duration = durationLabel(period, lang)
          return (
            <li key={item.company.en} className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[150px_18px_minmax(0,1fr)] sm:gap-x-6">
              {/* 期間（sm 以上は左の列）。複数ポジションの会社は通算 */}
              <div className="hidden pt-[1px] text-right sm:block">
                <p className={`font-mono text-[12px] tabular-nums ${current ? 'font-bold text-teal' : 'text-ink'}`}>{period}</p>
                <p className="mt-[2px] text-[11px] text-mute">{duration}</p>
              </div>

              {/* 軌道: ノードと次の社への線 */}
              <div className="relative flex justify-center">
                <span
                  className={`stud-dot relative z-10 mt-[1px] h-[18px] w-[18px] shrink-0 ${current ? 'stud-dot--on' : ''}`}
                />
                {!last && <span aria-hidden className="absolute bottom-0 top-[20px] w-[2px] rounded-full bg-soft" />}
              </div>

              <div className={`min-w-0 ${last ? '' : 'pb-12'}`}>
                <p className="mb-2 font-mono text-[11.5px] tabular-nums text-mute sm:hidden">
                  <span className={current ? 'font-bold text-teal' : 'text-ink'}>{period}</span>
                  {duration && <span> · {duration}</span>}
                </p>

                <div className="flex items-start gap-3">
                  {item.logo && (
                    <span className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-[10px] border border-soft bg-tile dark:border-transparent dark:bg-white">
                      <Image src={item.logo} alt={item.company[lang]} fill sizes="40px" className="object-contain p-[6px]" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[17px] font-extrabold leading-tight tracking-[-0.01em]">{item.company[lang]}</h3>
                      {current ? (
                        <span className="flat-tile bg-teal px-[7px] py-[2px] text-[9.5px] font-bold uppercase tracking-[.06em] text-paper">now</span>
                      ) : (
                        !multiple && latest.isIntern && <Pill size="xs">{t.tiles.intern}</Pill>
                      )}
                    </div>
                    {!multiple && <p className="mt-[2px] text-[12.5px] font-semibold text-mute">{latest.role[lang]}</p>}
                  </div>
                </div>

                {multiple ? (
                  // インターン → 正社員のように、同じ会社のポジションを新しい順に
                  <div className="mt-5 flex flex-col gap-7">
                    {item.positions.map((pos) => {
                      const ongoing = isOngoing(pos.period)
                      return (
                        <div key={pos.period} className={`border-l-2 pl-4 ${ongoing ? 'border-teal' : 'border-soft'}`}>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h4 className="text-[14.5px] font-extrabold">{pos.role[lang]}</h4>
                            <Pill size="xs">{pos.isIntern ? t.tiles.intern : t.tiles.fullTime}</Pill>
                          </div>
                          <p className="mt-[3px] font-mono text-[11.5px] tabular-nums text-mute">
                            <span className={ongoing ? 'font-bold text-teal' : 'text-ink'}>{pos.period}</span> · {durationLabel(pos.period, lang)}
                          </p>
                          <PositionBody pos={pos} lang={lang} />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <PositionBody pos={latest} lang={lang} />
                )}

                <div className="mt-4 flex flex-wrap gap-[5px]">
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

/** 1 ポジション分の説明・やったこと・関連記事 */
function PositionBody({ pos, lang }: { pos: ResolvedCareerPosition; lang: Lang }) {
  const t = ui[lang]
  const highlights = pos.highlights?.[lang] ?? []
  return (
    <>
      <p className="mt-3 max-w-[70ch] text-[13.5px] leading-[1.8] text-ink/80">{pos.description[lang]}</p>

      {highlights.length > 0 && (
        <section className="mt-4">
          <TileLabel>{t.tiles.careerHighlights}</TileLabel>
          <ul className="mt-2 flex max-w-[70ch] flex-col gap-[7px]">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-[13px] leading-[1.7]">
                <PiCheckCircleFill className="mt-[4px] shrink-0 text-[14px] text-teal" />
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {pos.links.length > 0 && (
        <section className="mt-4">
          <TileLabel>{t.tiles.careerLinks}</TileLabel>
          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
            {pos.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-[12px] bg-soft p-2 pr-3 no-underline transition-colors duration-150 hover:bg-ground"
              >
                {link.image && (
                  <span className="relative aspect-[1200/630] w-[104px] shrink-0 overflow-hidden rounded-[8px] bg-ground">
                    <Thumb src={link.image} alt="" sizes="104px" className="object-cover" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[9.5px] font-extrabold uppercase tracking-[.08em] text-mute">{link.source}</span>
                  <span className="mt-[2px] line-clamp-2 block text-[12.5px] font-bold leading-[1.45] text-ink">{link.label[lang]}</span>
                </span>
                <ArrowBadge icon={PiArrowUpRight} size="sm" />
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
