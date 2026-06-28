import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { about } from '@/data/about'
import { SectionLabel } from '@/components/SectionLabel'
import { Tag } from '@/components/Tag'

export function About({ lang }: { lang: Lang }) {
  const t = ui[lang]
  const a = about[lang]
  return (
    <div id="about" className="animate-fade-in-up [animation-delay:100ms]">
      <SectionLabel>{t.sections.about}</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="bg-white rounded-[10px] p-[26px]">
          <p className="text-[9px] tracking-[.1em] uppercase text-[#999] mb-[14px]">
            {a.currently}
          </p>
          <p className="text-[15px] font-semibold text-[#1a1a1a] mb-[7px]">{a.currentCompany}</p>
          <p className="text-[12.5px] leading-[1.65] text-[#555] mb-[18px]">
            {a.currentRole}
            <br />
            {a.currentPeriod}
          </p>
          <div className="flex gap-[6px] flex-wrap">
            <Tag>Ruby on Rails</Tag>
            <Tag>Vue.js</Tag>
          </div>
        </div>
        <div className="bg-white rounded-[10px] p-[26px]">
          <p className="text-[9px] tracking-[.1em] uppercase text-[#999] mb-[14px]">
            {a.education}
          </p>
          <p className="text-[15px] font-semibold text-[#1a1a1a] mb-[7px]">{a.university}</p>
          <p className="text-[12.5px] leading-[1.65] text-[#555] mb-[18px]">
            {a.degree}
            <br />
            {a.research}
          </p>
          <Tag>{a.labGroup}</Tag>
        </div>
      </div>
    </div>
  )
}
