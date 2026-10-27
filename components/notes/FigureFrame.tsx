'use client'

import type { ReactNode } from 'react'
import { useTr } from '@/components/notes/i18n'

/*
 * 学習ノートの図の部品。図は中身の理解が主役なので、サイトのレゴ表現は持ち込まず素直な見た目にする。
 */

/** 図の枠 */
export function FigureFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative overflow-hidden rounded-[10px] border border-ink/10 bg-ground/60 ${className}`}>{children}</div>
}

/** 図の中の操作ボタン */
export function FigButton({
  children,
  onClick,
  active = false,
  disabled = false,
  label,
}: {
  children: ReactNode
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex items-center gap-[6px] rounded-[7px] border px-[12px] py-[6px] text-[12px] font-bold transition-colors duration-150 disabled:opacity-40 ${
        active ? 'border-ink bg-ink text-paper' : 'border-ink/15 bg-tile text-ink hover:border-ink/40'
      }`}
    >
      {children}
    </button>
  )
}

/** コマ位置。押すとそのコマへ飛ぶ */
export function StepDots({ count, step, onSelect }: { count: number; step: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-[6px]">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Step ${i + 1}`}
          aria-current={i === step ? 'step' : undefined}
          className={`h-[9px] rounded-full transition-all duration-200 ${i === step ? 'w-[22px] bg-teal' : i < step ? 'w-[9px] bg-ink/40' : 'w-[9px] bg-ink/15'}`}
        />
      ))}
    </div>
  )
}

/** コマ送りの操作一式: 前へ・次へ（最後は最初から）・コマ位置 */
export function StepNav({
  step,
  count,
  onPrev,
  onNext,
  onSelect,
}: {
  step: number
  count: number
  onPrev: () => void
  onNext: () => void
  onSelect: (i: number) => void
}) {
  const atEnd = step >= count - 1
  const tr = useTr()
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <FigButton onClick={onPrev} disabled={step === 0} label={tr('前へ', 'Previous')}>
          ←
        </FigButton>
        <FigButton onClick={atEnd ? () => onSelect(0) : onNext} active={!atEnd}>
          {atEnd ? tr('最初から', 'Restart') : tr('次へ →', 'Next →')}
        </FigButton>
      </div>
      <StepDots count={count} step={step} onSelect={onSelect} />
    </div>
  )
}
