'use client'

import { useState } from 'react'
import type { Lang } from '@/types'

export function CareerInternToggle({
  children,
  lang,
  count,
}: {
  children: React.ReactNode
  lang: Lang
  count: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-[13px] bg-white/50 rounded-[10px] text-[12px] text-[#777] hover:text-[#444] hover:bg-white/80 transition-all duration-150 border border-transparent hover:border-[#e8e8e8]"
      >
        <span>
          {lang === 'ja' ? 'インターン経験' : 'Internships'}
          <span className="ml-[6px] text-[10.5px] text-[#999]">({count})</span>
        </span>
        <span
          className="text-[10px] transition-transform duration-200"
          style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>
      {open && <div className="flex flex-col gap-2 mt-2">{children}</div>}
    </div>
  )
}
