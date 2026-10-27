'use client'

import { PiArrowLeftBold, PiArrowRightBold } from 'react-icons/pi'
import { FigButton, FigureFrame, StepDots } from '@/components/notes/FigureFrame'
import { useStepper } from '@/components/notes/useStepper'
import { Legend, Plot } from '@/components/notes/hnsw/Plot'
import { GRAPH, GREEDY_RUN, POINTS, QUERY, TRUTH, layerEdges } from '@/components/notes/hnsw/demo'

const EDGES = layerEdges(0)
const EXPANDS = GREEDY_RUN.expands
// 最後の 1 コマは「止まった理由」の説明
const COUNT = EXPANDS.length + 1

export function GreedyWalk() {
  const s = useStepper(COUNT, 1500)
  const k = Math.min(s.step, EXPANDS.length - 1)
  const end = s.step === COUNT - 1
  const route = EXPANDS.slice(0, k + 1).map((e) => e.node)
  const routeEdges = route.slice(1).map((n, i) => [route[i], n] as [number, number])
  const cur = EXPANDS[k]
  const seen = EXPANDS.slice(0, k + 1).flatMap((e) => e.checked)

  const tones: Record<number, 'visited' | 'current' | 'entry' | 'truth'> = Object.fromEntries(seen.map((n) => [n, 'visited']))
  tones[cur.node] = 'current'
  // 入口は今いる点と重なっても四角のまま見せる（初手は入口にいる）
  tones[GRAPH.entry] = 'entry'
  if (end) tones[TRUTH] = 'truth'

  const note = end
    ? `でも本当に一番近い点（赤い破線の輪）は別の場所にある。そこへ続く隣を持っていなかったので、たどり着けなかった。これが「局所解」。測った回数は ${GREEDY_RUN.distanceCount} 回。`
    : k === 0
      ? `入口（黒い四角）から始める。つながっている ${cur.checked.length} 点との距離を測り、＋ に一番近い点へ移る。`
      : k === EXPANDS.length - 1
        ? 'つながっている点を測っても、どれも今いる点より ＋ から遠い。ここで止まる。'
        : `移った先でも同じことをする。まだ測っていない隣 ${cur.checked.length} 点を測り、近い方へ。`

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <Legend items={['query', 'entry', 'current', 'visited', 'path', 'truth', 'edge']} />
      <div className="mx-auto w-full max-w-[460px] rounded-[10px] border border-ink/10 bg-tile p-3">
        <Plot points={POINTS} edges={EDGES} path={routeEdges} probes={end ? [] : cur.checked.map((n) => [cur.node, n] as [number, number])} tones={tones} query={QUERY} label="グラフを貪欲にたどる図" />
      </div>
      <div className="flex flex-col gap-4 border-t border-ink/10 pt-4">
        <p aria-live="polite" className="min-h-[3.4em] text-[13.5px] font-semibold leading-[1.7]">
          <span className="mr-2 font-mono text-[12px] text-mute">
            {s.step + 1}/{COUNT}
          </span>
          {note}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FigButton onClick={s.prev} disabled={s.step === 0} label="前へ">
              <PiArrowLeftBold />
            </FigButton>
            <FigButton onClick={s.atEnd ? () => s.setStep(0) : s.next} active={!s.atEnd}>
              {s.atEnd ? '最初から' : '次へ'}
              {!s.atEnd && <PiArrowRightBold />}
            </FigButton>
          </div>
          <StepDots count={COUNT} step={s.step} onSelect={s.setStep} />
        </div>
      </div>
    </FigureFrame>
  )
}
