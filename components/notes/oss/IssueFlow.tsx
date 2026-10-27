'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  PiBinocularsBold,
  PiBugBeetleBold,
  PiClockCounterClockwiseBold,
  PiCodeBold,
  PiFlaskBold,
  PiMagnifyingGlassBold,
  PiPaperPlaneTiltBold,
  PiScissorsBold,
} from 'react-icons/pi'
import type { IconType } from 'react-icons'
import { FigureFrame, StepNav } from '@/components/notes/FigureFrame'
import { useStepper } from '@/components/notes/useStepper'
import { useTr } from '@/components/notes/i18n'

/** #23303 を出すまでにやったこと。中身は Issue 本文に書いた内容から起こしている */
const STEPS: { icon: IconType; title: [string, string]; did: [string, string]; why: [string, string] }[] = [
  {
    icon: PiBugBeetleBold,
    title: ['おかしいと気づく', 'Notice something is off'],
    did: ['post_filter に range を置くと、当てはまるはずの件数より少ない。エラーは出ず、件数は「ちょうど」と報告される。', 'With a range in post_filter, fewer documents match than should. No error is returned, and the count is reported as exact.'],
    why: ['エラーにならない間違いは気づきにくく、気づいた人が報告しないと残り続ける。', 'Mistakes that raise no error are easy to miss, and they stay unless whoever notices reports them.'],
  },
  {
    icon: PiScissorsBold,
    title: ['再現を小さくする', 'Shrink the reproduction'],
    did: ['単一ノード・1 シャード・curl だけのスクリプトに削った。データは value = (i × 7919) % N で、件数 N を変えるだけで規模を変えられる。', 'Cut it down to a script with one node, one shard and only curl. The data is value = (i × 7919) % N, so changing N changes the scale.'],
    why: ['メンテナーが手元でそのまま動かせる形にする。前提が少ないほど、別の原因を疑われにくい。', 'Make it something a maintainer can run as is. The fewer assumptions, the less likely another cause gets suspected.'],
  },
  {
    icon: PiClockCounterClockwiseBold,
    title: ['いつから壊れたか調べる', 'Find when it broke'],
    did: ['公式 Docker イメージで 2.19.5 / 3.0.0 / 3.1.0 / 3.9.0 を並べ、同じスクリプトの結果を表にした。2.19.5 は正しく、3.x で壊れている。', 'Ran the same script on the official Docker images for 2.19.5 / 3.0.0 / 3.1.0 / 3.9.0 and tabulated the results. 2.19.5 is correct; 3.x is broken.'],
    why: ['「いつから」が分かると、原因の変更をかなり絞り込める。', 'Knowing when it broke narrows down the change that caused it a lot.'],
  },
  {
    icon: PiBinocularsBold,
    title: ['同じ報告がないか探す', 'Look for existing reports'],
    did: ['既存の Issue と PR を探して、見つからなかったことを本文に書いた。', 'Searched existing issues and PRs, and noted in the issue that none were found.'],
    why: ['重複はメンテナーの手間になる。探した、と書いておけば読む側も安心できる。', 'Duplicates cost maintainers time. Saying you searched reassures the reader.'],
  },
  {
    icon: PiMagnifyingGlassBold,
    title: ['原因をコードで追う', 'Trace the cause in the code'],
    did: ['近似を有効にする処理が、本命のクエリ以外（post_filter など）にもかかっていた。該当箇所はバージョンのタグに固定したリンクで示した。', 'The code that enables approximation was also applied to queries other than the main one (post_filter and others). Linked the relevant lines, pinned to a version tag.'],
    why: ['main ブランチへのリンクは、コードが変わると行がずれる。タグに固定すれば、後から読んでも同じ行を指す。', 'Links to the main branch drift as the code changes. Pinned to a tag, they point to the same lines later.'],
  },
  {
    icon: PiCodeBold,
    title: ['直し方を考える', 'Work out a fix'],
    did: ['「本命のクエリのときだけ近似する」という 1 行の条件を diff で載せた。参照の同一性に頼る弱点と、別の直し方の案も添えた。', 'Included a diff with a one-line condition: approximate only the main query. Also noted its weakness (it relies on reference equality) and an alternative.'],
    why: ['直し方は相手が決めるもの。案として出し、懸念も先に書いておくと議論が早い。', 'The maintainers decide the fix. Offering it as a proposal, with concerns up front, speeds up the discussion.'],
  },
  {
    icon: PiFlaskBold,
    title: ['手元で確かめる', 'Verify locally'],
    did: ['3.9.0 をローカルでビルドし、新しいテストが修正前に落ちて修正後に通ること、既存のテストが通ることを確かめた。', 'Built 3.9.0 locally and confirmed a new test fails before the fix and passes after, and that existing tests still pass.'],
    why: ['「たぶん直る」ではなく「こう確かめた」と書けると、修正案の信頼度が上がる。', 'Being able to say "here is how I checked" rather than "this probably works" makes the fix more trustworthy.'],
  },
  {
    icon: PiPaperPlaneTiltBold,
    title: ['テンプレートに沿って出す', 'File it following the template'],
    did: ['バグ報告のテンプレート（症状・コンポーネント・再現・期待する動作・環境）に沿って書き、最後に「よければ PR を出す」と添えた。', 'Wrote it following the bug template (what happens, component, reproduction, expected behavior, environment) and added at the end that I was happy to open a PR.'],
    why: ['テンプレートの順はメンテナーが読みたい順。自分で直す気があることも伝わる。', 'The template order is the order maintainers want to read in. It also shows you are willing to fix it yourself.'],
  },
]

