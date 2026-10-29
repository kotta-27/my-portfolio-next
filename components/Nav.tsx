'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PiCaretDownBold, PiCheckBold } from 'react-icons/pi'
import type { Lang, View } from '@/types'
import { ui } from '@/data/ui'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
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
          <span className="mini-brick mt-[3px] h-[9px] w-[15px] rounded-[2.5px]" />
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
            className="plate plate--dark flex items-center gap-[6px] bg-ink px-3 py-[6px] text-[11.5px] font-bold text-paper sm:hidden"
          >
            {current.label}
            <PiCaretDownBold className={`text-[10px] transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          {/* PC: 今まで通りのタブ */}
          <div className="plate plate--tile hidden items-center gap-[2px] bg-tile p-[3px] text-[11.5px] font-bold sm:flex">
            {t.nav.map((item) => {
              const active = view === item.view
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => choose(item.view)}
                  aria-pressed={active}
                  className={`relative shrink-0 rounded-[2px] px-[10px] py-[5px] transition-colors duration-150 sm:px-3 ${
                    active ? 'text-paper' : 'text-mute hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      // 選んでいるタブはプレートの上に乗ったブロック: 位置は他のタブと揃え、下に厚みだけ見せる
                      className="absolute inset-0 rounded-[2px] bg-ink shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.9)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10 inline-block">{item.label}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={goContact}
            className="plate plate--dark hidden bg-ink px-4 py-[7px] text-[11.5px] font-bold text-paper hover:bg-teal sm:inline-flex"
          >
            Contact
          </button>
          <ThemeToggle />
          <LangToggle lang={lang} />
        </div>
      </nav>

      {/* スマホのタブ一覧。nav は backdrop-filter で fixed の基準になってしまうので外に置く */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="nav-backdrop"
              className="fixed inset-0 z-40 bg-night/40 sm:hidden"
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
              className={`fixed inset-x-3 z-50 rounded-[16px] bg-tile p-[6px] shadow-[0_20px_40px_-12px_rgba(13,27,42,0.35)] dark:ring-1 dark:ring-soft sm:hidden ${scrolled ? 'top-[56px]' : 'top-[64px]'}`}
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
