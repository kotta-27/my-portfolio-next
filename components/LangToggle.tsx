'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect, useTransition } from 'react'
import type { Lang } from '@/types'

const OTHER: Record<Lang, Lang> = { en: 'ja', ja: 'en' }

export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function switchTo(target: Lang) {
    setOpen(false)
    startTransition(() => {
      router.push(`${pathname}?lang=${target}`, { scroll: false })
    })
  }

  const other = OTHER[lang]

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[100] bg-[#edeae3]/70 backdrop-blur-[2px] flex items-center justify-center">
          <span className="w-[22px] h-[22px] border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin" />
        </div>
      )}
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-[4px] text-[11.5px] font-medium text-[#1a1a1a] hover:text-[#555] transition-colors duration-150 disabled:opacity-50"
      >
        {lang.toUpperCase()}
        <span
          className="text-[8px] text-[#aaa] transition-transform duration-150"
          style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-[#ebebeb] rounded-[7px] shadow-sm overflow-hidden z-50">
          <button
            onClick={() => switchTo(other)}
            className="block w-full px-4 py-[9px] text-[11.5px] text-[#555] hover:text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors duration-100 whitespace-nowrap"
          >
            {other.toUpperCase()}
          </button>
        </div>
      )}
    </div>
    </>
  )
}
