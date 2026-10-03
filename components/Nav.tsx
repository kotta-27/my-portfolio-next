'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PiCaretDownBold, PiCheckBold } from 'react-icons/pi'
import type { Lang, View } from '@/types'
import { ui } from '@/data/ui'
import { LangToggle } from '@/components/LangToggle'
import { useView } from '@/components/ViewContext'

type Props = {
  lang: Lang
  /** スマホのタブ一覧に添える件数（Overview は「すべて」） */
  counts: Partial<Record<View, number>>
}

export function Nav({ lang, counts }: Props) {
  const t = ui[lang]
  const { view, setView } = useView()
  const [scrolled, setScrolled] = useState(false)
  // スマホでは全タブが並ばないので、現在地のボタン + 一覧（ドロップダウン）にする
  const [menuOpen, setMenuOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const current = t.nav.find((item) => item.view === view) ?? t.nav[0]

  useEffect(() => {
    if (!menuOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      triggerRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function choose(next: View) {
    setView(next)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goContact() {
    setView('all')
    requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between gap-3 bg-ground/85 px-4 backdrop-blur-md transition-all duration-300 sm:px-6 ${
          scrolled ? 'h-[52px] shadow-[0_1px_0_rgba(13,27,42,0.08)]' : 'h-[60px]'
        }`}
      >
        <a href="?" className="flex items-center gap-[8px] text-[14px] font-extrabold tracking-[-0.01em] text-ink no-underline">
          <span className="h-[10px] w-[10px] rounded-[3px] bg-teal" />
          <span>Kota Mizuno</span>
        </a>
        <div className="flex min-w-0 items-center gap-[10px]">
          {/* スマホ: 現在地のボタン。タップで一覧を開く */}
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-[6px] rounded-full bg-ink px-3 py-[6px] text-[11.5px] font-bold text-white sm:hidden"
          >
            {current.label}
            <PiCaretDownBold className={`text-[10px] transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          {/* PC: 今まで通りのタブ */}
          <div className="hidden items-center gap-[2px] rounded-full bg-tile p-[3px] text-[11.5px] font-bold sm:flex">
            {t.nav.map((item) => {
              const active = view === item.view
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => choose(item.view)}
                  aria-pressed={active}
                  className={`relative shrink-0 rounded-full px-[10px] py-[5px] transition-colors duration-150 sm:px-3 ${
                    active ? 'text-white' : 'text-mute hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={goContact}
            className="hidden rounded-full bg-ink px-4 py-[7px] text-[11.5px] font-bold text-white transition-colors duration-150 hover:bg-teal sm:inline-flex"
          >
            Contact
          </button>
          <LangToggle lang={lang} />
        </div>
      </nav>

      {/* スマホのタブ一覧。nav は backdrop-filter で fixed の基準になってしまうので外に置く */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="nav-backdrop"
              className="fixed inset-0 z-40 bg-ink/25 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="nav-menu"
              id="nav-menu"
              role="menu"
              aria-label="Sections"
              className={`fixed inset-x-3 z-50 rounded-[16px] bg-tile p-[6px] shadow-[0_20px_40px_-12px_rgba(13,27,42,0.35)] sm:hidden ${scrolled ? 'top-[56px]' : 'top-[64px]'}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              {t.nav.map((item) => {
                const active = item.view === view
                const count = item.view === 'all' ? t.navAll : counts[item.view]
                return (
                  <button
                    key={item.view}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    autoFocus={active}
                    onClick={() => choose(item.view)}
                    className={`flex w-full items-center justify-between rounded-[10px] px-3 py-[11px] text-left text-[14px] font-bold text-ink outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal ${
                      active ? 'bg-soft' : 'hover:bg-soft/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {active && <PiCheckBold className="text-[12px] text-teal" />}
                    </span>
                    {count !== undefined && <span className="font-mono text-[11px] font-medium text-mute tabular-nums">{count}</span>}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