export function IssueFlow() {
  const tr = useTr()
  const s = useStepper(STEPS.length, 2600)
  const cur = STEPS[s.step]
  const Icon = cur.icon

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      {/* 全体の道のり。済んだところまで線が伸びる */}
      <ol className="grid grid-cols-8 gap-1" aria-label={tr('出すまでの流れ', 'Steps before filing')}>
        {STEPS.map((st, i) => {
          const StIcon = st.icon
          const done = i <= s.step
          return (
            <li key={st.title[1]} className="relative flex flex-col items-center gap-2">
              {i > 0 && (
                <span className="absolute right-1/2 top-[17px] h-[2px] w-full bg-ink/10">
                  <motion.span className="block h-full bg-teal" initial={false} animate={{ width: done ? '100%' : '0%' }} transition={{ duration: 0.35 }} />
                </span>
              )}
              <button
                type="button"
                onClick={() => s.setStep(i)}
                aria-label={tr(...st.title)}
                aria-current={i === s.step ? 'step' : undefined}
                className={`relative z-[1] grid h-[36px] w-[36px] place-items-center rounded-full border-2 transition-colors duration-200 ${
                  i === s.step ? 'border-teal bg-teal text-paper' : done ? 'border-teal bg-tile text-teal' : 'border-ink/15 bg-tile text-mute'
                }`}
              >
                <StIcon className="text-[16px]" />
              </button>
              <span className={`hidden text-center text-[10.5px] font-bold leading-[1.35] md:block ${i === s.step ? 'text-ink' : 'text-mute'}`}>{tr(...st.title)}</span>
            </li>
          )
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={s.step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid gap-3 rounded-[10px] border border-ink/10 bg-tile p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-5 sm:p-5"
        >
          <span className="grid h-[48px] w-[48px] place-items-center rounded-[12px] bg-teal/10 text-teal">
            <Icon className="text-[24px]" />
          </span>
          <div className="flex min-w-0 flex-col gap-3">
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-[12px] font-bold text-mute">
                {s.step + 1}/{STEPS.length}
              </span>
              <span className="text-[16px] font-extrabold">{tr(...cur.title)}</span>
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[.06em] text-mute">{tr('やったこと', 'What I did')}</span>
                <p className="text-[13.5px] leading-[1.75]">{tr(...cur.did)}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[.06em] text-teal">{tr('なぜ', 'Why')}</span>
                <p className="text-[13.5px] leading-[1.75] text-ink/80">{tr(...cur.why)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <StepNav step={s.step} count={STEPS.length} onPrev={s.prev} onNext={s.next} onSelect={s.setStep} />
    </FigureFrame>
  )
}
