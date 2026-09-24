import { PiArrowDownRight } from 'react-icons/pi'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

/** Section marker that opens the projects run inside the grid. */
export function ProjectsHeadTile({ lang, count }: { lang: Lang; count: number }) {
  const t = ui[lang]
  return (
    <Tile id="projects" tone="accent">
      <TileLabel className="text-white/65">{t.sections.projects}</TileLabel>
      <span className="absolute right-4 top-4 grid h-[30px] w-[30px] place-items-center rounded-full bg-white/15">
        <PiArrowDownRight className="text-[15px]" />
      </span>
      <p className="mt-auto text-[44px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">{count}</p>
      <p className="text-[11.5px] leading-[1.5] text-white/75">{t.tiles.projectsBlurb}</p>
    </Tile>
  )
}
