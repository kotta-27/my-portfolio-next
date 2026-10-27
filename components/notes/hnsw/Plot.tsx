'use client'

import { motion } from 'framer-motion'
import type { Vec } from '@/components/notes/hnsw/hnsw'

/*
 * 2 次元の点とつながりを描く。座標は 0〜1 を 0〜100 の viewBox に写す。
 * 色はトークン（fill-* / stroke-*）で付けるので、ダークモードでもそのまま読める。
 */

/*
 * 色と形の役割（凡例と同じ）
 *   まだ測っていない点 = 薄い灰の小さな点
 *   測った点           = 緑の輪（中は空）
 *   今いる点・着いた点 = 緑の大きな点
 *   入口               = 黒い四角
 *   探している場所     = 赤の ＋
 *   本当に一番近い点   = 赤の破線の輪
 *   新しく入れる点     = 赤の点（挿入の図だけ）
 */
export type Tone = 'base' | 'faint' | 'visited' | 'current' | 'found' | 'truth' | 'entry' | 'new'

const NODE: Record<Tone, { r: number; cls: string }> = {
  faint: { r: 0.9, cls: 'fill-ink/15' },
  base: { r: 1.1, cls: 'fill-ink/30' },
  visited: { r: 1.5, cls: 'fill-tile stroke-teal stroke-[0.6]' },
  current: { r: 2.4, cls: 'fill-teal stroke-tile stroke-[0.6]' },
  entry: { r: 2.2, cls: 'fill-ink stroke-tile stroke-[0.5]' },
  found: { r: 2.4, cls: 'fill-teal stroke-tile stroke-[0.6]' },
  truth: { r: 3.4, cls: 'fill-none stroke-coral stroke-[0.7] [stroke-dasharray:1.4_0.9]' },
  new: { r: 2.4, cls: 'fill-coral stroke-tile stroke-[0.6]' },
}

export type PlotProps = {
  points: Vec[]
  /** 描く点。省略時は全部 */
  nodes?: number[]
  edges?: [number, number][]
  /** 強調する線（探索でたどった道・新しくつないだ線など）。順番に伸びる */
  path?: [number, number][]
  /** 点ごとの見た目。指定の無い点は base */
  tones?: Record<number, Tone>
  /** 測った相手への細い線（今いる点から） */
  probes?: [number, number][]
  /** 消えた線（切られたつながり） */
  cut?: [number, number][]
  query?: Vec
  /** 外側から点を指す（新しい点など） */
  extra?: { at: Vec; tone: Tone }[]
  /** 点が順に光るアニメーション（総当たり）。秒 */
  sweep?: { order: number[]; duration: number; key: number }
  className?: string
  label?: string
}

const X = (v: Vec) => v[0] * 100
const Y = (v: Vec) => v[1] * 100

