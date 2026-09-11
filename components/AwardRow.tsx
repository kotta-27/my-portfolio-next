'use client'

import { motion } from 'framer-motion'
import { PiMedalFill } from 'react-icons/pi'
import type { Lang } from '@/types'
import { categoryLabel, type ActivityItem, type SubLinkCard } from '@/data/awards'
import { LinkCard } from '@/components/LinkCard'

function toCard(card: SubLinkCard, source: string, lang: Lang) {
  return { url: card.url, label: card[lang], source, thumbnail: card.thumbnail }
}

export function AwardRow({ item, lang, index }: { item: ActivityItem; lang: Lang; index: number }) {
  return (
    <motion.div
      className="relative pl-5 pr-[5px] py-[18px] border-b border-[#f4f4f4]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: Math.min(index, 6) * 0.04 }}
    >
      <div className="absolute top-[16px] right-[18px] rotate-[5deg]">
        <div className="relative bg-[#fff8de] text-[#8a7020] text-[10.5px] font-medium leading-[1.4] px-[11px] py-[5px] rounded-[2px] shadow-[0_3px_6px_rgba(0,0,0,0.14)] max-w-[72px] sm:max-w-none sm:whitespace-nowrap text-center">
          {item.date}
        </div>
      </div>
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
    </motion.div>
  )
}
