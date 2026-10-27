'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PiHandGrabbingBold } from 'react-icons/pi'
import { FigureFrame, StepNav } from '@/components/notes/FigureFrame'
import { useStepper } from '@/components/notes/useStepper'
import { Legend } from '@/components/notes/hnsw/Plot'
import { LayerGrid2D } from '@/components/notes/hnsw/LayerGrid2D'
import { GRAPH, HNSW_RUN, POINTS } from '@/components/notes/hnsw/demo'

// Three.js は重いので、この図が描かれるときだけ読み込む
const Layer3DCanvas = dynamic(() => import('@/components/notes/hnsw/Layer3DCanvas'), {
  ssr: false,
  loading: () => <div className="grid h-[360px] place-items-center text-[12px] text-mute sm:h-[460px]">3D を読み込み中…</div>,
})

const LAYERS = HNSW_RUN.layers // 上の層から順
const STEPS = LAYERS.length + 2

export function LayerSearch() {
  const s = useStepper(STEPS, 2200)
  const [no3d, setNo3d] = useState(false)

  const note =
    s.step === 0
      ? `同じ ${POINTS.length} 点を、層に分けて重ねている。一番下（層 0）には全部の点、上の層ほど点が少なく、つながりは遠くまで届く。縦の点線は、同じ点が上の層にも載っていることを表す。`
      : s.step === STEPS - 1
        ? `層 0 で着いた点は、本当に一番近い点と同じ。測った回数は全部で ${HNSW_RUN.distanceCount} 回。層を使わずに層 0 だけをたどったときは、たどり着けなかった。`
        : (() => {
            const l = LAYERS[s.step - 1]
            const hops = l.expands.length - 1
            if (l.layer === GRAPH.maxLevel) return `一番上の層 ${l.layer} の入口（黒い立方体）から始める。点が少ないので、大まかな方向だけ決める。`
            const moved = hops === 0 ? 'この層では隣に今より近い点がなく、移動せずに次の層へ。' : `${hops} 回移動して止まる。`
            if (l.layer === 0) return `最後に層 0（全部の点）で、すぐ近くを細かく探す。${moved}`
            return `上の層で止まった点の真下に降り、そこを入口にして層 ${l.layer} を貪欲にたどる。${moved}`
          })()

  return (
    <FigureFrame className="flex flex-col gap-4 p-4 sm:p-6">
      <Legend items={['query', 'entry', 'current', 'visited', ['path', 'たどった道（層の間は真下へ降りる）'], 'same']} />
      <div className="relative overflow-hidden rounded-[10px] border border-ink/10 bg-tile">
        {no3d ? (
          <LayerGrid2D step={s.step} last={s.step === STEPS - 1} />
        ) : (
          <>
            <Layer3DCanvas step={s.step} onFail={() => setNo3d(true)} />
            <span className="pointer-events-none absolute bottom-2 right-3 flex items-center gap-[5px] text-[11px] font-semibold text-mute">
              <PiHandGrabbingBold />
              ドラッグで回せる
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
