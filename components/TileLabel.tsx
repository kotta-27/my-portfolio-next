type Props = {
  children: string
  className?: string
  /** 組立説明書のステップ番号。Overview を上から読むと 1 体が組み上がる順 */
  step?: number
  /** 部品数（このセクションに並ぶ件数）。説明書の「×4」 */
  qty?: number
}

export function TileLabel({ children, className = '', step, qty }: Props) {
  const label = <span className={`text-[10.5px] font-bold uppercase tracking-[.08em] text-mute ${className}`}>{children}</span>
  if (step === undefined && qty === undefined) return label
  return (
    <span className="flex items-center gap-[8px]">
      {step !== undefined && (
        <span className="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[3px] border-[1.5px] border-current font-mono text-[10.5px] font-bold leading-none tabular-nums opacity-80">
          {step}
        </span>
      )}
      {label}
      {qty !== undefined && <span className="font-mono text-[10.5px] tabular-nums opacity-70">×{qty}</span>}
    </span>
  )
}
