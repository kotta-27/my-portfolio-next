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

/** #23303 を出すまでにやったこと。中身は Issue 本文に書いた内容から起こしている */
const STEPS: { icon: IconType; title: string; did: string; why: string }[] = [
  {
    icon: PiBugBeetleBold,
    title: 'おかしいと気づく',
    did: 'post_filter に range を置くと、当てはまるはずの件数より少ない。エラーは出ず、件数は「ちょうど」と報告される。',
    why: 'エラーにならない間違いは気づきにくく、気づいた人が報告しないと残り続ける。',
  },
  {
    icon: PiScissorsBold,
    title: '再現を小さくする',
    did: '単一ノード・1 シャード・curl だけのスクリプトに削った。データは value = (i × 7919) % N で、件数 N を変えるだけで規模を変えられる。',
    why: 'メンテナーが手元でそのまま動かせる形にする。前提が少ないほど、別の原因を疑われにくい。',
  },
  {
    icon: PiClockCounterClockwiseBold,
    title: 'いつから壊れたか調べる',
    did: '公式 Docker イメージで 2.19.5 / 3.0.0 / 3.1.0 / 3.9.0 を並べ、同じスクリプトの結果を表にした。2.19.5 は正しく、3.x で壊れている。',
    why: '「いつから」が分かると、原因の変更をかなり絞り込める。',
  },
  {
    icon: PiBinocularsBold,
    title: '同じ報告がないか探す',
    did: '既存の Issue と PR を探して、見つからなかったことを本文に書いた。',
    why: '重複はメンテナーの手間になる。探した、と書いておけば読む側も安心できる。',
  },
  {
    icon: PiMagnifyingGlassBold,
    title: '原因をコードで追う',
    did: '近似を有効にする処理が、本命のクエリ以外（post_filter など）にもかかっていた。該当箇所はバージョンのタグに固定したリンクで示した。',
    why: 'main ブランチへのリンクは、コードが変わると行がずれる。タグに固定すれば、後から読んでも同じ行を指す。',
  },
  {
    icon: PiCodeBold,
    title: '直し方を考える',
    did: '「本命のクエリのときだけ近似する」という 1 行の条件を diff で載せた。参照の同一性に頼る弱点と、別の直し方の案も添えた。',
    why: '直し方は相手が決めるもの。案として出し、懸念も先に書いておくと議論が早い。',
  },
  {
    icon: PiFlaskBold,
    title: '手元で確かめる',
    did: '3.9.0 をローカルでビルドし、新しいテストが修正前に落ちて修正後に通ること、既存のテストが通ることを確かめた。',
    why: '「たぶん直る」ではなく「こう確かめた」と書けると、修正案の信頼度が上がる。',
  },
  {
    icon: PiPaperPlaneTiltBold,
    title: 'テンプレートに沿って出す',
    did: 'バグ報告のテンプレート（症状・コンポーネント・再現・期待する動作・環境）に沿って書き、最後に「よければ PR を出す」と添えた。',
    why: 'テンプレートの順はメンテナーが読みたい順。自分で直す気があることも伝わる。',
  },
]

export function IssueFlow() {
  const s = useStepper(STEPS.length, 2600)
  const cur = STEPS[s.step]
  const Icon = cur.icon

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      {/* 全体の道のり。済んだところまで線が伸びる */}
      <ol className="grid grid-cols-8 gap-1" aria-label="出すまでの流れ">
        {STEPS.map((st, i) => {
          const StIcon = st.icon
          const done = i <= s.step
          return (
            <li key={st.title} className="relative flex flex-col items-center gap-2">
              {i > 0 && (
                <span className="absolute right-1/2 top-[17px] h-[2px] w-full bg-ink/10">
                  <motion.span className="block h-full bg-teal" initial={false} animate={{ width: done ? '100%' : '0%' }} transition={{ duration: 0.35 }} />
                </span>
              )}
              <button
                type="button"
                onClick={() => s.setStep(i)}
                aria-label={st.title}
                aria-current={i === s.step ? 'step' : undefined}
                className={`relative z-[1] grid h-[36px] w-[36px] place-items-center rounded-full border-2 transition-colors duration-200 ${
                  i === s.step ? 'border-teal bg-teal text-paper' : done ? 'border-teal bg-tile text-teal' : 'border-ink/15 bg-tile text-mute'
                }`}
              >
                <StIcon className="text-[16px]" />
              </button>
              <span className={`hidden text-center text-[10.5px] font-bold leading-[1.35] md:block ${i === s.step ? 'text-ink' : 'text-mute'}`}>{st.title}</span>
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
              <span className="text-[16px] font-extrabold">{cur.title}</span>
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[.06em] text-mute">やったこと</span>
                <p className="text-[13.5px] leading-[1.75]">{cur.did}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[.06em] text-teal">なぜ</span>
                <p className="text-[13.5px] leading-[1.75] text-ink/80">{cur.why}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <StepNav step={s.step} count={STEPS.length} onPrev={s.prev} onNext={s.next} onSelect={s.setStep} />
    </FigureFrame>
  )
}
