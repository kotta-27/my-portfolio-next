type Props = {
  children: string
  className?: string
  /** 部品数（このセクションに並ぶ件数）。説明書の「×4」 */
  qty?: number
}

export function TileLabel({ children, className = '', qty }: Props) {
  const label = <span className={`text-[10.5px] font-bold uppercase tracking-[.08em] text-mute ${className}`}>{children}</span>
  if (qty === undefined) return label
  return (
    <span className="flex items-center gap-[8px]">
      {label}
      <span className="font-mono text-[10.5px] tabular-nums opacity-70">×{qty}</span>
    </span>
  )
}
