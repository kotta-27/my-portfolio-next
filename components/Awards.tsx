import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { awardsData, qiitaArticles } from '@/data/awards'
import { SectionLabel } from '@/components/SectionLabel'

export function Awards({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <div id="awards" className="animate-fade-in-up [animation-delay:100ms]">
      <SectionLabel>{t.sections.awards}</SectionLabel>
      <div className="bg-white rounded-[10px] overflow-hidden">
        {awardsData.map((item) => (
          <div
            key={item.name}
            className="px-7 py-5 border-b border-[#f4f4f4] flex justify-between items-start"
          >
            <div>
              <p className="text-[13.5px] font-semibold text-[#1a1a1a] mb-[5px]">{item.name}</p>
              <p className="text-[12px] text-[#666]">{item.award[lang]}</p>
            </div>
            <span className="text-[11px] font-light text-[#999] shrink-0 pt-[2px]">
              {item.date}
            </span>
          </div>
        ))}
        <div className="px-7 py-5">
          <p className="text-[9px] tracking-[.1em] uppercase text-[#999] mb-[13px]">
            {t.qiitaLabel}
          </p>
          <div className="flex flex-col gap-2">
            {qiitaArticles.map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="text-[12.5px] leading-[1.5] text-[#444] no-underline hover:text-[#1a1a1a] transition-colors duration-150"
              >
                {article[lang]} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
