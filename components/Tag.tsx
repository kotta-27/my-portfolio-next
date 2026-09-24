export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-soft px-[9px] py-[3px] text-[10px] font-semibold text-mute">
      {children}
    </span>
  )
}
