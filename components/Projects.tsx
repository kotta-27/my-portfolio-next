import Image from 'next/image'
import Link from 'next/link'
import { PiArrowUpRight } from 'react-icons/pi'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { projectsData } from '@/data/projects'
import { SectionLabel } from '@/components/SectionLabel'
import { Tag } from '@/components/Tag'

export function Projects({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <div id="projects" className="animate-fade-in-up [animation-delay:100ms]">
      <SectionLabel>{t.sections.projects}</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projectsData.map((project) => (
          <Link
            key={project.name}
            href={`/projects/${project.slug}?lang=${lang}`}
            className="bg-white rounded-[10px] px-[22px] py-[12px] flex flex-col group no-underline border border-transparent hover:border-[#ddd] hover:shadow-md transition-all duration-200"
          >
            <div className="h-[148px] sm:h-[228px] rounded-[7px] mb-4 shrink-0 bg-white flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.name}
                className="max-h-full max-w-full object-contain border border-[#e8e8e8] rounded-[4px]"
              />
            </div>
            <p className="text-[14px] font-semibold text-[#1a1a1a] mb-[7px]">{project.name}</p>
            <p className="text-[12.5px] font-light leading-[1.65] text-[#555] mb-auto">
              {project[lang]}
            </p>
            <div className="flex justify-between items-center mt-[14px]">
              <div className="flex gap-[5px] flex-wrap">
                {project.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <span className="flex items-center gap-[4px] text-[11px] font-medium tracking-[.05em] uppercase text-[#999] group-hover:text-[#1a1a1a] transition-colors duration-150">
                View <PiArrowUpRight className="text-[14px]" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
