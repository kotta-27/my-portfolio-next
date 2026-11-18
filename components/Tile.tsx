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

/** ブロックの色（面・スタッド・側面）は globals.css の .brick--* が持つ。ここでは文字色だけ */
const tones: Record<Tone, string> = {
  light: 'brick--light text-ink',
  dark: 'brick--dark text-slab-fg',
  accent: 'brick--accent text-paper',
}

/**
 * レゴブロックに見立てたタイル。外側がスタッド（上の凸）と側面の厚みを描き、内側が面と中身を持つ。
 * 外側ははみ出す凸を描くので overflow を切らず、切り抜きは内側で行う。
 * Grid placement and motion live on the BentoGrid item wrapper.
 */
export function Tile({ children, id, tone = 'light', pad = true, clip = true, className = '' }: Props) {
  return (
    <div id={id} className={`brick ${tones[tone]} w-full`}>
      <div
        className={`brick-face relative flex min-h-[120px] w-full flex-1 flex-col gap-[6px] ${clip ? 'overflow-hidden' : ''} ${pad ? 'p-4' : ''} ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
