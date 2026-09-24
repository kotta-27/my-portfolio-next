import { PiMedalFill } from 'react-icons/pi'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { activitiesData, categoryLabel, type SubLinkCard } from '@/data/awards'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

function SubLink({ card, source, lang }: { card: SubLinkCard; source: string; lang: Lang }) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      title={card[lang]}
      className="inline-flex items-center gap-[3px] rounded-full bg-soft px-[8px] py-[2px] text-[10.5px] font-bold text-mute no-underline hover:bg-ground hover:text-ink transition-colors duration-150"
    >
      {source} ↗
    </a>
  )
}

export function AwardsTile({ lang }: { lang: Lang }) {
  const t = ui[lang]
  const prizeCount = activitiesData.filter((item) => item.award).length

  return (
    <Tile id="awards">
      <TileLabel>{t.sections.awards}</TileLabel>
      <div className="flex items-baseline gap-2">
        <span className="text-[44px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">{prizeCount}</span>
        <span className="text-[12px] font-bold text-mute">{t.tiles.prizes}</span>
      </div>
      <ul className="mt-2 flex flex-col divide-y divide-soft">
        {activitiesData.map((item) => (
          <li key={item.en} className="flex items-start gap-3 py-[9px] last:pb-0">
            <span className="mt-[2px] w-[68px] shrink-0 rounded-full bg-soft px-[7px] py-[2px] text-center text-[9.5px] font-bold uppercase tracking-[.06em] text-mute">
              {categoryLabel[item.category][lang]}
            </span>
            <div className="min-w-0 flex-1">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12.5px] font-semibold leading-[1.45] text-ink underline decoration-ground underline-offset-2 hover:text-teal transition-colors duration-150"
                >
                  {item[lang]}
                </a>
              ) : (
                <p className="text-[12.5px] font-semibold leading-[1.45]">{item[lang]}</p>
              )}
              {item.award && (
                <p className="mt-[3px] flex items-center gap-[4px] text-[11px] font-bold text-coral">
                  <PiMedalFill className="text-[12px] shrink-0" />
                  {item.award[lang]}
                </p>
              )}
              {(item.interview || item.pressRelease || item.page) && (
                <div className="mt-[6px] flex flex-wrap gap-[5px]">
                  {item.interview && <SubLink card={item.interview} source="Interview" lang={lang} />}
                  {item.pressRelease && <SubLink card={item.pressRelease} source="Press" lang={lang} />}
                  {item.page && <SubLink card={item.page} source="Page" lang={lang} />}
                </div>
              )}
            </div>
            <span className="shrink-0 font-mono text-[10.5px] text-mute tabular-nums">{item.date}</span>
          </li>
        ))}
      </ul>
    </Tile>
  )
}
