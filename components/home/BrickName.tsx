'use client'

import { useEffect, useRef, useState } from 'react'
import type { NameBench } from '@/lib/bricks/name'

type Props = {
  /** 名前の文字（3D が出るまでと、WebGL が使えないときに見せる。読み上げにも使う）。first が上の段、last が下の段 */
  first: string
  last: string
  /** 押せることを伝える小さな札と、ボタンの読み上げ */
  hint: string
  /** 横に並ぶものがないとき、名前を大きく取る */
  wide?: boolean
}

const isDark = () => document.documentElement.classList.contains('dark')

/**
 * ヒーローの名前。ブロックで組んだ「KOTA / MIZUNO」の 2 段と、それを壊す仕掛けを、文字と同じ場所に重ねる。
 * ページをスクロールするとラックが下がって歯車が回り、ハンマーが落ちて名前が崩れる。崩れたブロックはスクロールに付いて下り、
 * 「作ったもの」の見出しの上の小さな英字（data-brick-word="WORKS"）に組み上がる。CAREER・OUTPUT の英字も同じ canvas にブロックで組む。戻すと名前に戻る。クリックでも崩れる。
 * スクロールの進みは、ヒーローを画面に固定している区間（app/page.tsx の data-hero-pin）の中での位置から出す。
 * 文字は最初から描いてある（LCP 要素）ので、3D の準備ができてから入れ替える。枠の大きさは変えない。
 * canvas は画面全体に固定して重ねる（崩れたブロックが「作ったもの」の上の「WORKS」まで下りていくのを、同じ 1 枚に描くため）。操作は枠の上のボタンで受ける。
 */
export function BrickName({ first, last, hint, wide = false }: Props) {
  const host = useRef<HTMLSpanElement>(null)
  const hit = useRef<HTMLButtonElement>(null)
  const [ready, setReady] = useState(false)
  const [broken, setBroken] = useState(false)

  useEffect(() => {
    const el = host.current
    const btn = hit.current
    if (!el || !btn) return
    let bench: NameBench | undefined
    let cancelled = false

    // 固定区間をどこまで進んだか（0〜1）。余白（data-hero-runway）の高さが、ラックの端から端までにあたる
    const pin = el.closest<HTMLElement>('[data-hero-pin]')
    const stage = pin?.querySelector<HTMLElement>('[data-hero-stage]')
    const runway = pin?.querySelector<HTMLElement>('[data-hero-runway]')
    const onScroll = () => {
      if (!bench || !pin || !stage || !runway) return
      const length = runway.offsetHeight // 「動きを減らす」設定では余白を出さないので 0
      if (!length) return
      const stickAt = parseFloat(getComputedStyle(stage).top) || 0
      // 固定が終わった後も 1 を超えて増える（崩れたブロックがロボットまで下りる道のりに使う）
      bench.setProgress((stickAt - pin.getBoundingClientRect().top) / length, length)
    }

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return

    import('@/lib/bricks/name').then(({ mountName }) => {
      if (cancelled) return
      bench = mountName(el, btn, {
        theme: isDark() ? 'dark' : 'light',
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        onReady: () => setReady(true),
        onBreak: () => setBroken(true),
        // 見出しの小さな英字（WORKS / CAREER / OUTPUT）。WORKS は崩れた名前のブロックの行き先になる
        words: [...document.querySelectorAll<HTMLElement>('[data-brick-word]')].flatMap((el) => {
          const slot = el.querySelector<HTMLElement>('[data-word-slot]')
          return slot && el.dataset.brickWord ? [{ text: el.dataset.brickWord, slot, fallback: el.querySelector<HTMLElement>('[data-word-text]') }] : []
        }),
      })
      onScroll()
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const mo = new MutationObserver(() => bench?.setTheme(isDark() ? 'dark' : 'light'))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      mo.disconnect()
      bench?.dispose()
    }
  }, [])

  return (
    // 枠の縦横比は、ブロックで組んだ 2 段の幅と高さ（lib/bricks/name.ts）に合わせてある
    <span className={`relative block aspect-[248/122] w-full ${wide ? 'max-w-[780px]' : 'max-w-[540px]'}`}>
      <span className={`absolute left-0 top-0 transition-opacity duration-300 ${ready ? 'opacity-0' : 'opacity-100'}`}>
        {first}
        <span className="block font-medium text-mute">{last}</span>
      </span>
      <span ref={host} aria-hidden className="pointer-events-none fixed inset-0 z-40" />
      <button
        ref={hit}
        type="button"
        aria-label={hint}
        className="absolute inset-0 cursor-pointer touch-pan-y rounded-[12px] bg-transparent"
      />
      {ready && (
        <span
          aria-hidden
          className={`pointer-events-none absolute -top-8 right-[10%] hidden whitespace-nowrap sm:block rounded-full bg-tile/90 px-3 py-[6px] text-[11.5px] font-bold leading-none tracking-normal text-mute shadow-[0_1px_2px_rgb(var(--shadow-rgb)/0.12)] transition-opacity duration-500 ${broken ? 'opacity-0' : 'opacity-100'}`}
        >
          {hint}
        </span>
      )}
    </span>
  )
}
