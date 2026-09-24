import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { about } from '@/data/about'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

export function EducationTile({ lang }: { lang: Lang }) {
  const t = ui[lang].tiles
  const a = about[lang]
  return (
    <Tile>
      <TileLabel>{t.education}</TileLabel>
      <div className="mt-auto">
        <p className="text-[13.5px] font-extrabold leading-tight">{a.university}</p>
        <p className="mt-[3px] text-[11.5px] leading-[1.45] text-mute">
          {a.degree}
          <br />
          {a.research}
        </p>
        <p className="mt-[6px] text-[11px] text-mute">
          {a.labGroupPrefix}{' '}
          <a
            href="http://watabegroup.quie.ise.shibaura-it.ac.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-ink underline decoration-ground underline-offset-2 hover:text-teal transition-colors duration-150"
          >
            {a.labGroup}
          </a>
          {a.labGroupSuffix}
        </p>
      </div>
    </Tile>
  )
}
