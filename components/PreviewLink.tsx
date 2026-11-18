'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { LinkCard, type LinkCardData } from '@/components/LinkCard'
import { Thumb } from '@/components/Thumb'

const CARD_W = 300
const GAP = 8
const EDGE = 24

type Place = { x: number; y: number; w: number; below: boolean }

/** LinkCard that also reveals a large thumbnail + title card on hover / focus. */
export function PreviewLink({ card }: { card: LinkCardData }) {
  const [place, setPlace] = useState<Place | null>(null)
  const ref = useRef<HTMLSpanElement>(null)
  const pop = useRef<HTMLSpanElement>(null)

  // ブロックは上の段ほど手前に重ねているので、z-index では上の段に隠れる。
  // popover で top layer に出し、位置はリンクの座標から fixed で置く
  function show() {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const w = Math.min(CARD_W, window.innerWidth - EDGE * 2)
    // 画面上部（固定ナビの近く）では上に出すと隠れるので、下に出す
    const below = r.top < 320
    setPlace({ x: Math.max(EDGE, Math.min(r.left, window.innerWidth - w - EDGE)), y: below ? r.bottom + GAP : r.top - GAP, w, below })
    pop.current?.showPopover()
  }

  function hide() {
    pop.current?.hidePopover()
    setPlace(null)
  }

  // fixed で置いているので、スクロールしたら位置がずれる前に閉じる
  useEffect(() => {
    if (!place) return
    window.addEventListener('scroll', hide, { passive: true })
    return () => window.removeEventListener('scroll', hide)
  }, [place])

  return (
    <span ref={ref} className="relative block" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <LinkCard card={card} mobileThumbnail={false} />

      <span
        ref={pop}
        popover="manual"
        role="tooltip"
        className={`pointer-events-none fixed inset-auto left-[var(--px)] top-[var(--py)] m-0 w-[var(--pw)] overflow-visible border-0 bg-transparent p-0 ${place?.below ? '' : '-translate-y-full'}`}
        style={place ? ({ '--px': `${place.x}px`, '--py': `${place.y}px`, '--pw': `${place.w}px` } as CSSProperties) : undefined}
      >
        {place && (
          <motion.span
            className="block overflow-hidden rounded-[14px] border border-ink/15 bg-tile shadow-[0_24px_48px_-16px_rgba(13,27,42,0.35)]"
            initial={{ opacity: 0, y: place.below ? -6 : 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {card.thumbnail && (
              <span className="relative block aspect-[1200/630] w-full bg-soft">
                <Thumb src={card.thumbnail} alt="" sizes="300px" className="object-cover" />
              </span>
            )}
            <span className="block p-3">
              <span className="text-[9.5px] font-extrabold uppercase tracking-[.06em] text-mute">{card.source}</span>
              <span className="mt-[3px] block text-[13px] font-bold leading-[1.45] text-ink">{card.label}</span>
            </span>
          </motion.span>
        )}
      </span>
    </span>
  )
}
