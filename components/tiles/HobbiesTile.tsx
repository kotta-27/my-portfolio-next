import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { hero } from '@/data/hero'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

function Chips({ items, accent }: { items: string[]; accent: boolean }) {
  const tone = accent ? 'bg-teal/10 text-teal' : 'bg-soft text-ink'
  return (
    <div className="flex flex-wrap gap-[6px]">
      {items.map((item) => (
        <span key={item} className={`rounded-full px-[10px] py-[4px] text-[11.5px] font-bold ${tone}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

export function HobbiesTile({ lang }: { lang: Lang }) {
  const t = ui[lang].tiles
  const h = hero[lang]
  return (
    <Tile>
      <TileLabel>{t.interests}</TileLabel>
      <Chips items={h.interests} accent />
      <TileLabel className="mt-3">{t.hobbies}</TileLabel>
      <Chips items={h.hobbies} accent={false} />
    </Tile>
  )
}
