'use client'

import { FigureFrame, StepNav } from '@/components/notes/FigureFrame'
import { useStepper } from '@/components/notes/useStepper'
import { Legend, Plot } from '@/components/notes/hnsw/Plot'
import { GRAPH, HNSW_RUN, POINTS, QUERY, TRUTH, inLayer, layerEdges } from '@/components/notes/hnsw/demo'

const LAYERS = HNSW_RUN.layers // 上の層から順
const STEPS = LAYERS.length + 2

export function LayerSearch() {
  const s = useStepper(STEPS, 1800)
  // step 0: 全体、1..n: 層ごとの探索、最後: 結果
  const doneUntil = s.step - 1

  const note =
    s.step === 0
      ? `同じ ${POINTS.length} 点を、層に分けて持っている。一番下（層 0）には全部の点、上の層ほど点が少なく、つながりは遠くまで届く。`
      : s.step === STEPS - 1
        ? `層 0 で着いた点は、本当に一番近い点と同じ。測った回数は全部で ${HNSW_RUN.distanceCount} 回。層を使わずに層 0 だけをたどったときは、たどり着けなかった。`
        : (() => {
            const l = LAYERS[s.step - 1]
            const hops = l.expands.length - 1
            if (l.layer === GRAPH.maxLevel) return `一番上の層 ${l.layer} から始める。点が少ないので、大まかな方向だけ決める。`
            if (l.layer === 0) return `最後に層 0（全部の点）で、すぐ近くを細かく探す。${hops} 回移動して止まる。`
            return `1 つ上の層で止まった点を入口にして、層 ${l.layer} を貪欲にたどる（${hops} 回移動）。止まった点を次の層の入口にする。`
          })()

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <Legend items={['query', ['entry', 'その層の入口'], ['current', 'その層で止まった点'], 'visited', 'path', 'edge']} />
      <div className="grid grid-cols-2 gap-3">
        {LAYERS.map((l, idx) => {
          const active = idx === doneUntil
          const done = idx <= doneUntil
          const route = l.expands.map((e) => e.node).filter((n, i, a) => n !== a[i - 1])
          const entryNode = l.expands[0]?.node
          const stopNode = l.result[0]
          const tones: Record<number, 'entry' | 'current' | 'found' | 'truth' | 'visited'> = {}
          if (done) {
            l.expands.forEach((e) => e.checked.forEach((n) => (tones[n] = 'visited')))
            tones[stopNode] = l.layer === 0 ? 'found' : 'current'
            // 入口から動かなかった層でも、入口は四角のまま見せる
            if (stopNode !== entryNode || l.layer !== 0) tones[entryNode] = 'entry'
          }
          if (l.layer === 0 && s.step === STEPS - 1) tones[TRUTH] = tones[TRUTH] === 'found' ? 'found' : 'truth'
          return (
            <div
              key={l.layer}
              className={`flex min-w-0 flex-col gap-2 rounded-[10px] border-2 bg-tile p-2 transition-colors duration-300 ${active ? 'border-teal' : 'border-ink/10'}`}
            >
              <span className="flex items-baseline justify-between px-1">
                <span className="text-[12.5px] font-extrabold">層 {l.layer}</span>
                <span className="font-mono text-[10.5px] text-mute">{inLayer(l.layer).length} 点</span>
              </span>
              <Plot
                points={POINTS}
                nodes={inLayer(l.layer)}
                edges={layerEdges(l.layer)}
                path={done ? route.slice(1).map((n, i) => [route[i], n] as [number, number]) : []}
                tones={tones}
                query={QUERY}
                label={`層 ${l.layer}`}
              />
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-4 border-t border-ink/10 pt-4">
        <p aria-live="polite" className="min-h-[3.4em] text-[13.5px] font-semibold leading-[1.7]">
          {note}
        </p>
        <StepNav step={s.step} count={STEPS} onPrev={s.prev} onNext={s.next} onSelect={s.setStep} />
      </div>
    </FigureFrame>
  )
}
