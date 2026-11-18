'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { SiZenn } from 'react-icons/si'
import { PiArrowRightBold, PiEnvelopeSimpleBold, PiXBold } from 'react-icons/pi'
import type { IconType } from 'react-icons'
import type { Lang } from '@/types'
import { town, townLinks, type TownLink } from '@/data/town'
import { SECTIONS, isSection, type Section } from '@/lib/town/sections'
import type { TownBench } from '@/lib/town/scene'
import type { PanelContent } from '@/components/town/Panels'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'

type Props = {
  lang: Lang
  panels: Record<Section, PanelContent>
  workImages: string[]
  careerLogos: string[]
}

/** 手前の歩道の看板のアイコン。3D の板に描くため、隠した DOM に描いて SVG を読み取る */
const LINK_ICONS: Record<TownLink['id'], IconType> = { x: FaXTwitter, github: FaGithub, zenn: SiZenn, mail: PiEnvelopeSimpleBold }

/** パネルの見出しの横の小さな四角。建物の色 */
const DOT: Record<Section, string> = {
  about: 'bg-ink',
  works: 'bg-teal',
  career: 'bg-mute',
  output: 'bg-mustard',
  contact: 'bg-coral',
}

/** WebGL が使えないとき、街の代わりに出すリンク */
const FALLBACK: { id: Section; href: string }[] = [
  { id: 'works', href: '/projects' },
  { id: 'career', href: '/career' },
  { id: 'output', href: '/output' },
  { id: 'contact', href: 'mailto:mizukou27@gmail.com' },
]

/**
 * トップの「レゴの街」。画面いっぱいに街を描き、建物（左上のボタンでも）を選ぶと人形が歩いていき、着くと中身のパネルが開く。
 * URL の #at-works などで、その建物から始まる（下の一覧の #projects などのアンカーとぶつからないよう、at- を付ける）。
 * three は大きいので、ここが描かれてから読み込む。WebGL が使えないときは、街の代わりに各ページ（/projects など）へのリンクを並べる。
 */
