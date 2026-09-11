import Image from 'next/image'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { about } from '@/data/about'
import { SectionLabel } from '@/components/SectionLabel'

export function About({ lang }: { lang: Lang }) {
  const t = ui[lang]
  const a = about[lang]
  return (
    <div id="about" className="animate-fade-in-up [animation-delay:100ms]">
      <SectionLabel>{t.sections.about}</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="bg-white rounded-[10px] p-[26px] flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-[.1em] uppercase text-[#999] mb-[14px]">
              {a.currently}
            </p>
            <a
              href="https://studist.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[15px] font-semibold text-[#1a1a1a] mb-[7px] underline underline-offset-2 decoration-[#ccc] hover:decoration-[#1a1a1a] transition-colors duration-150"
            >
              {a.currentCompany}
            </a>
            <p className="text-[12.5px] leading-[1.65] text-[#555]">
              {a.currentRole}
              <br />
              {a.currentPeriod}
            </p>
          </div>
          <div className="relative w-[128px] h-[84px] shrink-0 md:pr-[100px]">
            <Image src="/studist.png" alt={a.currentCompany} fill className="object-contain" />
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
          <p className="text-[12.5px] leading-[1.65] text-[#555]">
            {a.labGroupPrefix}{' '}
            <a
              href="http://watabegroup.quie.ise.shibaura-it.ac.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1a1a] underline underline-offset-2 hover:text-[#555] transition-colors duration-150"
            >
              {a.labGroup}
            </a>
            {a.labGroupSuffix}
          </p>
        </div>
      </div>
    </div>
  )
}
