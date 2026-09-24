import Link from 'next/link'
import { PiArrowUpRight, PiMedalFill } from 'react-icons/pi'
import type { Lang } from '@/types'
import type { ProjectItem } from '@/data/projects'
import { Tile } from '@/components/Tile'

export function ProjectTile({ project, lang }: { project: ProjectItem; lang: Lang }) {
  return (
    <Tile pad={false} className="gap-0">
      <Link href={`/projects/${project.slug}?lang=${lang}`} className="group flex h-full flex-col no-underline">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {project.badge && (
            <span className="absolute left-[10px] top-[10px] inline-flex items-center gap-[3px] rounded-full bg-coral px-[8px] py-[3px] text-[10px] font-extrabold text-white">
              <PiMedalFill className="text-[11px]" />
              {project.badge}
            </span>
          )}
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 px-[14px] py-[10px]">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-extrabold text-ink">{project.name}</p>
            <p className="truncate text-[10.5px] font-semibold text-mute">{project.tags.join(' · ')}</p>
          </div>
          <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-soft text-mute transition-colors duration-200 group-hover:bg-ink group-hover:text-white">
            <PiArrowUpRight className="text-[13px]" />
          </span>
        </div>
      </Link>
    </Tile>
  )
}