export function TownView({ lang, panels, workImages, careerLogos }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLElement>(null)
  const icons = useRef<HTMLDivElement>(null)
  const bench = useRef<TownBench | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'none'>('loading')
  const [open, setOpen] = useState<Section | null>(null)
  const [target, setTarget] = useState<Section | null>(null)
  const t = town[lang]

  const go = useCallback((id: Section) => {
    setTarget(id)
    if (location.hash !== `#at-${id}`) history.replaceState(null, '', `#at-${id}`)
    bench.current?.goTo(id)
  }, [])
  const close = useCallback(() => {
    // ✕ はパネルと一緒に消えるので、フォーカスを街へ戻す
    host.current?.focus({ preventScroll: true })
    setOpen(null)
    setTarget(null)
    if (location.hash.startsWith('#at-')) history.replaceState(null, '', location.pathname + location.search)
  }, [])

  useEffect(() => {
    const el = host.current
    if (!el) return
    let cancelled = false
    const probe = document.createElement('canvas')
    if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) {
      setState('none')
      return
    }
    // 看板の文字を正しい書体で書くため、Web フォントを待ってから組む
    Promise.all([import('@/lib/town/scene'), document.fonts.ready]).then(([{ mountTown }]) => {
      if (cancelled) return
      bench.current = mountTown(el, {
        labels: t.buildings,
        links: townLinks.map((l) => ({ ...l, icon: icons.current?.querySelector(`[data-icon="${l.id}"]`)?.innerHTML ?? '' })),
        onLink: (href) => {
          if (href.startsWith('mailto:')) location.href = href
          else window.open(href, '_blank', 'noopener,noreferrer')
        },
        workImages,
        careerLogos,
        focusDim: true,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        onArrive: (id) => setOpen(id),
        onLeave: (toStreet) => {
          setOpen(null)
          // 通りに出たら、どの建物も選んでいない状態に戻す
          if (toStreet) {
            setTarget(null)
            if (location.hash.startsWith('#at-')) history.replaceState(null, '', location.pathname + location.search)
          }
        },
        onReady: () => setState('ready'),
      })
      const first = location.hash.replace(/^#at-/, '')
      // URL で建物を指定されていればそこへ入る。なければ ABOUT の家の前まで歩いてきて、パネルは開かずに家を弾ませる
      window.setTimeout(() => bench.current?.goTo(isSection(first) ? first : 'about', { open: isSection(first) }), 500)
      if (isSection(first)) setTarget(first)
    })
    const onHash = () => {
      const id = location.hash.replace(/^#at-/, '')
      if (isSection(id)) {
        setTarget(id)
        bench.current?.goTo(id)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      cancelled = true
      window.removeEventListener('hashchange', onHash)
      bench.current?.dispose()
      bench.current = null
    }
    // 街は 1 度だけ組む。言語が変わったときは key で作り直す（app/page.tsx）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bench.current?.setPanelOpen(open !== null, aside.current?.offsetWidth)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const panel = open ? panels[open] : null

  return (
    <section aria-label={t.label} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-gradient-to-b from-tile/60 to-soft">
      {/* 街の描画先。← → で歩けるよう、フォーカスを受けられるようにする */}
      <div ref={host} tabIndex={0} aria-label={t.hint} className="absolute inset-0 outline-none" />

      {/* 看板のアイコンの元（見えない）。three の板に描くときに SVG を読み取る */}
      <div ref={icons} aria-hidden className="hidden">
        {townLinks.map((l) => {
          const Icon = LINK_ICONS[l.id]
          return (
            <span key={l.id} data-icon={l.id}>
              <Icon />
            </span>
          )
        })}
      </div>

      <nav aria-label="Main" className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-2 p-3 sm:p-5">
        <a href="/" className="hidden items-center gap-[10px] rounded-[12px] bg-tile/90 px-[14px] py-[10px] text-[16px] font-extrabold tracking-[-0.02em] text-ink no-underline shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.12)] sm:flex">
          <span aria-hidden className="mini-brick mt-[3px] h-[10px] w-[17px] rounded-[3px]" />
          Kota Mizuno
        </a>
        {SECTIONS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            aria-current={target === id ? 'true' : undefined}
            className={`rounded-[10px] px-[11px] py-[10px] font-mono text-[11.5px] font-extrabold tracking-[.06em] shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.14)] transition-colors duration-150 active:translate-y-[2px] active:shadow-[0_1px_0_rgb(var(--shadow-rgb)/0.14)] sm:px-[13px] sm:text-[12px] ${
              target === id ? 'bg-ink text-paper' : 'bg-tile/90 text-ink hover:bg-tile'
            }`}
          >
            {t.buildings[id].title}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LangToggle lang={lang} />
        </div>
      </nav>

      {state === 'none' && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div className="flex flex-col items-center gap-5">
            <span className="text-[44px] font-extrabold tracking-[-0.04em] sm:text-[72px]">Kota Mizuno</span>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {FALLBACK.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex items-center gap-[6px] text-[15px] font-bold text-teal no-underline">
                    {t.buildings[l.id].sub}
                    <PiArrowRightBold className="text-[12px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}


      <aside
        ref={aside}
        aria-live="polite"
        aria-hidden={!panel}
        className={`absolute z-20 flex flex-col gap-[14px] overflow-auto rounded-[20px] bg-tile px-6 pb-[26px] pt-[22px] text-ink shadow-[0_6px_0_rgb(var(--shadow-rgb)/0.1),0_20px_50px_rgb(var(--shadow-rgb)/0.12)] transition-transform duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)] inset-x-[10px] bottom-[10px] h-[56%] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-[84px] sm:h-auto sm:w-[min(600px,54%)] ${
          panel ? 'translate-x-0 translate-y-0' : 'translate-y-[calc(100%+20px)] sm:translate-x-[calc(100%+30px)] sm:translate-y-0'
        }`}
      >
        {panel && open && (
          <>
            <header className="flex items-center gap-[10px]">
              <span aria-hidden className={`h-[14px] w-[14px] rounded-[3px] shadow-[0_2px_0_rgb(0_0_0/0.18)] ${DOT[open]}`} />
              <span className="font-mono text-[12px] font-bold tracking-[.08em] text-mute">{panel.eyebrow}</span>
              <button type="button" onClick={close} aria-label={t.close} className="ml-auto grid h-8 w-8 place-items-center rounded-[9px] bg-soft text-mute hover:text-ink">
                <PiXBold className="text-[14px]" />
              </button>
            </header>
            {panel.title ? <h2 className="text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em]">{panel.title}</h2> : <h2 className="sr-only">{panel.eyebrow}</h2>}
            {panel.body}
          </>
        )}
      </aside>
    </section>
  )
}