export function Plot({ points, nodes, edges = [], path = [], tones = {}, probes = [], cut = [], query, extra = [], sweep, className = '', label }: PlotProps) {
  const shown = nodes ?? points.map((_, i) => i)
  const sweepIndex = new Map(sweep?.order.map((n, i) => [n, i]))
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={label} className={`block h-auto w-full ${className}`}>
      {edges.map(([a, b]) => (
        <line key={`e${a}-${b}`} x1={X(points[a])} y1={Y(points[a])} x2={X(points[b])} y2={Y(points[b])} className="stroke-ink/15" strokeWidth={0.35} />
      ))}
      {cut.map(([a, b]) => (
        <motion.line
          key={`c${a}-${b}`}
          x1={X(points[a])}
          y1={Y(points[a])}
          x2={X(points[b])}
          y2={Y(points[b])}
          className="stroke-coral"
          strokeWidth={0.6}
          strokeDasharray="1.2 1"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      ))}
      {probes.map(([a, b]) => (
        <motion.line
          key={`p${a}-${b}`}
          x1={X(points[a])}
          y1={Y(points[a])}
          x2={X(points[b])}
          y2={Y(points[b])}
          className="stroke-teal/60"
          strokeWidth={0.45}
          strokeDasharray="1 0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      ))}
      {path.map(([a, b], i) => (
        <motion.line
          key={`t${a}-${b}-${i}`}
          x1={X(points[a])}
          y1={Y(points[a])}
          x2={X(points[b])}
          y2={Y(points[b])}
          className="stroke-teal"
          strokeWidth={0.9}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, delay: i * 0.12 }}
        />
      ))}
      {query && (
        <g>
          <circle cx={X(query)} cy={Y(query)} r={3.6} className="fill-coral/15" />
          <path
            d={`M${X(query) - 2} ${Y(query)}H${X(query) + 2}M${X(query)} ${Y(query) - 2}V${Y(query) + 2}`}
            className="stroke-coral"
            strokeWidth={0.8}
            strokeLinecap="round"
          />
        </g>
      )}
      {shown.map((i) => {
        const tone = NODE[tones[i] ?? 'base']
        const order = sweepIndex.get(i)
        // 総当たり: 1 点ずつ「測った」色に変わっていく
        if (sweep && order !== undefined) {
          return (
            <g key={`n${i}-${sweep.key}`}>
              <circle cx={X(points[i])} cy={Y(points[i])} r={NODE.base.r} className={NODE.base.cls} />
              <motion.circle
                cx={X(points[i])}
                cy={Y(points[i])}
                className="fill-tile stroke-teal stroke-[0.6]"
                initial={{ r: 0 }}
                animate={{ r: NODE.visited.r }}
                transition={{ delay: (order / sweep.order.length) * sweep.duration, duration: 0.12 }}
              />
            </g>
          )
        }
        if (tones[i] === 'entry') {
          return <rect key={`n${i}`} x={X(points[i]) - tone.r} y={Y(points[i]) - tone.r} width={tone.r * 2} height={tone.r * 2} rx={0.4} className={tone.cls} />
        }
        return <circle key={`n${i}`} cx={X(points[i])} cy={Y(points[i])} r={tone.r} className={`transition-all duration-300 ${tone.cls}`} />
      })}
      {extra.map((e, i) => (
        <motion.circle
          key={`x${i}`}
          cx={X(e.at)}
          cy={Y(e.at)}
          className={NODE[e.tone].cls}
          initial={{ r: 0 }}
          animate={{ r: NODE[e.tone].r }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        />
      ))}
    </svg>
  )
}

/** 図の凡例。その図で使っている役割だけを並べる */
export type LegendItem = Tone | 'query' | 'path' | 'cut' | 'edge'

const LEGEND_TEXT: Record<LegendItem, string> = {
  base: 'まだ測っていない点',
  faint: '点',
  visited: '距離を測った点',
  current: '今いる点',
  found: '着いた点',
  entry: '入口',
  truth: '本当に一番近い点',
  new: '新しく入れる点',
  query: '探している場所',
  path: 'たどった道',
  cut: '切られたつながり',
  edge: 'つながり',
}

function Swatch({ item }: { item: LegendItem }) {
  return (
    <svg viewBox="0 0 10 10" className="h-[14px] w-[14px] shrink-0" aria-hidden>
      {item === 'query' && <path d="M2 5H8M5 2V8" className="stroke-coral" strokeWidth={1.4} strokeLinecap="round" />}
      {item === 'path' && <line x1={1} y1={5} x2={9} y2={5} className="stroke-teal" strokeWidth={1.8} strokeLinecap="round" />}
      {item === 'edge' && <line x1={1} y1={5} x2={9} y2={5} className="stroke-ink/30" strokeWidth={0.8} />}
      {item === 'cut' && <line x1={1} y1={5} x2={9} y2={5} className="stroke-coral" strokeWidth={1.2} strokeDasharray="1.6 1.2" />}
      {item === 'entry' && <rect x={2} y={2} width={6} height={6} rx={0.8} className="fill-ink" />}
      {item === 'truth' && <circle cx={5} cy={5} r={3.6} className="fill-none stroke-coral" strokeWidth={1} strokeDasharray="1.8 1.1" />}
      {item === 'visited' && <circle cx={5} cy={5} r={2.6} className="fill-tile stroke-teal" strokeWidth={1} />}
      {(item === 'current' || item === 'found') && <circle cx={5} cy={5} r={3.4} className="fill-teal" />}
      {item === 'new' && <circle cx={5} cy={5} r={3.4} className="fill-coral" />}
      {(item === 'base' || item === 'faint') && <circle cx={5} cy={5} r={1.8} className="fill-ink/30" />}
    </svg>
  )
}

/** 項目は役割だけ、または [役割, その図での呼び方] */
export function Legend({ items }: { items: (LegendItem | [LegendItem, string])[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-[6px]">
      {items.map((it) => {
        const [item, text] = Array.isArray(it) ? it : [it, LEGEND_TEXT[it]]
        return (
          <li key={item} className="flex items-center gap-[6px] text-[11.5px] font-semibold text-mute">
            <Swatch item={item} />
            {text}
          </li>
        )
      })}
    </ul>
  )
}
