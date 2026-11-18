'use client'

import { usePathname } from 'next/navigation'
import type { Lang } from '@/types'
import { town } from '@/data/town'
import { SECTIONS, type Section } from '@/lib/town/sections'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'

/** 今いるページが、街のどの建物にあたるか */
function sectionOf(path: string): Section | null {
  if (path.startsWith('/projects')) return 'works'
  if (path.startsWith('/career')) return 'career'
  if (path.startsWith('/output') || path.startsWith('/notes')) return 'output'
  return null
}

/**
 * サイト共通のナビ。トップの街（components/town/TownView.tsx）の上のボタンと同じ形にそろえる。
 * ボタンはトップの街のその建物へ（/#at-works など。着くとパネルが開く）。今いるページにあたる建物のボタンを濃くする。
 */
export function SiteNav({ lang }: { lang: Lang }) {
  const t = town[lang]
  const current = sectionOf(usePathname() ?? '')
  return (
    <header className="sticky top-0 z-50 bg-ground/85 backdrop-blur-md">
      <nav aria-label="Main" className="flex flex-wrap items-center gap-2 p-3 sm:p-5">
        <a href="/" className="hidden items-center gap-[10px] rounded-[12px] bg-tile/90 px-[14px] py-[10px] text-[16px] font-extrabold tracking-[-0.02em] text-ink no-underline shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.12)] sm:flex">
          <span aria-hidden className="mini-brick mt-[3px] h-[10px] w-[17px] rounded-[3px]" />
          Kota Mizuno
        </a>
        {SECTIONS.map((id) => (
          <a
            key={id}
            href={`/#at-${id}`}
            aria-current={current === id ? 'page' : undefined}
            className={`rounded-[10px] px-[11px] py-[10px] font-mono text-[11.5px] font-extrabold tracking-[.06em] no-underline shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.14)] transition-colors duration-150 active:translate-y-[2px] active:shadow-[0_1px_0_rgb(var(--shadow-rgb)/0.14)] sm:px-[13px] sm:text-[12px] ${
              current === id ? 'bg-ink text-paper' : 'bg-tile/90 text-ink hover:bg-tile'
            }`}
          >
            {t.buildings[id].title}
          </a>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LangToggle lang={lang} />
        </div>
      </nav>
    </header>
  )
}
