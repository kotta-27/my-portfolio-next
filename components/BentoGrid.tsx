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
/** 上から押し下げられて、少し行き過ぎてはまる */
const snap: Transition = { type: 'spring', stiffness: 620, damping: 26, mass: 0.7 }

/** View changes after the first load animate tiles in/out with framer: 少し浮いて現れ、下の段へはめ込む／外す */
const tileVariants: Variants = {
  hidden: { opacity: 0, y: -14 },
  show: { opacity: 1, y: 0, transition: snap },
  exit: { opacity: 0, y: -14, scale: 0.97, transition: spring },
}
/** 初回の CSS スタッガーが終わるまでの時間（最大遅延 + 長さ + イントロ分の余裕） */
const BOOT_MS = 2600
/** 順に現れるタイル数の上限（下の方のタイルを待たせすぎない） */
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
  const inView = items.filter((item) => item.views.includes(view))
  const overflowCount = view === 'all' ? inView.filter((item) => item.overflow).length : 0
  const visible = inView.filter((item) => view !== 'all' || expanded || !item.overflow)

  // 展開時は「閉じる」タイルを最後の追加プロジェクトの直後に置く。末尾のままだと余った
  // プロジェクトが背の高い Awards と同じ行に入り、行の高さまで引き伸ばされるため
  const lastOverflow = visible.findLastIndex((item) => item.overflow)
  const togglePos = expanded && lastOverflow >= 0 ? lastOverflow + 1 : visible.length

  // 初回の組み上げ: 段ごとに浮かせて隙間を開けたまま順に現れ、出揃ったら一斉に下りてはまる（浮かせ量は AssembleScript が描画前に付ける）
  const enter = (i: number) => ({
    // 先頭（ヒーロー）は LCP を遅らせないよう、フェードなしで現れる
    className: `flex w-full ${booted ? '' : `tile-enter ${i === 0 ? 'tile-enter-solid' : ''}`}`,
    style: { '--i': Math.min(i, MAX_STAGGER) } as CSSProperties,
  })

  const renderItem = (item: BentoItemDef, i: number) => (
    <motion.div
      key={item.key}
      layout
      className={`${item.mobileFull ? 'col-span-2 lg:col-span-1' : colSpan[item.span ?? 1]} ${rowSpan[item.rows ?? 1]} relative flex ${item.static ? '' : 'brick-host'}`}
      // 上の段ほど手前に置き、下の段のスタッドを上のブロックの底に隠す（はまって見える）
      style={{ zIndex: items.length + 1 - i }}
      variants={tileVariants}
      initial={booted ? 'hidden' : false}
      animate="show"
      exit="exit"
      transition={spring}
    >
      {/* AssembleScript がハイドレーション前に --rise などを書き込むので、style の差分は許容する */}
      <div {...enter(i)} suppressHydrationWarning>
        {item.node}
      </div>
    </motion.div>
  )

  return (
    <motion.div layout className={view === 'writing' ? gridClassOrdered : gridClass}>
      <AnimatePresence mode="popLayout">
        {visible.slice(0, togglePos).map((item, i) => renderItem(item, i))}

        {overflowCount > 0 && (
          <motion.div
            key="more"
            layout
            className="brick-host relative col-span-1 row-span-1 flex"
            style={{ zIndex: items.length + 1 - togglePos }}
            variants={tileVariants}
            initial={booted ? 'hidden' : false}
            animate="show"
            exit="exit"
            transition={spring}
          >
            <div {...enter(togglePos)} suppressHydrationWarning>
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

        {visible.slice(togglePos).map((item, i) => renderItem(item, togglePos + 1 + i))}
      </AnimatePresence>
    </motion.div>
  )
}
