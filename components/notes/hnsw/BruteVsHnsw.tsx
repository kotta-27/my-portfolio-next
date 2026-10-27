'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PiArrowCounterClockwiseBold } from 'react-icons/pi'
import { FigButton, FigureFrame } from '@/components/notes/FigureFrame'
import { Legend, Plot } from '@/components/notes/hnsw/Plot'
import { HNSW_RUN, POINTS, QUERY, TRUTH } from '@/components/notes/hnsw/demo'
import { useTr } from '@/components/notes/i18n'

// HNSW がたどった点（層をまたいで同じ点が続くところは 1 つにまとめる）
const route = HNSW_RUN.layers.flatMap((l) => l.expands.map((e) => e.node)).filter((n, i, a) => n !== a[i - 1])
const routeEdges = route.slice(1).map((n, i) => [route[i], n] as [number, number])
const measured = [...new Set(HNSW_RUN.layers.flatMap((l) => l.expands.flatMap((e) => [e.node, ...e.checked])))]

// 総当たりは左上から順に全部を測る
const sweepOrder = POINTS.map((p, i) => [i, p[1] * 2 + p[0]] as const)
  .sort((a, b) => a[1] - b[1])
  .map(([i]) => i)

export function BruteVsHnsw() {
  const tr = useTr()
  const [run, setRun] = useState(0)
  const total = POINTS.length
  const rows = [
    { label: tr('総当たり', 'Brute force'), count: total, tone: 'bg-ink/45' },
    { label: 'HNSW', count: HNSW_RUN.distanceCount, tone: 'bg-teal' },
  ]

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12.5px] font-bold text-mute">
          {tr('', 'Find the point nearest to ')}
          <span className="text-coral">＋</span>
          {tr(` の位置に一番近い点を、${total} 点の中から探す`, `, among ${total} points`)}
        </span>
        <FigButton onClick={() => setRun((r) => r + 1)}>
          <PiArrowCounterClockwiseBold />
          {tr('もう一度', 'Replay')}
        </FigButton>
      </div>

      <Legend items={['query', 'visited', 'entry', 'path', 'found']} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title={tr('総当たり', 'Brute force')} sub={tr('全部の点と距離を測って比べる', 'measure every point and compare')}>
          <Plot points={POINTS} query={QUERY} sweep={{ order: sweepOrder, duration: 2.4, key: run }} tones={{ [TRUTH]: 'truth' }} label={tr('総当たりで全点を測る図', 'Brute force measuring every point')} />
        </Panel>
        <Panel title="HNSW" sub={tr('近い点へ飛び移りながら、一部だけ測る', 'hop toward the target, measuring only some')}>
          <Plot
            key={run}
            points={POINTS}
            query={QUERY}
            path={routeEdges}
            tones={Object.fromEntries([...measured.map((n) => [n, 'visited']), [route[0], 'entry'], [HNSW_RUN.result[0], 'found']])}
            label={tr('HNSW で一部の点だけを測る図', 'HNSW measuring only some points')}
          />
        </Panel>
      </div>

      <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
        <span className="text-[12px] font-bold text-mute">{tr('距離を測った回数', 'Distances measured')}</span>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[72px_minmax(0,1fr)_44px] items-center gap-3">
            <span className="text-[12.5px] font-bold">{r.label}</span>
            <span className="h-[10px] overflow-hidden rounded-full bg-ink/[0.06]">
              <motion.span
                key={`${r.label}-${run}`}
                className={`block h-full rounded-full ${r.tone}`}
                initial={{ width: 0 }}
                animate={{ width: `${(r.count / total) * 100}%` }}
                transition={{ duration: r.count === total ? 2.4 : 0.8, ease: 'easeOut' }}
              />
            </span>
            <span className="text-right font-mono text-[12.5px] font-bold tabular-nums">{r.count}</span>
          </div>
        ))}
        <p className="pt-2 text-[13.5px] font-semibold leading-[1.7]">
          {tr(
            `どちらも同じ点にたどり着く。HNSW は ${total} 点のうち ${HNSW_RUN.distanceCount} 点しか測っていない。点が 100 万個になると、この差が何桁にもなる。`,
            `Both reach the same point. HNSW measured only ${HNSW_RUN.distanceCount} of the ${total} points. With a million points, the gap grows by orders of magnitude.`,
          )}
        </p>
      </div>
    </FigureFrame>
  )
}

function Panel({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-[10px] border border-ink/10 bg-tile p-3">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-[13px] font-extrabold">{title}</span>
        <span className="text-[11.5px] text-mute">{sub}</span>
      </span>
      {children}
    </div>
  )
}
