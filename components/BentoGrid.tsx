'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion, type Transition, type Variants } from 'framer-motion'
import type { View } from '@/types'
import { useView } from '@/components/ViewContext'
import { Tile } from '@/components/Tile'
import { colSpan, gridClass, gridClassOrdered, rowSpan, type Rows, type Span } from '@/components/gridSpans'

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
  /** 区切り帯など、ホバーで持ち上げない要素 */
  static?: boolean
  node: ReactNode
}

type Props = {
  items: BentoItemDef[]
  labels: { more: string; less: string }
}

const spring: Transition = { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }

/** View changes after the first load animate tiles in/out with framer. */
const tileVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
  exit: { opacity: 0, scale: 0.94, transition: spring },
}
/** 初回の CSS スタッガーが終わるまでの時間（最大遅延 + 長さ + イントロ分の余裕） */
const BOOT_MS = 2000
/** スタッガーの段数の上限（下の方のタイルを待たせすぎない） */
const MAX_STAGGER = 14

export function BentoGrid({ items, labels }: Props) {
  const { view } = useView()
  const [expanded, setExpanded] = useState(false)
  // 初回はサーバー描画のまま表示し、登場は CSS（.tile-enter）に任せる。
  // それが終わったら、以降の表示切替で入ってくるタイルは framer で登場させる。
  const [booted, setBooted] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setBooted(true), BOOT_MS)
    return () => clearTimeout(id)
  }, [])
  const enter = (i: number) => ({
    // 先頭（ヒーロー）は LCP を遅らせないよう、フェードなしで着地させる
    className: `flex w-full ${booted ? '' : `tile-enter ${i === 0 ? 'tile-enter-solid' : ''}`}`,
    style: { '--i': Math.min(i, MAX_STAGGER) } as CSSProperties,
  })

  const inView = items.filter((item) => item.views.includes(view))
  const overflowCount = view === 'all' ? inView.filter((item) => item.overflow).length : 0
  const visible = inView.filter((item) => view !== 'all' || expanded || !item.overflow)

  return (
    <motion.div layout className={view === 'writing' ? gridClassOrdered : gridClass}>
      <AnimatePresence mode="popLayout">
        {visible.map((item, i) => (
          <motion.div
            key={item.key}
            layout
            className={`${item.mobileFull ? 'col-span-2 lg:col-span-1' : colSpan[item.span ?? 1]} ${rowSpan[item.rows ?? 1]} flex`}
            variants={tileVariants}
            initial={booted ? 'hidden' : false}
            animate="show"
            exit="exit"
            whileHover={item.static ? undefined : { y: -2 }}
            transition={spring}
          >
            <div {...enter(i)}>{item.node}</div>
          </motion.div>
        ))}

        {overflowCount > 0 && (
          <motion.div
            key="more"
            layout
            className="col-span-1 row-span-1 flex"
            variants={tileVariants}
            initial={booted ? 'hidden' : false}
            animate="show"
            exit="exit"
            transition={spring}
          >
            <div {...enter(visible.length)}>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
