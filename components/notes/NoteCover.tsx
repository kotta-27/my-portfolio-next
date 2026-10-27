/** 学習ノートのカード表紙。OG 画像の代わりに、濃いプレートにタイトルと小さなブロックの山を描く */
export function NoteCover({ title, date, tags }: { title: string; date: string; tags: string[] }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-start gap-[6px] bg-slab p-[10px] sm:justify-between sm:gap-2 sm:p-[14px] text-slab-fg">
      {/* モバイルはタグを出さないので、飾りは右下の背面に薄く置く */}
      <span aria-hidden className="pointer-events-none absolute bottom-[8px] right-[8px] flex flex-col items-center gap-[4px] opacity-25 sm:hidden">
        <span className="mini-brick h-[8px] w-[16px] rounded-[2px]" />
        <span className="flex gap-[3px]">
          <span className="mini-brick mini-brick--coral h-[8px] w-[16px] rounded-[2px]" />
          <span className="mini-brick mini-brick--soft h-[8px] w-[16px] rounded-[2px]" />
        </span>
      </span>
      <span className="relative font-mono text-[10px] font-bold tracking-[.06em] text-slab-fg/55">NOTE · {date.replaceAll('-', '.')}</span>
      <p className="relative line-clamp-3 shrink-0 text-[12.5px] font-extrabold leading-[1.35] tracking-[-0.01em] sm:text-[14px]">{title}</p>
      <div className="hidden items-end justify-between gap-2 sm:flex">
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
