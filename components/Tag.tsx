export function Tag({ children }: { children: string }) {
  return (
    <span className="text-[10px] text-[#444] bg-[#eeeeee] rounded-[3px] px-2 py-[3px]">
      {children}
    </span>
  )
}
