'use client'

import { Plot } from '@/components/notes/hnsw/Plot'
import { HNSW_RUN, POINTS, QUERY, TRUTH, inLayer, layerEdges } from '@/components/notes/hnsw/demo'

const LAYERS = HNSW_RUN.layers

/** 3D が使えない環境（WebGL が無効など）向けに、層を 2×2 の平面で並べる */
export function LayerGrid2D({ step, last }: { step: number; last: boolean }) {
  const doneUntil = step - 1
  return (
    <div className="grid grid-cols-2 gap-3 p-2">
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
        if (l.layer === 0 && last) tones[TRUTH] = tones[TRUTH] === 'found' ? 'found' : 'truth'
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
  )
}
