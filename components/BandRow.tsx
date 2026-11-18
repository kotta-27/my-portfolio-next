/** グリッド内の区切り帯。スタッド付きの長いプレートで、下の段のカードがその下に並ぶ */
export function BandRow({ label, count }: { label: string; count: number }) {
  return (
    <div className="w-full pb-3 pt-6">
      <div className="plate plate--sparse flex w-full items-center gap-3 bg-soft px-4 py-[9px]">
        <span className="text-[13px] font-extrabold tracking-[-0.01em]">{label}</span>
        <span className="ml-auto font-mono text-[11px] text-mute tabular-nums">×{count}</span>
      </div>
    </div>
  )
}
