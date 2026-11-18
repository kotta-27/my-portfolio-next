'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FigureFrame } from '@/components/notes/FigureFrame'
import { useTr } from '@/components/notes/i18n'

/*
 * この記事の HNSW 実装（components/notes/hnsw/hnsw.ts）で実際に測った値。
 * 16 次元の一様乱数 3,000 点、M = 8、efConstruction = 40。クエリ 50 個の平均で、正解は総当たりの上位 10 件。
 * 計算に 1 秒ほどかかるので、ブラウザでは測り直さず結果だけを持つ。
 */
const N = 3000
const ROWS = [
  { ef: 10, recall: 0.712, count: 157 },
  { ef: 16, recall: 0.818, count: 210 },
  { ef: 24, recall: 0.882, count: 267 },
  { ef: 32, recall: 0.934, count: 323 },
  { ef: 48, recall: 0.964, count: 428 },
  { ef: 64, recall: 0.982, count: 522 },
  { ef: 96, recall: 0.99, count: 688 },
  { ef: 128, recall: 0.996, count: 836 },
]

// グラフの座標（横: 測った回数 0〜900、縦: recall 0.65〜1）
const gx = (c: number) => 8 + (c / 900) * 88
const gy = (r: number) => 92 - ((r - 0.65) / 0.35) * 84

export function EfTradeoff() {
  const tr = useTr()
  const [i, setI] = useState(3)
  const row = ROWS[i]

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <label className="flex flex-col gap-2">
        <span className="flex items-baseline justify-between">
          <span className="text-[12.5px] font-bold text-mute">{tr('efSearch（最下層で持っておく候補の数）', 'efSearch (candidates kept on the bottom layer)')}</span>
          <span className="font-mono text-[20px] font-extrabold tabular-nums">{row.ef}</span>
        </span>
        <input
          type="range"
          min={0}
          max={ROWS.length - 1}
          step={1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          className="w-full accent-teal"
          aria-valuetext={`efSearch ${row.ef}`}
        />
      </label>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Meter label={tr('正解できた割合（recall@10）', 'Share found (recall@10)')} value={`${(row.recall * 100).toFixed(1)}%`} ratio={row.recall} tone="bg-teal" />
          <Meter label={tr(`距離を測った回数（総当たりは ${N.toLocaleString()} 回）`, `Distances measured (brute force: ${N.toLocaleString()})`)} value={tr(`${row.count} 回`, `${row.count}`)} ratio={row.count / N} tone="bg-ink/45" />
          <p className="text-[13px] leading-[1.75] text-ink/80">
            {tr(
              `総当たりの ${((row.count / N) * 100).toFixed(0)}% の計算で、本当の上位 10 件のうち平均 ${(row.recall * 10).toFixed(1)} 件を当てている。`,
              `With ${((row.count / N) * 100).toFixed(0)}% of the brute-force work, it finds ${(row.recall * 10).toFixed(1)} of the true top 10 on average.`,
            )}
          </p>
        </div>

        <div className="rounded-[10px] border border-ink/10 bg-tile p-3">
          <svg viewBox="0 0 100 100" className="block h-auto w-full" role="img" aria-label={tr('efSearch ごとの recall と計算量', 'Recall and cost for each efSearch')}>
            {[0.7, 0.8, 0.9, 1].map((r) => (
              <g key={r}>
                <line x1={8} x2={96} y1={gy(r)} y2={gy(r)} className="stroke-ink/10" strokeWidth={0.3} />
                <text x={6.5} y={gy(r) + 1.2} textAnchor="end" className="fill-mute font-mono text-[3px]">
                  {r.toFixed(1)}
                </text>
              </g>
            ))}
            <polyline points={ROWS.map((r) => `${gx(r.count)},${gy(r.recall)}`).join(' ')} className="fill-none stroke-teal/50" strokeWidth={0.6} />
            {ROWS.map((r, k) => (
              <circle key={r.ef} cx={gx(r.count)} cy={gy(r.recall)} r={k === i ? 0 : 1} className="fill-teal/60" />
            ))}
            <motion.circle initial={false} animate={{ cx: gx(row.count), cy: gy(row.recall) }} r={2.2} className="fill-teal stroke-tile stroke-[0.6]" />
            <text x={96} y={98} textAnchor="end" className="fill-mute text-[3px]">
              {tr('測った回数 →', 'distances measured →')}
            </text>
            <text x={8} y={5} className="fill-mute text-[3px]">
              ↑ recall
            </text>
          </svg>
        </div>
      </div>

      <p className="border-t border-ink/10 pt-4 text-[13.5px] font-semibold leading-[1.75]">
        {tr(
          'efSearch を上げると、候補を広く持つぶん取りこぼしが減り、そのぶん計算が増える。最初は少し上げるだけで大きく良くなり、100% に近づくほど効きが鈍る。',
          'Raising efSearch keeps a wider set of candidates, so fewer results are missed, at the cost of more computation. A small increase helps a lot at first, and the gains slow down as recall approaches 100%.',
        )}
      </p>
    </FigureFrame>
  )
}

function Meter({ label, value, ratio, tone }: { label: string; value: string; ratio: number; tone: string }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-bold text-mute">{label}</span>
        <span className="font-mono text-[14px] font-extrabold tabular-nums">{value}</span>
      </span>
      <span className="h-[10px] overflow-hidden rounded-full bg-ink/[0.06]">
        <motion.span className={`block h-full rounded-full ${tone}`} initial={false} animate={{ width: `${ratio * 100}%` }} transition={{ type: 'spring', stiffness: 220, damping: 30 }} />
      </span>
    </div>
  )
}
