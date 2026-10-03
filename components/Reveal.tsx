import type { CSSProperties, ReactNode } from 'react'
import { colSpan, rowSpan, type Rows, type Span } from '@/components/gridSpans'

type Props = {
  children: ReactNode
  span?: Span
  rows?: Rows
  /** Order in the stagger sequence */
  index?: number
}

/** Grid item wrapper for static pages: places the tile and fades it in with CSS (no JS needed to show content). */
export function Reveal({ children, span = 1, rows = 1, index = 0 }: Props) {
  return (
    <div className={`${colSpan[span]} ${rowSpan[rows]} tile-enter ${index === 0 ? 'tile-enter-solid' : ''} flex`} style={{ '--i': index } as CSSProperties}>
      {children}
    </div>
  )
}
