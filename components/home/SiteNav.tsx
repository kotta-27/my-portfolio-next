'use client'

import { useEffect, useState } from 'react'
import { PiListBold, PiXBold } from 'react-icons/pi'
import type { Lang } from '@/types'
import { home } from '@/data/home'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'

/** サイト共通のナビ。各セクションはトップの #projects などへ。スマホではメニューボタンにまとめる */
export function SiteNav({ lang }: { lang: Lang }) {
  const t = home[lang].nav
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/#projects', label: t.projects },
    { href: '/#career', label: t.career },
    { href: '/#output', label: t.output },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`sticky top-0 z-50 bg-ground/85 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_0_rgb(var(--shadow-rgb)/0.08)]' : ''}`}>
      <nav aria-label="Main" className="mx-auto flex h-[64px] max-w-[1312px] items-center justify-between gap-4 px-5 sm:h-[76px] sm:px-8 lg:px-16">
        <a href="/" className="flex items-center gap-[10px] text-[16px] font-extrabold tracking-[-0.02em] text-ink no-underline sm:text-[18px]">
          <span aria-hidden className="mini-brick mt-[3px] h-[12px] w-[20px] rounded-[3px]" />
          Kota Mizuno
        </a>
        <div className="hidden items-center gap-8 text-[14px] font-bold md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-mute no-underline transition-colors duration-150 hover:text-ink">
              {l.label}
            </a>
          ))}
          <a href="/#contact" className="rounded-[10px] bg-ink px-5 py-3 text-paper no-underline transition-colors duration-150 hover:bg-teal">
            {t.contact}
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle lang={lang} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={t.menu}
          className="grid h-[44px] w-[44px] place-items-center rounded-[12px] bg-tile text-ink shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.14)] md:hidden"
        >
          {open ? <PiXBold className="text-[18px]" /> : <PiListBold className="text-[18px]" />}
        </button>
      </nav>
      {open && (
        <div id="site-menu" className="border-t border-ink/10 px-5 pb-5 pt-2 md:hidden">
          <ul className="flex flex-col">
            {[...links, { href: '/#contact', label: t.contact }].map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-[17px] font-bold text-ink no-underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center gap-2">
            <ThemeToggle />
            <LangToggle lang={lang} />
          </div>
        </div>
      )}
    </header>
  )
}
