export function Tag({ children }: { children: string }) {
  return (
    <span className="flat-tile bg-soft px-[8px] py-[3px] text-[10px] font-semibold text-mute">
      {children}
    </span>
  )
}
