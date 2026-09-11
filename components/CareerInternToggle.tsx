'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function CareerInternToggle({
  children,
  label,
  count,
}: {
  children: React.ReactNode
  label: string
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
          {label}
          <span className="ml-[6px] text-[10.5px] text-[#999]">({count})</span>
        </span>
        <motion.span
          className="text-[10px]"
          style={{ display: 'inline-block' }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="flex flex-col gap-2 mt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
