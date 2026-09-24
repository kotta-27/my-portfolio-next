'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LinkCard, type LinkCardData } from '@/components/LinkCard'

/** LinkCard that also reveals a large thumbnail + title card on hover / focus. */
export function PreviewLink({ card }: { card: LinkCardData }) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <LinkCard card={card} mobileThumbnail={false} />

      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 block w-[300px] max-w-[calc(100vw-48px)] overflow-hidden rounded-[14px] bg-tile shadow-[0_24px_48px_-16px_rgba(13,27,42,0.35)] ring-1 ring-ink/5"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {card.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.thumbnail} alt="" className="aspect-[1200/630] w-full object-cover" />
            )}
            <span className="block p-3">
              <span className="text-[9.5px] font-extrabold uppercase tracking-[.06em] text-mute">{card.source}</span>
              <span className="mt-[3px] block text-[13px] font-bold leading-[1.45] text-ink">{card.label}</span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
