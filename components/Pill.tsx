const SIZE = {
  xs: 'px-[7px] py-[2px] text-[9.5px]',
  sm: 'px-[8px] py-[3px] text-[10px]',
} as const

export function Pill({
  children,
  size = 'xs',
  className = '',
}: {
  children: React.ReactNode
  size?: keyof typeof SIZE
  className?: string
}) {
  return (
    <span
      className={`rounded-full bg-soft font-bold uppercase tracking-[.06em] text-mute ${SIZE[size]} ${className}`}
    >
      {children}
    </span>
  )
}
