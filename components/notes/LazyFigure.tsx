'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'

/**
 * ノートの動く図を、画面に近づいてから読み込む。
 * 図のコード（three などを含む）はページを開いた時点では読み込まず、図の 1 画面ほど手前まで来たら読み込んで描く。
 * それまでは、図とほぼ同じ高さの枠（size）を置いて、読み込んだときにページがずれないようにする。
 */
export function lazyFigure(load: () => Promise<ComponentType>, size: string) {
  function LazyFigure() {
    const box = useRef<HTMLDivElement>(null)
    const [Fig, setFig] = useState<ComponentType | null>(null)

    useEffect(() => {
      const el = box.current
      if (!el) return
      let cancelled = false
      const io = new IntersectionObserver(
        ([entry]) => {
          // 画面に近づいた。または、もう通り過ぎていた（読み込みが終わる前に下までスクロールした、ページの途中を開いた）
          if (!entry.isIntersecting && entry.boundingClientRect.bottom > 0) return
          io.disconnect()
          load().then((C) => {
            if (!cancelled) setFig(() => C)
          })
        },
        { rootMargin: '100% 0px' },
      )
      io.observe(el)
      return () => {
        cancelled = true
        io.disconnect()
      }
    }, [])

    if (Fig) return <Fig />
    return (
      <div ref={box} aria-busy="true" className={`grid w-full place-items-center rounded-[14px] bg-soft ${size}`}>
        <span aria-hidden className="h-[10px] w-[18px] animate-pulse rounded-[2px] bg-mute/30" />
      </div>
    )
  }
  return LazyFigure
}
