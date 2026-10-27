'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PiArrowCounterClockwiseBold, PiPauseFill, PiPlayFill, PiTrayFill } from 'react-icons/pi'
import { FigButton, FigureFrame, StepDots } from '@/components/notes/FigureFrame'
import { FolderBrick, type FolderState } from '@/components/notes/worktree/FolderBrick'
import { useStepper } from '@/components/notes/useStepper'
import { useTr } from '@/components/notes/i18n'

type Frame = { action: [string, string] | null; note: [string, string]; folders: FolderState[]; stash: number }

const app = (branch: string, extra: Partial<FolderState> = {}): FolderState => ({ name: 'app', branch, kind: 'main', ...extra })

/** feature で作業中に急ぎの修正が来た、という同じ場面を 2 通りで。手順は操作の意味だけで示す */
const SCENARIOS: Record<'switch' | 'worktree', Frame[]> = {
  switch: [
    { action: null, note: ['feature で作業中。変更はまだコミットしていない。そこに急ぎの修正依頼が来る。', 'Working on feature, with changes not yet committed. Then an urgent fix comes in.'], folders: [app('feature', { dirty: true, active: true })], stash: 0 },
    { action: ['退避する', 'Stash'], note: ['中身を入れ替えると途中の変更が邪魔になるので、いったん stash に逃がす。', 'Swapping the contents would get in the way of the unfinished changes, so stash them for now.'], folders: [app('feature', { active: true })], stash: 1 },
    { action: ['切り替える', 'Switch'], note: ['同じフォルダの中身が、まるごと hotfix に入れ替わる。', 'The same folder is swapped over to hotfix entirely.'], folders: [app('hotfix', { active: true })], stash: 1 },
    { action: ['直す', 'Fix'], note: ['修正してコミット。', 'Fix it and commit.'], folders: [app('hotfix', { active: true })], stash: 1 },
    { action: ['戻す', 'Switch back'], note: ['feature に戻す。フォルダの中身がまた入れ替わる。', 'Switch back to feature. The folder contents are swapped again.'], folders: [app('feature', { active: true })], stash: 1 },
    { action: ['復元する', 'Restore'], note: ['逃がしていた変更を戻して、やっと続きに戻れる。', 'Restore the stashed changes, and you can finally pick up where you left off.'], folders: [app('feature', { dirty: true, active: true })], stash: 0 },
  ],
  worktree: [
    { action: null, note: ['feature で作業中。変更はまだコミットしていない。そこに急ぎの修正依頼が来る。', 'Working on feature, with changes not yet committed. Then an urgent fix comes in.'], folders: [app('feature', { dirty: true, active: true })], stash: 0 },
    {
      action: ['フォルダを増やす', 'Add a folder'],
      note: ['隣に hotfix 用のフォルダを作る。app の中身には一切触らない。', 'Create a folder for hotfix next to it. Nothing in app is touched.'],
      folders: [app('feature', { dirty: true }), { name: 'app-hotfix', branch: 'hotfix', kind: 'linked', active: true }],
      stash: 0,
    },
    {
      action: ['直す', 'Fix'],
      note: ['そのフォルダで修正してコミット。', 'Fix it and commit in that folder.'],
      folders: [app('feature', { dirty: true }), { name: 'app-hotfix', branch: 'hotfix', kind: 'linked', active: true }],
      stash: 0,
    },
    {
      action: ['戻る', 'Go back'],
      note: ['元のフォルダに戻るだけ。途中の変更はさっきのまま残っている。', 'Just go back to the original folder. The unfinished changes are right where you left them.'],
      folders: [app('feature', { dirty: true, active: true }), { name: 'app-hotfix', branch: 'hotfix', kind: 'linked' }],
      stash: 0,
    },
  ],
}

export function SwitchVsWorktree() {
  const tr = useTr()
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
        <div className="flex flex-wrap gap-2" role="group" aria-label={tr('やり方', 'Approach')}>
          <FigButton active={mode === 'switch'} onClick={() => choose('switch')}>
            {tr('中身を入れ替える（switch）', 'Swap contents (switch)')}
          </FigButton>
          <FigButton active={mode === 'worktree'} onClick={() => choose('worktree')}>
            {tr('フォルダを増やす（worktree）', 'Add a folder (worktree)')}
          </FigButton>
        </div>
        <FigButton onClick={s.playing ? s.pause : s.play} label={s.playing ? tr('一時停止', 'Pause') : tr('再生', 'Play')}>
          {s.playing ? <PiPauseFill /> : s.atEnd ? <PiArrowCounterClockwiseBold /> : <PiPlayFill />}
          {s.playing ? tr('停止', 'Pause') : s.atEnd ? tr('もう一度', 'Replay') : tr('再生', 'Play')}
        </FigButton>
      </div>

      {/* 手順の数そのものが違いなので、横一列に並べて今どこかを示す */}
      <ol className="flex flex-wrap items-center gap-[6px]">
        {actions.map((f, i) => {
          const done = i + 1 <= s.step
          const now = i + 1 === s.step
          return (
            <li key={`${mode}-${i}`} className="flex items-center gap-[6px]">
              <span
                className={`rounded-[6px] px-[9px] py-[4px] text-[12px] font-bold transition-colors duration-200 ${
                  now ? 'bg-teal text-paper' : done ? 'bg-ink/10 text-ink' : 'border border-dashed border-ink/20 text-mute'
                }`}
              >
                {f.action && tr(...f.action)}
              </span>
              {i < actions.length - 1 && <span className="text-[11px] text-mute">→</span>}
            </li>
          )
        })}
        <li className="ml-auto font-mono text-[11.5px] text-mute">{tr(`${actions.length} 手`, `${actions.length} steps`)}</li>
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
          <span className="text-[11.5px] font-bold text-mute">{tr('退避場所（stash）', 'Stash')}</span>
          <AnimatePresence>
            {frame.stash > 0 && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-[5px] bg-coral px-[7px] py-[2px] text-[10.5px] font-bold text-paper"
              >
                {tr('feature の途中の変更', 'unfinished feature changes')}
              </motion.span>
            )}
          </AnimatePresence>
          {frame.stash === 0 && <span className="text-[11px] text-mute/70">{tr('空', 'empty')}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-ink/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-[13.5px] font-semibold leading-[1.7]">
          {tr(...frame.note)}
        </p>
        <StepDots count={frames.length} step={s.step} onSelect={s.setStep} />
      </div>
    </FigureFrame>
  )
}
