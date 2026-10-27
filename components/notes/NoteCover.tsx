/** 学習ノートのカード表紙。OG 画像の代わりに、濃いプレートにタイトルと小さなブロックの山を描く */
export function NoteCover({ title, date, tags }: { title: string; date: string; tags: string[] }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between gap-2 bg-slab p-[14px] text-slab-fg">
      <span className="font-mono text-[10px] font-bold tracking-[.06em] text-slab-fg/55">NOTE · {date.replaceAll('-', '.')}</span>
      <p className="line-clamp-3 text-[14px] font-extrabold leading-[1.35] tracking-[-0.01em]">{title}</p>
      <div className="flex items-end justify-between gap-2">
        <div className="flex flex-wrap gap-[4px]">
          {tags.map((t) => (
            <span key={t} className="flat-tile bg-slab-fg/10 px-[6px] py-[2px] text-[9.5px] font-bold">
              {t}
            </span>
          ))}
        </div>
        <span aria-hidden className="flex shrink-0 flex-col items-center gap-[5px]">
          <span className="mini-brick h-[9px] w-[18px] rounded-[2px]" />
          <span className="flex gap-[3px]">
            <span className="mini-brick mini-brick--coral h-[9px] w-[18px] rounded-[2px]" />
            <span className="mini-brick mini-brick--soft h-[9px] w-[18px] rounded-[2px]" />
          </span>
        </span>
      </div>
    </div>
  )
}
