import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { skillsData } from '@/data/skills'
import { SectionLabel } from '@/components/SectionLabel'
import { Pill } from '@/components/Pill'

export function Skills({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <div id="skills" className="animate-fade-in-up [animation-delay:100ms]">
      <SectionLabel>{t.sections.skills}</SectionLabel>
      <div className="bg-white rounded-[10px] p-[26px] flex flex-col gap-[22px]">
        {skillsData.map((group) => (
          <div key={group.en}>
            <p className="text-[12px] tracking-[.1em] uppercase text-[#111] mb-[11px]">
              - {group[lang]}
            </p>
            <div className="flex flex-wrap gap-[7px]">
              {group.skills.map((s) => (
                <Pill key={s.name} name={s.name} years={s.years} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
