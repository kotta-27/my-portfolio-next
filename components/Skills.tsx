'use client'

import { motion, type Variants } from 'framer-motion'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { skillsData } from '@/data/skills'
import { SectionLabel } from '@/components/SectionLabel'
import { Pill } from '@/components/Pill'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const pill: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export function Skills({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <div id="skills">
      <SectionLabel>{t.sections.skills}</SectionLabel>
      <div className="bg-white rounded-[10px] p-[26px] flex flex-col gap-[22px]">
        {skillsData.map((group) => (
          <div key={group.en}>
            <p className="text-[12px] tracking-[.1em] uppercase text-[#111] mb-[11px]">
              - {group[lang]}
            </p>
            <motion.div
              className="flex flex-wrap gap-[7px]"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {group.skills.map((s) => (
                <motion.div key={s.name} variants={pill}>
                  <Pill name={s.name} years={s.years} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
