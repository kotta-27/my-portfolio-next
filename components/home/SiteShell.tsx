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
      <footer className="mx-auto flex max-w-[1312px] flex-col gap-5 px-5 pb-10 sm:px-8 lg:px-16">
        <span aria-hidden className="h-px bg-ink/10" />
        <div className="flex flex-col items-start justify-between gap-4 text-[13px] text-mute sm:flex-row sm:items-center">
          <a href="/" className="flex items-center gap-[10px] font-extrabold tracking-[-0.02em] text-ink no-underline">
            <span aria-hidden className="mini-brick mt-[3px] h-[10px] w-[17px] rounded-[3px]" />
            Kota Mizuno
          </a>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 font-bold">
            {[
              { href: '/projects', label: home[lang].nav.projects },
              { href: '/career', label: home[lang].nav.career },
              { href: '/output', label: home[lang].nav.output },
              { href: '/#at-contact', label: home[lang].nav.contact },
            ].map((l) => (
              <a key={l.href} href={l.href} className="text-mute no-underline transition-colors duration-150 hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <span className="font-mono text-[12px]">{home[lang].footer}</span>
        </div>
      </footer>
    </div>
  )
}
