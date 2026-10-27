'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { PiArrowLeftBold, PiArrowRightBold, PiEyeBold, PiFolderSimpleFill } from 'react-icons/pi'
import { FigButton, FigureFrame, StepDots } from '@/components/notes/FigureFrame'
import { useStepper } from '@/components/notes/useStepper'
import { BRANCH_TONE, type Branch } from '@/components/notes/worktree/branches'
import { useTr } from '@/components/notes/i18n'

const STEPS = [
  { note: ['上の 2 つはそれぞれの worktree だけが持つもの、下はリポジトリにあって全員で 1 つを使うもの。', 'The two on top belong to each worktree alone. The one below lives in the repository and is shared by everyone.'] as [string, string] },
  { note: ['app-hotfix で app.ts を直してステージに載せる。ステージ（index）は worktree ごとにあるので、app 側には何も起きない。', 'Fix app.ts in app-hotfix and stage it. Each worktree has its own staging area (index), so nothing happens on the app side.'] as [string, string] },
  { note: ['コミットすると、コミットは共有の置き場に入り、hotfix ブランチがそれを指すよう進む。', 'On commit, the commit goes into the shared store, and the hotfix branch moves forward to point at it.'] as [string, string] },
  { note: ['app の HEAD とファイルはそのまま。それでも共有なので、app からも新しいコミットと hotfix がすぐ見える。push も fetch も要らない。', 'The HEAD and files of app stay as they are. But because the store is shared, app can see the new commit and hotfix right away. No push or fetch needed.'] as [string, string] },
]

export function SharedVsOwn() {
  const tr = useTr()
  const s = useStepper(STEPS.length, 2000)
  const step = s.step
  const staged = step === 1
  const committed = step >= 2

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <LayoutGroup>
        <div className="grid gap-3 sm:grid-cols-2">
          <OwnCard
            folder="app"
            branch="main"
            dim={step === 1 || step === 2}
            highlight={step === 3}
            footer={
              step === 3 && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-[5px] text-[11px] font-bold text-teal">
                  <PiEyeBold />
                  {tr('下の h1 と hotfix が見えている', 'sees h1 and hotfix below')}
                </motion.span>
              )
            }
          />
          <OwnCard folder="app-hotfix" branch="hotfix" highlight={step === 1 || step === 2} editing={step < 2}>
            {staged && (
              <motion.span
                layoutId="change"
                className="w-fit rounded-[5px] bg-coral px-[7px] py-[2px] font-mono text-[10.5px] font-bold text-paper"
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                {tr('app.ts の修正', 'fix to app.ts')}
              </motion.span>
            )}
          </OwnCard>
        </div>

        {/* 共有の層 */}
        <div className={`flex flex-col gap-4 rounded-[10px] border-2 bg-tile p-4 transition-colors duration-300 ${step >= 2 ? 'border-teal' : 'border-ink/10'}`}>
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[13px] font-extrabold">{tr('リポジトリ（.git）— 共有', 'Repository (.git) — shared')}</span>
            <span className="text-[11.5px] text-mute">{tr('どの worktree から見ても同じ 1 つ', 'The same one, from every worktree')}</span>
          </span>
          <div className="grid gap-4 sm:grid-cols-3">
            <SharedSlot title={tr('コミット', 'Commits')} sub="objects">
              <div className="flex flex-wrap items-center gap-[5px]">
                {['c1', 'c2', 'c3'].map((c) => (
                  <span key={c} className="rounded-[5px] bg-ink/10 px-[7px] py-[2px] font-mono text-[10.5px] font-bold">
                    {c}
                  </span>
                ))}
                {committed && (
                  <motion.span
                    layoutId="change"
                    className="rounded-[5px] bg-coral px-[7px] py-[2px] font-mono text-[10.5px] font-bold text-paper"
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  >
                    h1
                  </motion.span>
                )}
              </div>
            </SharedSlot>
            <SharedSlot title={tr('ブランチ', 'Branches')} sub="refs">
              <div className="flex flex-col gap-[5px] font-mono text-[11px]">
                <span>
                  <span className={`rounded-[5px] px-[6px] py-[1px] font-bold ${BRANCH_TONE.main.fill}`}>main</span> → c3
                </span>
                <span>
                  <span className={`rounded-[5px] px-[6px] py-[1px] font-bold ${BRANCH_TONE.hotfix.fill}`}>hotfix</span> →{' '}
                  <AnimatePresence mode="wait">
                    <motion.span key={committed ? 'h1' : 'c3'} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="inline-block font-bold">
                      {committed ? 'h1' : 'c3'}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            </SharedSlot>
            <SharedSlot title={tr('設定', 'Config')} sub="config">
              <span className="font-mono text-[11px] text-mute">{tr('user.name など', 'user.name, etc.')}</span>
            </SharedSlot>
          </div>
        </div>
      </LayoutGroup>

      <div className="flex flex-col gap-4 border-t border-ink/10 pt-4">
        <p aria-live="polite" className="min-h-[3.4em] text-[13.5px] font-semibold leading-[1.7]">
          {tr(...STEPS[step].note)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FigButton onClick={s.prev} disabled={step === 0} label={tr('前へ', 'Previous')}>
              <PiArrowLeftBold />
            </FigButton>
            <FigButton onClick={s.atEnd ? () => s.setStep(0) : s.next} active={!s.atEnd}>
              {s.atEnd ? tr('最初から', 'Restart') : tr('次へ', 'Next')}
              {!s.atEnd && <PiArrowRightBold />}
            </FigButton>
          </div>
          <StepDots count={STEPS.length} step={step} onSelect={s.setStep} />
        </div>
      </div>
    </FigureFrame>
  )
}

