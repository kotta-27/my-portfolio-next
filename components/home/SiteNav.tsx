'use client'

import { usePathname } from 'next/navigation'
import type { Lang } from '@/types'
import { town } from '@/data/town'
import { SECTIONS, type Section } from '@/lib/town/sections'
import { DOT } from '@/components/town/dots'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'

/** 今いるページが、街のどの建物にあたるか */
function sectionOf(path: string): Section | null {
  if (path.startsWith('/works')) return 'works'
  if (path.startsWith('/career')) return 'career'
  if (path.startsWith('/output') || path.startsWith('/notes')) return 'output'
  return null
}

/**
 * サイト共通のナビ。トップの街（components/town/TownView.tsx）とそろえる。
 * 広い画面: 上に名前・建物のボタン・切り替え。スマホ: 上は名前と切り替えだけ（1 段）、建物は下の地図。
 * ボタンはトップの街のその建物へ（/#at-works など。着くとパネルが開く）。今いるページにあたる建物を濃くする。
 */
export function SiteNav({ lang }: { lang: Lang }) {
  const t = town[lang]
  const current = sectionOf(usePathname() ?? '')
  return (
    <>
      <header className="sticky top-0 z-50 bg-ground/85 backdrop-blur-md">
        <nav aria-label="Main" className="flex items-center gap-2 p-3 sm:p-5">
          <a href="/" className="flex items-center gap-[10px] rounded-[12px] bg-tile/90 px-[13px] py-[13px] text-[16px] font-extrabold sm:px-[14px] sm:py-[10px] tracking-[-0.02em] text-ink no-underline shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.12)] dark:ring-1 dark:ring-inset dark:ring-ink/20">
            <span aria-hidden className="mini-brick mt-[3px] h-[10px] w-[17px] rounded-[3px]" />
            <span className="sr-only sm:not-sr-only">Kota Mizuno</span>
          </a>
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`/#at-${id}`}
              aria-current={current === id ? 'page' : undefined}
              className={`hidden rounded-[10px] px-[13px] py-[10px] font-mono text-[12px] font-extrabold tracking-[.06em] no-underline shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.14)] transition-colors duration-150 active:translate-y-[2px] active:shadow-[0_1px_0_rgb(var(--shadow-rgb)/0.14)] sm:inline-block ${
                current === id ? 'bg-ink text-paper' : 'bg-tile/90 text-ink hover:bg-tile dark:ring-1 dark:ring-inset dark:ring-ink/20 dark:hover:ring-ink/40'
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

      {/* スマホ: 下の地図（トップの街と同じ形）。押すとトップの街のその建物へ */}
      <nav aria-label={t.mapLabel} className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 sm:hidden">
        <ol className="flex items-end gap-[2px] rounded-[14px] bg-tile/90 p-[5px] shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.12)] backdrop-blur-sm dark:ring-1 dark:ring-inset dark:ring-ink/20">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`/#at-${id}`}
                aria-current={current === id ? 'page' : undefined}
                className={`flex flex-col items-center gap-[5px] rounded-[10px] px-[9px] pb-[6px] pt-[7px] font-mono text-[9.5px] font-extrabold tracking-[.04em] no-underline ${
                  current === id ? 'bg-ink text-paper' : 'text-mute'
                }`}
              >
                <span aria-hidden className={`h-[7px] w-[12px] rounded-[2px] ${DOT[id]} ${current === id ? 'ring-[1.5px] ring-paper/80' : 'opacity-60'}`} />
                {t.buildings[id].title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
