'use client'

import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRANCH_TONE, type Branch } from '@/components/notes/worktree/branches'

/*
 * 小さなコミットグラフ。左が古く右が新しい。行がブランチの流れ。
 * 位置は列・行で指定し、座標はここで計算する（framer-motion の x/y で置くので位置の変化も動きになる）。
 */

const CX = 52
const CY = 40
const DOT = 12
const LINE = 2

type Point = [col: number, row: number]

export type GraphTip = {
  branch: Branch
  at: Point
  /** この先端を取り出している作業フォルダ（無ければ取り出されていない） */
  heads?: string[]
}

export type GraphProps = {
  cols: number
  rows: number
  commits: { id: string; at: Point; label?: string }[]
  /** 親 → 子。行が違うときは「親の列で縦に下り、子の行で横に進む」L 字で描く */
  edges: { from: Point; to: Point }[]
  tips: GraphTip[]
}

const cx = (col: number) => col * CX + CX / 2
const cy = (row: number) => row * CY + CY / 2

function Segment({ x, y, w, h, id }: { x: number; y: number; w: number; h: number; id: string }) {
  return (
    <motion.span
      key={id}
      className="absolute left-0 top-0 rounded-full bg-ink/25"
      initial={{ opacity: 0, x, y, width: 0, height: h }}
      animate={{ opacity: 1, x, y, width: w, height: h }}
      transition={{ duration: 0.35 }}
    />
  )
}

export function CommitGraph({ cols, rows, commits, edges, tips }: GraphProps) {
  return (
    // 狭い画面ではグラフだけ横にスクロールさせる（ページ全体ははみ出させない）
    <div className="max-w-full overflow-x-auto" aria-hidden>
      <div
        className="relative mx-auto h-[var(--gh)] w-[var(--gw)]"
        style={{ '--gw': `${cols * CX + 150}px`, '--gh': `${rows * CY}px` } as CSSProperties}
      >
        {edges.flatMap(({ from, to }) => {
          const id = `${from.join()}-${to.join()}`
          if (from[1] === to[1]) {
            return [<Segment key={id} id={id} x={cx(from[0])} y={cy(from[1]) - LINE / 2} w={cx(to[0]) - cx(from[0])} h={LINE} />]
          }
          return [
            <motion.span
              key={`${id}-v`}
              className="absolute left-0 top-0 rounded-full bg-ink/25"
              initial={{ opacity: 0, x: cx(from[0]) - LINE / 2, y: cy(from[1]), width: LINE, height: 0 }}
              animate={{ opacity: 1, x: cx(from[0]) - LINE / 2, y: cy(from[1]), width: LINE, height: cy(to[1]) - cy(from[1]) }}
              transition={{ duration: 0.3 }}
            />,
            <Segment key={`${id}-h`} id={`${id}-h`} x={cx(from[0])} y={cy(to[1]) - LINE / 2} w={cx(to[0]) - cx(from[0])} h={LINE} />,
          ]
        })}

        <AnimatePresence>
          {commits.map((c) => (
            <motion.span
              key={c.id}
              className="absolute left-0 top-0 grid h-[12px] w-[12px] place-items-center rounded-full border-2 border-ink/40 bg-tile"
              initial={{ opacity: 0, scale: 0.4, x: cx(c.at[0]) - DOT / 2, y: cy(c.at[1]) - DOT / 2 }}
              animate={{ opacity: 1, scale: 1, x: cx(c.at[0]) - DOT / 2, y: cy(c.at[1]) - DOT / 2 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            >
              {c.label && <span className="absolute top-[14px] whitespace-nowrap font-mono text-[9.5px] text-mute">{c.label}</span>}
            </motion.span>
          ))}
        </AnimatePresence>

        {tips.map((t) => {
          const tone = BRANCH_TONE[t.branch]
          const out = Boolean(t.heads?.length)
          return (
            <motion.span
              key={t.branch}
              className="absolute left-0 top-0 flex items-center gap-[6px]"
              initial={false}
              animate={{ x: cx(t.at[0]) - DOT / 2 - 3, y: cy(t.at[1]) - 9 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              {/* 先端のコミットをブランチの色で囲む */}
              <span className={`h-[18px] w-[18px] shrink-0 rounded-full border-[3px] ${tone.border} ${out ? '' : 'opacity-50'}`} />
              <span
                className={`whitespace-nowrap rounded-[5px] px-[6px] py-[1px] font-mono text-[10.5px] font-bold transition-colors duration-200 ${
                  out ? tone.fill : `bg-tile ${tone.text} border border-current`
                }`}
              >
                {t.branch}
                {out && <span className="font-normal opacity-80"> ← {t.heads?.join(', ')}</span>}
              </span>
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}
