'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Lang, View } from '@/types'
import { ui } from '@/data/ui'
import { LangToggle } from '@/components/LangToggle'
import { useView } from '@/components/ViewContext'

export function Nav({ lang }: { lang: Lang }) {
  const t = ui[lang]
  const { view, setView } = useView()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function choose(next: View) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goContact() {
    setView('all')
    requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between gap-3 bg-ground/85 px-4 backdrop-blur-md transition-all duration-300 sm:px-6 ${
        scrolled ? 'h-[52px] shadow-[0_1px_0_rgba(13,27,42,0.08)]' : 'h-[60px]'
      }`}
    >
      <a href="?" className="flex items-center gap-[8px] text-[14px] font-extrabold tracking-[-0.01em] text-ink no-underline">
        <span className="h-[10px] w-[10px] rounded-[3px] bg-teal" />
        <span className="hidden sm:inline">Kota Mizuno</span>
      </a>
      <div className="flex min-w-0 items-center gap-[10px]">
        <div className="flex items-center gap-[2px] overflow-x-auto rounded-full bg-tile p-[3px] text-[11px] font-bold sm:text-[11.5px]">
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
  )
}
