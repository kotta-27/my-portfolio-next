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
      {/* フッターはコピーライトだけ（行き先は上のナビ・スマホの下の地図にある）。スマホでは下の地図に隠れないよう余白を取る */}
      <footer className="mx-auto max-w-[1312px] px-5 pb-28 pt-4 text-center sm:px-8 sm:pb-10 lg:px-16">
        <span className="font-mono text-[12px] text-mute">{home[lang].footer}</span>
      </footer>
    </div>
  )
}
