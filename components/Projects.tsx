import Image from 'next/image'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {projectsData.map((project) => (
          <div
            key={project.name}
            className="bg-white rounded-[10px] p-[22px] flex flex-col group"
          >
            <div className="relative h-[148px] rounded-[7px] mb-4 overflow-hidden shrink-0 bg-[#f8f8f8]">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
              <a
                href={project.href}
                className="text-[12px] font-medium text-[#999] no-underline hover:text-[#1a1a1a] transition-colors duration-150"
              >
                ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
