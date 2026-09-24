import Link from 'next/link'
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi'
import type { Lang } from '@/types'
import type { ProjectItem } from '@/data/projects'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

type Props = {
  project: ProjectItem
  lang: Lang
  direction: 'prev' | 'next'
  label: string
}

export function ProjectNeighborTile({ project, lang, direction, label }: Props) {
  const Arrow = direction === 'prev' ? PiArrowLeft : PiArrowRight
  return (
    <Tile pad={false}>
      <Link
        href={`/projects/${project.slug}?lang=${lang}`}
        className={`group flex h-full min-h-[120px] items-stretch no-underline ${direction === 'prev' ? 'flex-row' : 'flex-row-reverse'}`}
      >
        <div className="relative w-[38%] shrink-0 overflow-hidden bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </div>
        <div className={`flex flex-1 flex-col justify-between gap-2 p-4 ${direction === 'prev' ? 'items-start' : 'items-end text-right'}`}>
          <TileLabel>{label}</TileLabel>
          <div>
            <p className="text-[15px] font-extrabold leading-tight text-ink">{project.name}</p>
            <p className="mt-[3px] line-clamp-2 text-[11.5px] leading-[1.5] text-mute">{project[lang]}</p>
          </div>
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-soft text-mute transition-colors duration-200 group-hover:bg-ink group-hover:text-white">
            <Arrow className="text-[14px]" />
          </span>
        </div>
      </Link>
    </Tile>
  )
}
