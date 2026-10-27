import Image from 'next/image'
import { PiArrowUpRight, PiMedalFill } from 'react-icons/pi'
import type { Lang } from '@/types'
import type { ProjectItem } from '@/data/projects'
import { Tile } from '@/components/Tile'
import { ArrowBadge } from '@/components/ArrowBadge'
import { ViewLink } from '@/components/ViewLink'

export function ProjectTile({ project, lang }: { project: ProjectItem; lang: Lang }) {
  return (
    <Tile pad={false} className="gap-0">
      <ViewLink href={`/projects/${project.slug}`} className="group flex h-full flex-col no-underline">
        {/* ブロック同士が横に密着するので、画像は縁まで敷かず内側に収めて隣と区切る */}
        <div className="relative mx-[10px] mt-[10px] aspect-[16/10] overflow-hidden rounded-[2px] bg-soft">
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="(min-width: 1100px) 260px, (min-width: 1024px) 24vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {project.badge && (
            <span className="absolute left-[10px] top-[10px] flat-tile inline-flex items-center gap-[3px] bg-coral px-[8px] py-[3px] text-[10px] font-extrabold text-paper">
              <PiMedalFill className="text-[11px]" />
              {project.badge[lang]}
            </span>
          )}
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 px-[14px] pb-[12px] pt-[10px]">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-extrabold text-ink">{project.name}</p>
            <p className="truncate text-[10.5px] font-semibold text-mute">{project.tags.join(' · ')}</p>
          </div>
          <ArrowBadge icon={PiArrowUpRight} size="sm" />
        </div>
      </ViewLink>
    </Tile>
  )
}