function OwnCard({
  folder,
  branch,
  children,
  footer,
  dim = false,
  highlight = false,
  editing = false,
}: {
  folder: string
  branch: Branch
  children?: ReactNode
  footer?: ReactNode
  dim?: boolean
  highlight?: boolean
  editing?: boolean
}) {
  const tone = BRANCH_TONE[branch]
  const tr = useTr()
  return (
    <div
      className={`flex min-w-0 flex-col gap-3 rounded-[10px] border-2 bg-tile p-3 transition-all duration-300 ${highlight ? tone.border : 'border-ink/10'} ${
        dim ? 'opacity-55' : ''
      }`}
    >
      <span className="flex items-center gap-[6px] font-mono text-[12.5px] font-bold">
        <PiFolderSimpleFill className="text-[14px] text-mute" />
        {folder}/<span className="ml-auto text-[10px] font-bold text-mute">{tr('この worktree だけ', 'this worktree only')}</span>
      </span>
      <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-[7px] text-[11.5px]">
        <dt className="font-mono font-bold">HEAD</dt>
        <dd className="flex items-center gap-2">
          <span className={`rounded-[5px] px-[6px] py-[1px] font-mono text-[10.5px] font-bold ${tone.fill}`}>{branch}</span>
          <span className="text-mute">{tr('今いるブランチ', 'current branch')}</span>
        </dd>
        <dt className="font-mono font-bold">index</dt>
        <dd className="flex min-h-[22px] flex-wrap items-center gap-2">
          {children}
          <span className="text-mute">{tr('次のコミットに入れるもの', 'what goes into the next commit')}</span>
        </dd>
        <dt className="font-mono font-bold">files</dt>
        <dd className="text-mute">{editing && branch === 'hotfix' ? tr('app.ts を編集中', 'editing app.ts') : tr('手元のファイル', 'local files')}</dd>
      </dl>
      {footer}
    </div>
  )
}

function SharedSlot({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="flex items-baseline gap-2">
        <span className="text-[12px] font-extrabold">{title}</span>
        <span className="font-mono text-[10.5px] text-mute">{sub}</span>
      </span>
      {children}
    </div>
  )
}
