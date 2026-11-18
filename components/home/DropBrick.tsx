'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

/**
 * 見出しに添える部品。スクロールして画面に入ると、上から落ちてきて「カチッ」とはまる。
 * JS が動くまでは普通に置いておき、まだ画面の外にあるときだけ浮かせて待つ（JS が無くても消えない）。
 */
export function DropBrick({ src }: { src: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState<'idle' | 'armed' | 'in'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // 最初から見えている（ページの途中で再読み込みした等）なら動かさない
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
    setState('armed')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setState('in')
        io.disconnect()
      },
      { rootMargin: '0px 0px -18% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} aria-hidden className={`brick-drop relative -mb-1 -ml-2 block h-[64px] w-[64px] sm:h-[72px] sm:w-[72px] ${state === 'armed' ? 'brick-drop--armed' : ''} ${state === 'in' ? 'brick-drop--in' : ''}`}>
      <span className="brick-drop__shadow" />
      <Image src={src} alt="" width={72} height={72} className="brick-drop__part relative h-full w-full" />
    </span>
  )
}
