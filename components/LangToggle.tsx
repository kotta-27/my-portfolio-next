'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Lang } from '@/types'

const LANGS: Lang[] = ['en', 'ja']

/** EN / JA segmented switch; the teal pill slides to the active language. */
export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchTo(target: Lang) {
    if (target === lang) return
    startTransition(() => {
      router.push(`${pathname}?lang=${target}`, { scroll: false })
    })
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={`flex items-center gap-[2px] rounded-full bg-tile p-[3px] text-[11px] font-bold transition-opacity duration-200 ${
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
            className={`relative rounded-full px-[10px] py-[5px] uppercase tracking-[.06em] transition-colors duration-150 ${
              active ? 'text-white' : 'text-mute hover:text-ink'
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-teal"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative z-10">{target}</span>
          </button>
        )
      })}
    </div>
  )
}
