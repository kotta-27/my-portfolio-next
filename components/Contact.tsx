import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { SectionLabel } from '@/components/SectionLabel'

export function Contact({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <div id="contact" className="animate-fade-in-up [animation-delay:100ms]">
      <div className="bg-[#1a1a1a] rounded-xl p-12">
        <p className="text-[10px] tracking-[.1em] uppercase text-[#555] mb-4">
          {t.sections.contact}
        </p>
        <p className="text-[34px] font-bold tracking-[-0.025em] text-white mb-[14px]">
          {t.contactTitle}
        </p>
        <p className="font-light text-[14.5px] leading-[1.75] text-[#777] mb-8 max-w-[500px]">
          {t.contactBody}
        </p>
        <div className="flex gap-[10px] flex-wrap">
          <a
            href="mailto:mizukou27@gmail.com"
            className="text-[10.5px] font-medium tracking-[.05em] uppercase text-white no-underline bg-white/10 border border-white/[.15] rounded-md px-5 py-3 hover:bg-white/20 transition-colors duration-150"
          >
            mizukou27@gmail.com
          </a>
          <a
            href="https://x.com/Melmol_27"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[7px] text-[10.5px] font-medium tracking-[.05em] uppercase text-[#555] no-underline border border-[#2e2e2e] rounded-md px-5 py-3 hover:text-[#888] transition-colors duration-150"
          >
            <FaXTwitter className="text-[14px]" />
            @Melmol_27
          </a>
          <a
            href="https://github.com/kotta-27"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[7px] text-[10.5px] font-medium tracking-[.05em] uppercase text-[#555] no-underline border border-[#2e2e2e] rounded-md px-5 py-3 hover:text-[#888] transition-colors duration-150"
          >
            <FaGithub className="text-[15px]" />
            GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
