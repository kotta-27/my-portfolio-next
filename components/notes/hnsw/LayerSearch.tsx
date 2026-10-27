'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PiHandGrabbingBold } from 'react-icons/pi'
import { FigureFrame, StepNav } from '@/components/notes/FigureFrame'
import { useStepper } from '@/components/notes/useStepper'
import { Legend } from '@/components/notes/hnsw/Plot'
import { LayerGrid2D } from '@/components/notes/hnsw/LayerGrid2D'
import { GRAPH, HNSW_RUN, POINTS } from '@/components/notes/hnsw/demo'
import { useNoteLang, useTr } from '@/components/notes/i18n'

// Three.js は重いので、この図が描かれるときだけ読み込む
const Layer3DCanvas = dynamic(() => import('@/components/notes/hnsw/Layer3DCanvas'), {
  ssr: false,
  loading: () => <div className="grid h-[360px] place-items-center text-[12px] text-mute sm:h-[460px]">3D …</div>,
})

const LAYERS = HNSW_RUN.layers // 上の層から順
const STEPS = LAYERS.length + 2

export function LayerSearch() {
  const tr = useTr()
  const lang = useNoteLang()
  const s = useStepper(STEPS, 2200)
  const [no3d, setNo3d] = useState(false)

  const note =
    s.step === 0
      ? tr(
          `同じ ${POINTS.length} 点を、層に分けて重ねている。一番下（層 0）には全部の点、上の層ほど点が少なく、つながりは遠くまで届く。縦の点線は、同じ点が上の層にも載っていることを表す。`,
          `The same ${POINTS.length} points, split into stacked layers. The bottom (layer 0) has every point; higher layers have fewer points and their links reach farther. Vertical dotted lines mark the same point appearing on higher layers.`,
        )
      : s.step === STEPS - 1
        ? tr(
            `層 0 で着いた点は、本当に一番近い点と同じ。測った回数は全部で ${HNSW_RUN.distanceCount} 回。層を使わずに層 0 だけをたどったときは、たどり着けなかった。`,
            `The point reached on layer 0 is the true nearest. ${HNSW_RUN.distanceCount} distances measured in total. Walking layer 0 alone, without layers, never got there.`,
          )
        : (() => {
            const l = LAYERS[s.step - 1]
            const hops = l.expands.length - 1
            if (l.layer === GRAPH.maxLevel)
              return tr(
                `一番上の層 ${l.layer} の入口（黒い立方体）から始める。点が少ないので、大まかな方向だけ決める。`,
                `Start from the entry point (black cube) on the top layer, ${l.layer}. With few points, this only sets the rough direction.`,
              )
            const moved =
              hops === 0
                ? tr('この層では隣に今より近い点がなく、移動せずに次の層へ。', 'No neighbor on this layer is closer, so it moves on to the next layer without moving.')
                : tr(`${hops} 回移動して止まる。`, `It moves ${hops} times and stops.`)
            if (l.layer === 0) return tr(`最後に層 0（全部の点）で、すぐ近くを細かく探す。${moved}`, `Finally, on layer 0 (every point), search the immediate area in detail. ${moved}`)
            return tr(
              `上の層で止まった点の真下に降り、そこを入口にして層 ${l.layer} を貪欲にたどる。${moved}`,
              `Drop straight down from where the layer above stopped, and walk layer ${l.layer} greedily from there. ${moved}`,
            )
          })()

  return (
    <FigureFrame className="flex flex-col gap-4 p-4 sm:p-6">
      <Legend items={['query', 'entry', 'current', 'visited', ['path', 'たどった道（層の間は真下へ降りる）', 'path (drops straight down between layers)'], 'same']} />
      <div className="relative overflow-hidden rounded-[10px] border border-ink/10 bg-tile">
        {no3d ? (
          <LayerGrid2D step={s.step} last={s.step === STEPS - 1} />
        ) : (
          <>
            <Layer3DCanvas key={lang} step={s.step} lang={lang} onFail={() => setNo3d(true)} />
            <span className="pointer-events-none absolute bottom-2 right-3 flex items-center gap-[5px] text-[11px] font-semibold text-mute">
              <PiHandGrabbingBold />
              {tr('ドラッグで回せる', 'Drag to rotate')}
            </span>
          </>
        )}
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
