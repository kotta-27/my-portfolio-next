import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { activitiesData, categoryLabel, qiitaArticles, type SubLinkCard } from '@/data/awards'
import { SectionLabel } from '@/components/SectionLabel'
import { LinkCard } from '@/components/LinkCard'
import { PiMedalFill } from 'react-icons/pi'

function toCard(card: SubLinkCard, source: string, lang: Lang) {
  return { url: card.url, label: card[lang], source, thumbnail: card.thumbnail }
}

export function Awards({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <div id="awards" className="animate-fade-in-up [animation-delay:100ms]">
      <SectionLabel>{t.sections.awards}</SectionLabel>
      <div className="bg-white rounded-[10px] overflow-hidden">
        {activitiesData.map((item) => (
          <div key={item.en} className="relative pl-5 pr-[5px] py-[18px] border-b border-[#f4f4f4]">
            <span className="absolute top-[18px] right-[15px] text-[11px] font-light text-[#999] text-right w-[64px] sm:w-auto sm:whitespace-nowrap">
              {item.date}
            </span>
            <div className="flex items-start gap-3 pr-[70px]">
              <span className="mt-[3px] shrink-0 w-[72px] text-center text-[9px] tracking-[.08em] uppercase text-[#222] bg-[#f4f4f4] rounded px-[7px] py-[3px] whitespace-nowrap">
                {categoryLabel[item.category][lang]}
              </span>
              <div className="flex-1 min-w-0">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-medium text-[#1a1a1a] underline underline-offset-2 decoration-[#ccc] hover:decoration-[#1a1a1a] transition-colors duration-150 leading-[1.5] block"
                  >
                    {item[lang]}
                  </a>
                ) : (
                  <p className="text-[13px] font-medium text-[#1a1a1a] leading-[1.5]">{item[lang]}</p>
                )}
                {item.award && (
                  <p className="flex items-center gap-[5px] text-[11.5px] text-[#b07800] mt-[4px]">
                    <PiMedalFill className="text-[13px] shrink-0" />
                    {item.award[lang]}
                  </p>
                )}
                {item.interview && (
                  <div className="mt-[8px]">
                    <LinkCard card={toCard(item.interview, 'Interview', lang)} mobileThumbnail={false} />
                  </div>
                )}
                {item.pressRelease && (
                  <div className="mt-[8px]">
                    <LinkCard card={toCard(item.pressRelease, 'Press Release', lang)} mobileThumbnail={false} />
                  </div>
                )}
                {item.page && (
                  <div className="mt-[8px]">
                    <LinkCard card={toCard(item.page, 'Page', lang)} mobileThumbnail={false} />
                  </div>
                )}
              </div>
            </div>
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
                target="_blank"
                rel="noopener noreferrer"
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
