'use client'

import { motion } from 'framer-motion'
import { PiArrowLeftBold, PiArrowRightBold, PiCheckCircleFill, PiFolderSimpleFill, PiProhibitBold, PiWarningFill } from 'react-icons/pi'
import { FigButton, FigureFrame, StepDots } from '@/components/notes/FigureFrame'
import { useStepper } from '@/components/notes/useStepper'
import { CommitGraph } from '@/components/notes/worktree/CommitGraph'
import { BRANCH_TONE } from '@/components/notes/worktree/branches'
import { useTr } from '@/components/notes/i18n'

type Tree = { folder: string; files: [string, string]; state: 'ok' | 'stale' | 'blocked' }

const STEPS: { note: [string, string]; tip: 2 | 3; trees: Tree[] }[] = [
  {
    note: ['もし同じ main を 2 つのフォルダで開けたとする（実際には git が止める）。どちらも HEAD は main、ファイルは c3 の状態。', 'Suppose you could open the same main in two folders (git actually stops you). Both have HEAD on main, and both have files at c3.'],
    tip: 2,
    trees: [
      { folder: 'app', files: ['c3 の状態', 'at c3'], state: 'ok' },
      { folder: 'app-2', files: ['c3 の状態', 'at c3'], state: 'ok' },
    ],
  },
  {
    note: ['app でコミットすると、main は新しいコミット c4 に進む。app のファイルは c4 と一致している。', 'Commit in app, and main moves forward to a new commit, c4. The files in app match c4.'],
    tip: 3,
    trees: [
      { folder: 'app', files: ['c4 の状態', 'at c4'], state: 'ok' },
      { folder: 'app-2', files: ['c3 の状態', 'at c3'], state: 'ok' },
    ],
  },
  {
    note: ['app-2 の HEAD も main、つまり c4 を指す。でもファイルは c3 のまま。差分を見ると「c4 の変更を取り消す編集」をしたように見えてしまう。', 'HEAD in app-2 is also main, so it points to c4. But its files are still at c3. A diff would make it look as if someone had edited the files to undo c4.'],
    tip: 3,
    trees: [
      { folder: 'app', files: ['c4 の状態', 'at c4'], state: 'ok' },
      { folder: 'app-2', files: ['c3 のまま（ずれ）', 'still at c3 (out of sync)'], state: 'stale' },
    ],
  },
  {
    note: ['このずれを起こさないため、git は 1 つのブランチを 1 か所でしか開かせない。別のフォルダで同じものを見たいときは、ブランチではなくコミットを直接取り出す（--detach）。', 'To prevent this mismatch, git lets a branch be open in only one place. To see the same content in another folder, check out the commit directly instead of the branch (--detach).'],
    tip: 3,
    trees: [
      { folder: 'app', files: ['c4 の状態', 'at c4'], state: 'ok' },
      { folder: 'app-2', files: ["fatal: 'main' is already used by worktree", "fatal: 'main' is already used by worktree"], state: 'blocked' },
    ],
  },
]

export function SameBranch() {
  const tr = useTr()
  const s = useStepper(STEPS.length, 2400)
  const step = STEPS[s.step]
  const commits = [
    { id: 'c1', at: [0, 0] as [number, number], label: 'c1' },
    { id: 'c2', at: [1, 0] as [number, number], label: 'c2' },
    { id: 'c3', at: [2, 0] as [number, number], label: 'c3' },
    ...(step.tip === 3 ? [{ id: 'c4', at: [3, 0] as [number, number], label: 'c4' }] : []),
  ]
  const heads = step.trees.filter((t) => t.state !== 'blocked').map((t) => `${t.folder}/`)

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {step.trees.map((t) => {
          const Icon = t.state === 'ok' ? PiCheckCircleFill : t.state === 'stale' ? PiWarningFill : PiProhibitBold
          return (
            <motion.div
              key={t.folder}
              layout
              animate={{ x: t.state === 'stale' ? [0, -5, 5, -3, 3, 0] : 0 }}
              transition={{ duration: 0.4 }}
              className={`flex min-w-0 flex-col gap-2 rounded-[10px] border-2 bg-tile p-3 transition-colors duration-300 ${
                t.state === 'ok' ? 'border-ink/15' : t.state === 'stale' ? 'border-coral' : 'border-dashed border-mute/50 text-mute'
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-[6px] font-mono text-[12.5px] font-bold">
                  <PiFolderSimpleFill className="text-[14px] text-mute" />
                  {t.folder}/
                </span>
                {t.state !== 'blocked' && (
                  <span className={`rounded-[5px] px-[6px] py-[1px] font-mono text-[10.5px] font-bold ${BRANCH_TONE.main.fill}`}>HEAD → main</span>
                )}
              </span>
              <span
                className={`flex items-start gap-[6px] text-[12px] font-bold ${
                  t.state === 'ok' ? 'text-ink/75' : t.state === 'stale' ? 'text-coral' : 'break-all font-mono text-[11px]'
                }`}
              >
                <Icon className={`mt-[2px] shrink-0 text-[14px] ${t.state === 'ok' ? 'text-teal' : ''}`} />
                {tr('ファイル', 'Files')}: {tr(...t.files)}
              </span>
            </motion.div>
          )
        })}
      </div>

      <div className="flex flex-col gap-2 rounded-[10px] border border-ink/10 bg-tile p-4">
        <span className="text-[13px] font-extrabold">{tr('リポジトリ（.git）', 'Repository (.git)')}</span>
        <CommitGraph
          cols={4}
          rows={1}
          commits={commits}
          edges={[{ from: [0, 0], to: [step.tip, 0] }]}
          tips={[{ branch: 'main', at: [step.tip, 0], heads }]}
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-ink/10 pt-4">
        <p aria-live="polite" className="min-h-[3.4em] text-[13.5px] font-semibold leading-[1.7]">
          {tr(...step.note)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FigButton onClick={s.prev} disabled={s.step === 0} label={tr('前へ', 'Previous')}>
              <PiArrowLeftBold />
            </FigButton>
            <FigButton onClick={s.atEnd ? () => s.setStep(0) : s.next} active={!s.atEnd}>
              {s.atEnd ? tr('最初から', 'Restart') : tr('次へ', 'Next')}
              {!s.atEnd && <PiArrowRightBold />}
            </FigButton>
          </div>
          <StepDots count={STEPS.length} step={s.step} onSelect={s.setStep} />
        </div>
      </div>
    </FigureFrame>
  )
}
