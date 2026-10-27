'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PiArrowDownBold, PiFileTextBold, PiFolderSimpleFill } from 'react-icons/pi'
import { FigButton, FigureFrame } from '@/components/notes/FigureFrame'
import { CommitGraph, type GraphProps } from '@/components/notes/worktree/CommitGraph'
import { BRANCH_TONE, type Branch } from '@/components/notes/worktree/branches'

type Mode = 'single' | 'switch' | 'worktree'

/** ブランチごとの中身。作業ツリーには、HEAD が指すブランチの先端のファイルが並ぶ */
const FILES: Record<Branch, { name: string; mark?: string }[]> = {
  main: [{ name: 'index.ts' }, { name: 'app.ts' }, { name: 'README.md' }],
  feature: [{ name: 'index.ts' }, { name: 'app.ts' }, { name: 'search.ts', mark: '追加' }, { name: 'README.md' }],
  hotfix: [{ name: 'index.ts' }, { name: 'app.ts', mark: '修正' }, { name: 'README.md' }],
}

const MODES: { id: Mode; label: string; trees: { folder: string; branch: Branch }[]; note: string }[] = [
  {
    id: 'single',
    label: 'ふつうの状態',
    trees: [{ folder: 'app', branch: 'main' }],
    note: 'リポジトリ（.git）は全部のブランチの履歴を持っている。作業フォルダに出ているのは、そのうち HEAD が指す 1 本（main）の中身だけ。',
  },
  {
    id: 'switch',
    label: 'switch すると',
    trees: [{ folder: 'app', branch: 'feature' }],
    note: 'switch は HEAD を feature に付け替えて、同じフォルダの中身を feature の状態に書き換える。作業フォルダは 1 つのまま。',
  },
  {
    id: 'worktree',
    label: 'worktree を使うと',
    trees: [
      { folder: 'app', branch: 'main' },
      { folder: 'app-feature', branch: 'feature' },
      { folder: 'app-hotfix', branch: 'hotfix' },
    ],
    note: 'worktree は作業フォルダを増やし、それぞれに HEAD を持たせる。リポジトリは 1 つのまま、3 本のブランチを同時に開いておける。',
  },
]

// main: c1-c2-c3 / feature: c2 から分岐 / hotfix: c3 から分岐
const GRAPH: Omit<GraphProps, 'tips'> = {
  cols: 5,
  rows: 3,
  commits: [
    { id: 'c1', at: [0, 0] },
    { id: 'c2', at: [1, 0] },
    { id: 'c3', at: [2, 0] },
    { id: 'h1', at: [3, 1] },
    { id: 'f1', at: [2, 2] },
    { id: 'f2', at: [3, 2] },
  ],
  // 線が交わらないよう、新しい分岐（hotfix）を上の行に置く
  edges: [
    { from: [0, 0], to: [2, 0] },
    { from: [2, 0], to: [3, 1] },
    { from: [1, 0], to: [3, 2] },
  ],
}
const TIPS: { branch: Branch; at: [number, number] }[] = [
  { branch: 'main', at: [2, 0] },
  { branch: 'hotfix', at: [3, 1] },
  { branch: 'feature', at: [3, 2] },
]

export function RepoModel() {
  const [mode, setMode] = useState<Mode>('single')
  const current = MODES.find((m) => m.id === mode) as (typeof MODES)[number]
  const tips = TIPS.map((t) => ({ ...t, heads: current.trees.filter((tr) => tr.branch === t.branch).map((tr) => `${tr.folder}/`) }))

  return (
    <FigureFrame className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="状態">
        {MODES.map((m) => (
          <FigButton key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
            {m.label}
          </FigButton>
        ))}
      </div>

      {/* 上の層: 作業ツリー */}
      <div className="flex flex-col gap-3">
        <LayerLabel title="作業ツリー" text="ファイルを開いて編集する場所（ただのフォルダ）" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {current.trees.map((t) => {
              const tone = BRANCH_TONE[t.branch]
              return (
                <motion.div
                  key={t.folder}
                  layout
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className={`flex min-w-0 flex-col gap-3 rounded-[10px] border-2 bg-tile p-3 transition-colors duration-300 ${tone.border}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-[6px] font-mono text-[12.5px] font-bold">
                      <PiFolderSimpleFill className="shrink-0 text-[14px] text-mute" />
                      <span className="truncate">{t.folder}/</span>
                    </span>
                    <span className={`shrink-0 rounded-[5px] px-[6px] py-[1px] font-mono text-[10.5px] font-bold transition-colors duration-300 ${tone.fill}`}>
                      HEAD → {t.branch}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-[3px]">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {FILES[t.branch].map((f) => (
                        <motion.li
                          key={`${t.branch}-${f.name}`}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.22 }}
                          className="flex items-center gap-[6px] font-mono text-[11.5px] text-ink/75"
                        >
                          <PiFileTextBold className="shrink-0 text-[12px] text-mute" />
                          {f.name}
                          {f.mark && <span className={`text-[10px] font-bold ${tone.text}`}>{f.mark}</span>}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11.5px] font-bold text-mute">
        <PiArrowDownBold className="rotate-180" />
        HEAD が指すブランチの中身を取り出している
      </div>

      {/* 下の層: リポジトリ */}
      <div className="flex flex-col gap-3 rounded-[10px] border border-ink/10 bg-tile p-4">
        <LayerLabel title="リポジトリ（.git）" text="全部のコミットとブランチを持っている。いつでも 1 つだけ" />
        <CommitGraph {...GRAPH} tips={tips} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          aria-live="polite"
          className="border-t border-ink/10 pt-4 text-[13.5px] font-semibold leading-[1.75]"
        >
          {current.note}
        </motion.p>
      </AnimatePresence>
    </FigureFrame>
  )
}

function LayerLabel({ title, text }: { title: string; text: string }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-[13px] font-extrabold">{title}</span>
      <span className="text-[11.5px] text-mute">{text}</span>
    </span>
  )
}
