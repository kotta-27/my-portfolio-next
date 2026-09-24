'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colSpan, rowSpan, type Rows, type Span } from '@/components/gridSpans'

type Props = {
  children: ReactNode
  span?: Span
  rows?: Rows
  /** Order in the stagger sequence */
  index?: number
}

/** Grid item wrapper for static pages: places the tile and fades it in on mount. */
export function Reveal({ children, span = 1, rows = 1, index = 0 }: Props) {
  return (
    <motion.div
      className={`${colSpan[span]} ${rowSpan[rows]} flex`}
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.9, delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  )
}
