import type { ReactNode } from 'react'
import type { Lang } from '@/types'
import { home } from '@/data/home'
import { SiteNav } from '@/components/home/SiteNav'

/** ナビ・本文の幅・フッターをそろえる、サイト共通の外枠 */
export function SiteShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <div className="min-h-screen font-sans text-ink">
      <SiteNav lang={lang} />
      <main className="mx-auto flex max-w-[1312px] flex-col gap-24 px-5 pb-16 sm:gap-28 sm:px-8 lg:px-16">{children}</main>
      <footer className="pb-10 text-center text-[12px] text-mute">{home[lang].footer}</footer>
    </div>
  )
}
