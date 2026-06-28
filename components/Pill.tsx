export function Pill({ name, years }: { name: string; years: string }) {
  return (
    <span className="inline-flex items-center text-[11.5px] text-[#444] bg-[#f4f4f4] rounded-lg px-[14px] py-[7px]">
      {name}
      {years && <span className="text-[10px] text-[#888] ml-[5px]">{years}</span>}
    </span>
  )
}
