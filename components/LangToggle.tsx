'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { Lang } from '@/types'

export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-[5px] text-[11.5px]">
      <button
        onClick={() => router.push(`${pathname}?lang=en`, { scroll: false })}
        className={`${
          lang === 'en' ? 'text-[#1a1a1a] font-semibold' : 'text-[#aaa]'
        } hover:text-[#1a1a1a] transition-colors duration-150`}
      >
        EN
      </button>
      <span className="text-[#ccc]">/</span>
      <button
        onClick={() => router.push(`${pathname}?lang=ja`, { scroll: false })}
        className={`${
          lang === 'ja' ? 'text-[#1a1a1a] font-semibold' : 'text-[#aaa]'
        } hover:text-[#1a1a1a] transition-colors duration-150`}
      >
        JA
      </button>
    </div>
  )
}
