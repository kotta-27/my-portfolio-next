'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PiArrowCounterClockwiseBold, PiPauseFill, PiPlayFill, PiTrayFill } from 'react-icons/pi'
import { FigButton, FigureFrame, StepDots } from '@/components/notes/FigureFrame'
import { FolderBrick, type FolderState } from '@/components/notes/worktree/FolderBrick'
import { useStepper } from '@/components/notes/useStepper'

type Frame = { action: string | null; note: string; folders: FolderState[]; stash: number }

const app = (branch: string, extra: Partial<FolderState> = {}): FolderState => ({ name: 'app', branch, kind: 'main', ...extra })

/** feature で作業中に急ぎの修正が来た、という同じ場面を 2 通りで。手順は操作の意味だけで示す */
const SCENARIOS: Record<'switch' | 'worktree', Frame[]> = {
  switch: [
    { action: null, note: 'feature で作業中。変更はまだコミットしていない。そこに急ぎの修正依頼が来る。', folders: [app('feature', { dirty: true, active: true })], stash: 0 },
    { action: '退避する', note: '中身を入れ替えると途中の変更が邪魔になるので、いったん stash に逃がす。', folders: [app('feature', { active: true })], stash: 1 },
    { action: '切り替える', note: '同じフォルダの中身が、まるごと hotfix に入れ替わる。', folders: [app('hotfix', { active: true })], stash: 1 },
    { action: '直す', note: '修正してコミット。', folders: [app('hotfix', { active: true })], stash: 1 },
    { action: '戻す', note: 'feature に戻す。フォルダの中身がまた入れ替わる。', folders: [app('feature', { active: true })], stash: 1 },
    { action: '復元する', note: '逃がしていた変更を戻して、やっと続きに戻れる。', folders: [app('feature', { dirty: true, active: true })], stash: 0 },
  ],
  worktree: [
    { action: null, note: 'feature で作業中。変更はまだコミットしていない。そこに急ぎの修正依頼が来る。', folders: [app('feature', { dirty: true, active: true })], stash: 0 },
    {
      action: 'フォルダを増やす',
      note: '隣に hotfix 用のフォルダを作る。app の中身には一切触らない。',
      folders: [app('feature', { dirty: true }), { name: 'app-hotfix', branch: 'hotfix', kind: 'linked', active: true }],
      stash: 0,
    },
    {
      action: '直す',
      note: 'そのフォルダで修正してコミット。',
      folders: [app('feature', { dirty: true }), { name: 'app-hotfix', branch: 'hotfix', kind: 'linked', active: true }],
      stash: 0,
    },
    {
      action: '戻る',
      note: '元のフォルダに戻るだけ。途中の変更はさっきのまま残っている。',
      folders: [app('feature', { dirty: true, active: true }), { name: 'app-hotfix', branch: 'hotfix', kind: 'linked' }],
      stash: 0,
    },
  ],
}

export function SwitchVsWorktree() {
  const [mode, setMode] = useState<'switch' | 'worktree'>('switch')
  const frames = SCENARIOS[mode]
  const s = useStepper(frames.length, 1600)
  const frame = frames[s.step]
  const actions = frames.slice(1)

  function choose(m: 'switch' | 'worktree') {
    setMode(m)
    s.setStep(0)
  }

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="やり方">
          <FigButton active={mode === 'switch'} onClick={() => choose('switch')}>
            中身を入れ替える（switch）
          </FigButton>
          <FigButton active={mode === 'worktree'} onClick={() => choose('worktree')}>
            フォルダを増やす（worktree）
          </FigButton>
        </div>
        <FigButton onClick={s.playing ? s.pause : s.play} label={s.playing ? '一時停止' : '再生'}>
          {s.playing ? <PiPauseFill /> : s.atEnd ? <PiArrowCounterClockwiseBold /> : <PiPlayFill />}
          {s.playing ? '停止' : s.atEnd ? 'もう一度' : '再生'}
        </FigButton>
      </div>

      {/* 手順の数そのものが違いなので、横一列に並べて今どこかを示す */}
      <ol className="flex flex-wrap items-center gap-[6px]">
        {actions.map((f, i) => {
          const done = i + 1 <= s.step
          const now = i + 1 === s.step
          return (
            <li key={`${mode}-${f.action}-${i}`} className="flex items-center gap-[6px]">
              <span
                className={`rounded-[6px] px-[9px] py-[4px] text-[12px] font-bold transition-colors duration-200 ${
                  now ? 'bg-teal text-paper' : done ? 'bg-ink/10 text-ink' : 'border border-dashed border-ink/20 text-mute'
                }`}
              >
                {f.action}
              </span>
              {i < actions.length - 1 && <span className="text-[11px] text-mute">→</span>}
            </li>
          )
        })}
        <li className="ml-auto font-mono text-[11.5px] text-mute">{actions.length} 手</li>
      </ol>

      <div className="flex flex-col gap-4">
        <div className="grid min-h-[132px] grid-cols-2 items-start gap-3 sm:grid-cols-[repeat(2,minmax(0,240px))]">
          <AnimatePresence mode="popLayout">
            {frame.folders.map((f) => (
              <FolderBrick key={f.name} f={f} />
            ))}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3 rounded-[8px] border border-dashed border-ink/20 px-3 py-[9px]">
          <PiTrayFill className="text-[16px] text-mute" />
          <span className="text-[11.5px] font-bold text-mute">退避場所（stash）</span>
          <AnimatePresence>
            {frame.stash > 0 && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-[5px] bg-coral px-[7px] py-[2px] text-[10.5px] font-bold text-paper"
              >
                feature の途中の変更
              </motion.span>
            )}
          </AnimatePresence>
          {frame.stash === 0 && <span className="text-[11px] text-mute/70">空</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-ink/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-[13.5px] font-semibold leading-[1.7]">
          {frame.note}
        </p>
        <StepDots count={frames.length} step={s.step} onSelect={s.setStep} />
      </div>
    </FigureFrame>
  )
}
