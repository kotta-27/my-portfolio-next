export function Tag({ children }: { children: string }) {
  return (
    <span className="text-[10px] text-[#666] bg-[#f5f5f5] rounded-full px-[9px] py-[3px]">
      {children}
    </span>
  )
}
