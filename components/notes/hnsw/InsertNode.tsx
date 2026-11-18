'use client'

import { FigureFrame, StepNav } from '@/components/notes/FigureFrame'
import { useStepper } from '@/components/notes/useStepper'
import { Legend, Plot, type PlotProps } from '@/components/notes/hnsw/Plot'
import { DEMO_EFC, DEMO_M, INSERT, inLayer, layerEdges } from '@/components/notes/hnsw/demo'
import type { Graph } from '@/components/notes/hnsw/hnsw'
import { useTr } from '@/components/notes/i18n'

const G = INSERT.graph
const T = INSERT.insertTrace as NonNullable<typeof INSERT.insertTrace>
const NEW = T.node
const POINTS = G.points

function edgesOf(g: Graph, l: number): [number, number][] {
  const seen = new Set<string>()
  const out: [number, number][] = []
  g.layers[l].forEach((ns, a) =>
    ns.forEach((b) => {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`
      if (seen.has(key)) return
      seen.add(key)
      out.push([a, b])
    }),
  )
  return out
}

const entryL1 = T.descent[T.descent.length - 1].result[0]
const link = (layer: number) => T.links.find((x) => x.layer === layer) as (typeof T.links)[number]

/** 0: 点を置く 1: 降りる 2: 層1の候補 3: 層1でつなぐ 4: 層0の候補 5: 層0でつなぐ */
const STEPS = 6

const NOTES: [string, string][] = [
  [
    `新しい点（赤い点）を入れる。まず載る層を決める。ここでは層 ${T.level} まで載ることになった。`,
    `Insert a new point (red). First, decide which layers it goes on. Here it reaches layer ${T.level}.`,
  ],
  [
    `それより上の層では、探索と同じように貪欲に降りるだけで、つながりは作らない。層 ${T.descent[T.descent.length - 1].layer} で止まった点が、層 ${T.level} の入口になる。`,
    `Above that, it just descends greedily as in a search, without creating links. The point where layer ${T.descent[T.descent.length - 1].layer} stops becomes the entry point of layer ${T.level}.`,
  ],
  [
    `層 ${T.level} で、新しい点に近い候補を最大 efConstruction（= ${DEMO_EFC}）個集める。ここでは層に点が少ないので ${link(1).candidates.length} 個。`,
    `On layer ${T.level}, gather up to efConstruction (= ${DEMO_EFC}) candidates near the new point. This layer has few points, so ${link(1).candidates.length} here.`,
  ],
  [
    `候補のうち近い M（= ${DEMO_M}）個とつなぐ（両方向）。つながりが上限の ${DEMO_M} 本を超えた相手は、一番遠いつながりを 1 本切る（赤い点線）。`,
    `Link to the M (= ${DEMO_M}) closest candidates, both ways. Any neighbor that now has more than ${DEMO_M} links drops its farthest one (dashed red).`,
  ],
  [`層 0 に降りて、同じように候補を ${link(0).candidates.length} 個集める。`, `Go down to layer 0 and gather ${link(0).candidates.length} candidates the same way.`],
  [
    `近い ${DEMO_M} 個とつなぐ。層 0 だけは上限が 2M（= ${DEMO_M * 2}）本と多い。こうして、点を入れるたびに「近くとのつながり」が育っていく。`,
    `Link to the ${DEMO_M} closest. Layer 0 alone allows more links: 2M (= ${DEMO_M * 2}). This is how links to nearby points grow with every insertion.`,
  ],
]

function panel(layer: 0 | 1, step: number): PlotProps {
  const phaseCandidates = layer === 1 ? 2 : 4
  const phaseLink = layer === 1 ? 3 : 5
  const l = link(layer)
  const linked = step >= phaseLink
  const tones: PlotProps['tones'] = {}
  if (step >= phaseCandidates) l.candidates.forEach((n) => (tones[n] = 'visited'))
  if (linked) l.chosen.forEach((n) => (tones[n] = 'current'))
  if (layer === 1 && step >= 1 && !linked) tones[entryL1] = 'entry'
  const nodes = layer === 1 ? [...inLayer(1), NEW] : POINTS.map((_, i) => i)
  return {
    points: POINTS,
    nodes,
    edges: linked ? edgesOf(G, layer).filter(([a, b]) => a !== NEW && b !== NEW) : layerEdges(layer),
    path: linked ? l.chosen.map((n) => [NEW, n] as [number, number]) : [],
    cut: linked ? l.pruned.filter((p) => p.dropped !== NEW).map((p) => [p.node, p.dropped] as [number, number]) : [],
    tones: { ...tones, [NEW]: 'new' },
  }
}

export function InsertNode() {
  const tr = useTr()
  const s = useStepper(STEPS, 2000)
  return (
    <FigureFrame className="flex flex-col gap-5 p-4 sm:p-6">
      <Legend
        items={['new', ['entry', '層 1 の入口', 'layer 1 entry'], ['visited', '集めた候補', 'candidates'], ['current', 'つなぐ相手', 'linked to'], ['path', '新しいつながり', 'new links'], 'cut', 'edge']}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {([1, 0] as const).map((layer) => {
          const active = (layer === 1 && s.step >= 1 && s.step <= 3) || (layer === 0 && s.step >= 4)
          return (
            <div key={layer} className={`flex min-w-0 flex-col gap-2 rounded-[10px] border-2 bg-tile p-2 transition-colors duration-300 ${active ? 'border-teal' : 'border-ink/10'}`}>
              <span className="flex items-baseline justify-between px-1">
                <span className="text-[12.5px] font-extrabold">{tr(`層 ${layer}`, `Layer ${layer}`)}</span>
                <span className="font-mono text-[10.5px] text-mute">
                  {tr(`つながりの上限 ${layer === 0 ? DEMO_M * 2 : DEMO_M} 本`, `max ${layer === 0 ? DEMO_M * 2 : DEMO_M} links`)}
                </span>
              </span>
              <Plot {...panel(layer, s.step)} label={tr(`層 ${layer} への挿入`, `Insertion into layer ${layer}`)} />
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-4 border-t border-ink/10 pt-4">
        <p aria-live="polite" className="min-h-[3.4em] text-[13.5px] font-semibold leading-[1.7]">
          {tr(...NOTES[s.step])}
        </p>
        <StepNav step={s.step} count={STEPS} onPrev={s.prev} onNext={s.next} onSelect={s.setStep} />
      </div>
    </FigureFrame>
  )
}
