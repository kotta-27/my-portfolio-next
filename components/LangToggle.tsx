'use client'

import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Lang } from '@/types'

const LANGS: Lang[] = ['en', 'ja']

/** EN / JA segmented switch; the teal pill slides to the active language. */
export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function switchTo(target: Lang) {
    if (target === lang) return
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('lang', target)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={`plate plate--tile flex items-center gap-[2px] bg-tile p-[3px] text-[11px] font-bold transition-opacity duration-200 ${
        isPending ? 'animate-pulse' : ''
      }`}
    >
      {LANGS.map((target) => {
        const active = target === lang
        return (
          <button
            key={target}
            type="button"
            onClick={() => switchTo(target)}
            disabled={isPending}
            aria-pressed={active}
            className={`relative rounded-[2px] px-[10px] py-[5px] uppercase tracking-[.06em] transition-colors duration-150 ${
              active ? 'text-paper' : 'text-mute hover:text-ink'
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -translate-y-[3px] rounded-[2px] bg-teal shadow-[0_3px_0_rgb(var(--shadow-rgb)/0.6)]"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            )}
            <span className={`relative z-10 inline-block ${active ? '-translate-y-[3px]' : ''}`}>{target}</span>
          </button>
        )
      })}
    </div>
  )
}
