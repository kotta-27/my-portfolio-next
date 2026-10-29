import { PiMedalFill } from 'react-icons/pi'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { activitiesData, categoryLabel, type SubLinkCard } from '@/data/awards'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Pill } from '@/components/Pill'

/** タイルに出す件数。受賞と展示までにし、それより下（スタッフ参加など）は出さない。インタビュー記事は Output に残る */
const SHOWN = 5

function SubLink({ card, source, lang }: { card: SubLinkCard; source: string; lang: Lang }) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      title={card[lang]}
      className="flat-tile inline-flex items-center gap-[3px] bg-soft px-[8px] py-[2px] text-[10.5px] font-bold text-mute no-underline hover:bg-ground hover:text-ink transition-colors duration-150"
    >
      {source} ↗
    </a>
  )
}

export function AwardsTile({ lang }: { lang: Lang }) {
  return (
    <Tile id="awards">
      <TileLabel qty={SHOWN}>{ui[lang].sections.awards}</TileLabel>
      <ul className="mt-1 flex flex-col divide-y divide-soft">
        {activitiesData.slice(0, SHOWN).map((item) => (
          <li key={item.en} className="flex items-start gap-3 py-[9px] last:pb-0">
            <Pill size="xs" className="mt-[2px] w-[68px] shrink-0 text-center">
              {categoryLabel[item.category][lang]}
            </Pill>
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
