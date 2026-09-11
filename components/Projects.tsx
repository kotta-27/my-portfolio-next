'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { PiArrowUpRight, PiMedalFill } from 'react-icons/pi'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { projectsData } from '@/data/projects'
import { SectionLabel } from '@/components/SectionLabel'
import { Tag } from '@/components/Tag'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const card: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export function Projects({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <div id="projects">
      <SectionLabel>{t.sections.projects}</SectionLabel>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {projectsData.map((project) => (
          <motion.div
            key={project.name}
            variants={card}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link
              href={`/projects/${project.slug}?lang=${lang}`}
              className="bg-white rounded-2xl p-4 flex flex-col h-full group no-underline border border-[#ececec] shadow-[0_1px_2px_rgba(0,0,0,.04)] hover:shadow-[0_16px_32px_rgba(0,0,0,.08)] hover:border-[#ddd] transition-shadow duration-300"
            >
              <div className="relative aspect-[16/9] rounded-xl mb-3 shrink-0 bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] flex items-center justify-center overflow-hidden p-4">
                {project.badge && (
                  <motion.span
                    whileHover={{ rotate: [0, -6, 6, -3, 0] }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-3 left-3 flex items-center gap-[4px] text-[9.5px] font-semibold tracking-[.04em] bg-white/90 backdrop-blur-sm text-amber-700 rounded-full px-[10px] py-[5px] shadow-sm z-10"
                  >
                    <PiMedalFill className="text-[12px]" />
                    {project.badge}
                  </motion.span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.name}
                  className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>

              <p className="text-[14px] font-semibold tracking-[-0.01em] text-[#1a1a1a] mb-[4px]">
                {project.name}
              </p>
              <p className="text-[12px] font-light leading-[1.55] text-[#666] mb-auto line-clamp-1">
                {project[lang]}
              </p>

              <div className="flex justify-between items-center mt-3 pt-[10px] border-t border-[#f0f0f0]">
                <div className="flex gap-[5px] flex-wrap">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <span className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-[#f5f5f5] text-[#888] shrink-0 ml-2 transition-colors duration-200 group-hover:bg-[#1a1a1a] group-hover:text-white">
                  <PiArrowUpRight className="text-[14px] transition-transform duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
