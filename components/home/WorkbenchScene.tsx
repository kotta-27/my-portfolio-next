'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Workbench } from '@/lib/bricks/workbench'

type Props = {
  /** 作品の説明（読み上げ用） */
  label: string
  /** 右下に添える操作のヒント */
  hint: string
}

const isDark = () => document.documentElement.classList.contains('dark')

/**
 * ヒーローの 3D シーン。three は大きいので、ここが画面に入ってから読み込む。
 * 読み込むまでと、WebGL が使えないときは、同じ構図で描いておいた静止画を出す。
 */
export function WorkbenchScene({ label, hint }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let bench: Workbench | undefined
    let cancelled = false

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return

    import('@/lib/bricks/workbench').then(({ mountWorkbench }) => {
      if (cancelled) return
      bench = mountWorkbench(el, {
        theme: isDark() ? 'dark' : 'light',
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        onReady: () => setReady(true),
      })
    })

    // ライト / ダークの切り替えに合わせて色を変える
    const mo = new MutationObserver(() => bench?.setTheme(isDark() ? 'dark' : 'light'))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      cancelled = true
      mo.disconnect()
      bench?.dispose()
    }
  }, [])

  return (
    <div role="img" aria-label={label} className="relative h-full w-full">
      <Image
        src="/hero-workbench.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 60vw, 100vw"
        className={`object-contain transition-opacity duration-500 ${ready ? 'opacity-0' : 'opacity-100'}`}
      />
      <div ref={host} className="absolute inset-0" />
      <span className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-tile/90 px-3 py-[6px] text-[11.5px] font-bold text-mute shadow-[0_1px_2px_rgb(var(--shadow-rgb)/0.12)] sm:bottom-6 sm:right-8">
        {hint}
      </span>
    </div>
  )
}
