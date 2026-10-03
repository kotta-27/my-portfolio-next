/** グリッド内の区切り帯。見出し・罫線・件数だけの低い行 */
export function BandRow({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex w-full items-center gap-3 px-1 pt-3">
      <span className="text-[13px] font-extrabold tracking-[-0.01em]">{label}</span>
      <span className="h-[2px] flex-1 rounded-full bg-ink/15" />
      <span className="font-mono text-[11px] text-mute tabular-nums">{count}</span>
    </div>
  )
}
