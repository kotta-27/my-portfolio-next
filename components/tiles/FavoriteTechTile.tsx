import type { IconType } from 'react-icons'
import { SiOpensearch, SiThreedotjs, SiVuedotjs } from 'react-icons/si'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { favoriteTech, type FavoriteTech } from '@/data/favoriteTech'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Pill } from '@/components/Pill'

const ICONS: Record<FavoriteTech['icon'], IconType> = {
  vue: SiVuedotjs,
  three: SiThreedotjs,
  search: SiOpensearch,
}

/** 経験年数の一覧ではなく、好きで追いかけている技術を 3 つ並べる */
export function FavoriteTechTile({ lang }: { lang: Lang }) {
  const t = ui[lang].tiles
  return (
    <Tile id="favorite-tech">
      <TileLabel>{t.favoriteTech}</TileLabel>
      <ul className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {favoriteTech.map((tech) => {
          const Icon = ICONS[tech.icon]
          return (
            <li key={tech.icon} className="flex flex-col gap-[6px] rounded-[12px] bg-soft p-4">
              <div className="flex items-center gap-[10px]">
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] bg-tile text-teal">
                  <Icon className="text-[17px]" />
                </span>
                <p className="text-[16px] font-extrabold tracking-[-0.01em]">{typeof tech.name === 'string' ? tech.name : tech.name[lang]}</p>
              </div>
              <p className="text-[12px] leading-[1.6] text-mute">{tech.note[lang]}</p>
              <div className="mt-auto flex flex-wrap gap-[5px] pt-1">
                {tech.tags.map((tag) => (
                  <Pill key={tag} className="bg-tile">{tag}</Pill>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </Tile>
  )
}
