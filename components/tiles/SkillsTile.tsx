import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { skillsData } from '@/data/skills'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

const MAX_YEARS = 4

const barWidth: Record<number, string> = {
  0: 'w-0',
  1: 'w-1/4',
  2: 'w-2/4',
  3: 'w-3/4',
  4: 'w-full',
}

function parseYears(years: string): number | null {
  const match = years.match(/(\d+)/)
  return match ? Math.min(Number(match[1]), MAX_YEARS) : null
}

export function SkillsTile({ lang }: { lang: Lang }) {
  const t = ui[lang].tiles
  return (
    <Tile id="skills">
      <TileLabel>{t.skillsYears}</TileLabel>
      <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillsData.map((group) => (
          <div key={group.en}>
            <p className="mb-[6px] text-[11.5px] font-extrabold">{group[lang]}</p>
            <ul className="flex flex-col gap-[7px]">
              {group.skills.map((skill) => {
                const years = parseYears(skill.years)
                return (
                  <li
                    key={skill.name}
                    className="grid grid-cols-[104px_1fr_28px] items-center gap-2 text-[12px] font-semibold"
                  >
                    <span className="truncate">{skill.name}</span>
                    <span className="relative h-[6px] overflow-hidden rounded-full bg-soft">
                      {years !== null && (
                        <span className={`absolute inset-y-0 left-0 rounded-full bg-teal ${barWidth[years]}`} />
                      )}
                    </span>
                    <span className="text-right font-mono text-[11px] text-mute tabular-nums">
                      {skill.years || '—'}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </Tile>
  )
}
