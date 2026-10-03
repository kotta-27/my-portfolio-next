'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LinkCard, type LinkCardData } from '@/components/LinkCard'

/** LinkCard that also reveals a large thumbnail + title card on hover / focus. */
export function PreviewLink({ card }: { card: LinkCardData }) {
  const [open, setOpen] = useState(false)
  const [below, setBelow] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // 画面上部（固定ナビの近く）では上に出すと隠れるので、下に出す
  function show() {
    const top = ref.current?.getBoundingClientRect().top ?? 0
    setBelow(top < 320)
    setOpen(true)
  }

  return (
    <span
      ref={ref}
      className="relative block"
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={show}
      onBlur={() => setOpen(false)}
    >
      <LinkCard card={card} mobileThumbnail={false} />

      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            className={`pointer-events-none absolute left-0 z-50 block w-[300px] ${below ? 'top-full mt-2' : 'bottom-full mb-2'} max-w-[calc(100vw-48px)] overflow-hidden rounded-[14px] border border-ink/15 bg-tile shadow-[0_24px_48px_-16px_rgba(13,27,42,0.35)]`}
            initial={{ opacity: 0, y: below ? -6 : 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: below ? -6 : 6, scale: 0.98 }}
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
