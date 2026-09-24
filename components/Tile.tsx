import type { ReactNode } from 'react'

type Tone = 'light' | 'dark' | 'accent'

type Props = {
  children: ReactNode
  id?: string
  tone?: Tone
  pad?: boolean
  /** false lets popovers (e.g. hover previews) escape the rounded bounds */
  clip?: boolean
  className?: string
}

const surfaces: Record<Tone, string> = {
  light: 'bg-tile text-ink shadow-[0_1px_0_rgba(13,27,42,0.04)]',
  dark: 'bg-ink text-white',
  accent: 'bg-teal text-white',
}

/** Surface only — grid placement and motion live on the BentoGrid item wrapper. */
export function Tile({ children, id, tone = 'light', pad = true, clip = true, className = '' }: Props) {
  const surface = surfaces[tone]
  return (
    <div
      id={id}
      className={`relative flex w-full flex-col gap-[6px] rounded-[18px] ${clip ? 'overflow-hidden' : ''} ${pad ? 'p-4' : ''} ${surface} ${className}`}
    >
      {children}
    </div>
  )
}
