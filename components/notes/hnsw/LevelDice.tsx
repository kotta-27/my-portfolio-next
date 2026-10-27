'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PiDiceFiveBold } from 'react-icons/pi'
import { FigButton, FigureFrame } from '@/components/notes/FigureFrame'
import { rng } from '@/components/notes/hnsw/hnsw'

const N = 10000
const MS = [4, 8, 16] as const

/** 各点の層を floor(-ln(U) / ln(M)) で引いたとき、層 l 以上に載る点の数 */
function simulate(M: number, seed: number) {
  const r = rng(seed)
  const top = Array.from({ length: N }, () => Math.floor(-Math.log(1 - r()) / Math.log(M)))
  const max = Math.max(...top)
  return Array.from({ length: max + 1 }, (_, l) => top.filter((t) => t >= l).length)
}

export function LevelDice() {
  const [M, setM] = useState<(typeof MS)[number]>(4)
  const [seed, setSeed] = useState(1)
  const counts = useMemo(() => simulate(M, seed * 7919 + M), [M, seed])
  const layers = counts.map((c, l) => ({ l, c, expect: N / M ** l })).reverse()

  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="M">
          <span className="text-[12px] font-bold text-mute">M =</span>
          {MS.map((m) => (
            <FigButton key={m} active={M === m} onClick={() => setM(m)}>
              {m}
            </FigButton>
          ))}
        </div>
        <FigButton onClick={() => setSeed((s) => s + 1)}>
          <PiDiceFiveBold />
          {N.toLocaleString()} 点を振り直す
        </FigButton>
      </div>

      <div className="flex flex-col gap-[6px]">
        {layers.map(({ l, c, expect }) => (
          <div key={l} className="grid grid-cols-[44px_minmax(0,1fr)_120px] items-center gap-3">
            <span className="text-[12px] font-extrabold">層 {l}</span>
            <span className="flex h-[22px] items-center justify-center">
              <motion.span
                className={`block h-full rounded-[4px] ${l === 0 ? 'bg-ink/45' : 'bg-teal'}`}
                initial={false}
                animate={{ width: `${Math.max((c / N) * 100, 0.6)}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 28 }}
              />
            </span>
            <span className="font-mono text-[11.5px] tabular-nums">
              <span className="font-bold">{c.toLocaleString()}</span>
              <span className="text-mute"> / 期待 {expect >= 10 ? Math.round(expect).toLocaleString() : expect.toFixed(1)}</span>
            </span>
          </div>
        ))}
      </div>

      <p className="border-t border-ink/10 pt-4 text-[13.5px] font-semibold leading-[1.75]">
        1 つ上の層に載る確率はいつも 1/{M}。だから層が 1 つ上がるごとに点はおよそ 1/{M} に減り、全体は {N.toLocaleString()} 点でも層の数は {counts.length} 段ほどで済む。層の数は点の数の対数（log）でしか増えない。
      </p>
    </FigureFrame>
  )
}
