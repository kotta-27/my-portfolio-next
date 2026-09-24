'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, type Transition, type Variants } from 'framer-motion'
import type { View } from '@/types'
import { useView } from '@/components/ViewContext'
import { Tile } from '@/components/Tile'
import { colSpan, gridClass, rowSpan, type Rows, type Span } from '@/components/gridSpans'

export type BentoItemDef = {
  key: string
  /** Every view in which this tile is shown ('all' is the overview). */
  views: View[]
  span?: Span
  rows?: Rows
  /** Below lg the tile takes the full (2-column) row instead of one column. */
  mobileFull?: boolean
  /** Hidden in the overview until "more" is pressed. */
  overflow?: boolean
  node: ReactNode
}

type Props = {
  items: BentoItemDef[]
  labels: { more: string; less: string }
}

const spring: Transition = { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }

/** First paint staggers tiles in after the intro; later view changes animate without delay. */
const tileVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: (delay: number) => ({ opacity: 1, y: 0, scale: 1, transition: { ...spring, delay } }),
  exit: { opacity: 0, scale: 0.94, transition: spring },
}
const STAGGER_S = 0.045

export function BentoGrid({ items, labels }: Props) {
  const { view, introDone } = useView()
  const [expanded, setExpanded] = useState(false)
  const [booted, setBooted] = useState(false)

  // Once the first staggered reveal has played, later entrances are immediate.
  useEffect(() => {
    if (!introDone) return
    const id = setTimeout(() => setBooted(true), 1200)
    return () => clearTimeout(id)
  }, [introDone])

  const inView = items.filter((item) => item.views.includes(view))
  const overflowCount = view === 'all' ? inView.filter((item) => item.overflow).length : 0
  const visible = inView.filter((item) => view !== 'all' || expanded || !item.overflow)

  return (
    <motion.div layout className={gridClass}>
      <AnimatePresence mode="popLayout">
        {visible.map((item, i) => (
          <motion.div
            key={item.key}
            layout
            className={`${item.mobileFull ? 'col-span-2 lg:col-span-1' : colSpan[item.span ?? 1]} ${rowSpan[item.rows ?? 1]} flex`}
            variants={tileVariants}
            custom={booted ? 0 : i * STAGGER_S}
            initial="hidden"
            animate={introDone ? 'show' : 'hidden'}
            exit="exit"
            whileHover={{ y: -2 }}
            transition={spring}
          >
            {item.node}
          </motion.div>
        ))}

        {overflowCount > 0 && (
          <motion.div
            key="more"
            layout
            className="col-span-1 row-span-1 flex"
            variants={tileVariants}
            custom={booted ? 0 : visible.length * STAGGER_S}
            initial="hidden"
            animate={introDone ? 'show' : 'hidden'}
            exit="exit"
            transition={spring}
          >
            <Tile pad={false}>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex h-full w-full flex-col items-center justify-center gap-[2px] p-4 text-ink transition-colors duration-150 hover:bg-soft"
              >
                <span className="text-[30px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
                  {expanded ? '−' : `+${overflowCount}`}
                </span>
                <span className="text-[11.5px] font-bold text-mute">{expanded ? labels.less : labels.more}</span>
              </button>
            </Tile>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
