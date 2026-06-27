import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { SectionLabel } from '@/components/SectionLabel'
import { Tag } from '@/components/Tag'

export function About({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <div id="about" className="animate-fade-in-up [animation-delay:100ms]">
      <SectionLabel>{t.sections.about}</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-[10px] p-[26px]">
            <p className="text-[9px] tracking-[.1em] uppercase text-[#999] mb-[14px]">
              {t.currently}
            </p>
            <p className="text-[15px] font-semibold text-[#1a1a1a] mb-[7px]">
              {lang === 'ja' ? '株式会社スタディスト' : 'Studist Corporation'}
            </p>
            <p className="text-[12.5px] leading-[1.65] text-[#555] mb-[18px]">
              {t.currentRole}
              <br />
              {t.currentPeriod}
            </p>
            <div className="flex gap-[6px] flex-wrap">
              <Tag>Ruby on Rails</Tag>
              <Tag>Vue.js</Tag>
            </div>
          </div>
          <div className="bg-white rounded-[10px] p-[26px]">
            <p className="text-[9px] tracking-[.1em] uppercase text-[#999] mb-[14px]">
              {t.education}
            </p>
            <p className="text-[15px] font-semibold text-[#1a1a1a] mb-[7px]">
              {lang === 'ja' ? '芝浦工業大学大学院' : 'Shibaura Institute of Technology'}
            </p>
            <p className="text-[12.5px] leading-[1.65] text-[#555] mb-[18px]">
              {t.degree}
              <br />
              {t.research}
            </p>
            <Tag>{lang === 'ja' ? '渡部研究室' : 'Watabe Group'}</Tag>
          </div>
      </div>
    </div>
  )
}
