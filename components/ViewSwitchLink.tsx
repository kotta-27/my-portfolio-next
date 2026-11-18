'use client'

import { PiArrowRightBold } from 'react-icons/pi'
import type { View } from '@/types'
import { useView } from '@/components/ViewContext'

/** Overview のタイルから、そのセクションのタブへ移る導線 */
export function ViewSwitchLink({ view, label }: { view: View; label: string }) {
  const { setView } = useView()
  return (
    <button
      type="button"
      onClick={() => {
        setView(view)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className="plate group inline-flex items-center gap-[5px] bg-soft px-[12px] py-[6px] text-[11.5px] font-bold text-ink"
    >
      {label}
      <PiArrowRightBold className="text-[11px] transition-transform duration-200 group-hover:translate-x-[2px]" />
    </button>
  )
}
