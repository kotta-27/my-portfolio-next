import type { CSSProperties, ReactNode } from 'react'
import { colSpan, rowSpan, type Rows, type Span } from '@/components/gridSpans'

type Props = {
  children: ReactNode
  span?: Span
  rows?: Rows
  /** Order in the stagger sequence（上からの並び順。重なりは上ほど手前） */
  index?: number
}

/** Grid item wrapper for static pages: places the tile and fades it in with CSS (no JS needed to show content). */
export function Reveal({ children, span = 1, rows = 1, index = 0 }: Props) {
  return (
    // 上の段ほど手前に置き、下のブロックのスタッドを上のブロックの底に隠す
    // AssembleScript がハイドレーション前に --rise などを書き込むので、style の差分は許容する
    <div
      className={`${colSpan[span]} ${rowSpan[rows]} tile-enter ${index === 0 ? 'tile-enter-solid' : ''} relative flex`}
      style={{ '--i': index, zIndex: 10 - index } as CSSProperties}
      suppressHydrationWarning
    >
      {children}
    </div>
  )
}
