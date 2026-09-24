export function TileLabel({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`text-[10.5px] font-bold uppercase tracking-[.08em] text-mute ${className}`}>
      {children}
    </span>
  )
}
