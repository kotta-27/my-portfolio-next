'use client'

import { motion } from 'framer-motion'
import type { Lang } from '@/types'

export type LinkCardData = {
  url: string
  label: string
  source: string
  thumbnail?: string | null
}

type Props = {
  card: LinkCardData
  lang?: Lang
  mobileThumbnail?: boolean
}

export function LinkCard({ card, lang: _lang, mobileThumbnail = true }: Props) {
  return (
    <motion.a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="w-full flex items-center rounded-[10px] bg-soft overflow-hidden no-underline hover:bg-ground transition-colors duration-150 group"
    >
      {card.thumbnail && (
        <div className={`${mobileThumbnail ? 'block' : 'hidden sm:block'} w-[80px] h-[52px] shrink-0 bg-ground overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.thumbnail} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-[2px] px-[12px] py-[8px] min-w-0">
        <span className="text-[9.5px] font-bold tracking-[.07em] uppercase text-mute">{card.source}</span>
        <span className="text-[12px] font-semibold leading-[1.4] text-ink group-hover:text-teal transition-colors duration-150 line-clamp-2">
          {card.label}
        </span>
      </div>
      <span className="ml-auto pr-[14px] text-mute text-[13px] shrink-0 group-hover:text-ink transition-colors duration-150">
        ↗
      </span>
    </motion.a>
  )
}
