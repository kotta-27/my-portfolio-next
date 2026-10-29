/*
 * 学習ノートのカード表紙。OG 画像の代わりに、濃いプレートにタイトルと小さなブロックの山を描く。
 * 1 枚の画像のように、どの幅でも同じ比率で縮む（寸法は globals.css の .note-cover。幅 240px のときを基準にした比率）。
 */
export function NoteCover({ title, date, tags }: { title: string; date: string; tags: string[] }) {
  return (
    <div className="absolute inset-0 [container-type:inline-size]">
      <div className="note-cover flex h-full w-full flex-col justify-between bg-slab text-slab-fg">
        <span className="note-cover__date font-mono font-bold text-slab-fg/55">NOTE · {date.replaceAll('-', '.')}</span>
        <p className="note-cover__title line-clamp-3 font-extrabold leading-[1.35] tracking-[-0.01em]">{title}</p>
        <div className="note-cover__foot flex items-end justify-between">
          <div className="note-cover__tags flex flex-wrap">
            {tags.map((t) => (
              <span key={t} className="note-cover__tag flat-tile bg-slab-fg/10 font-bold">
                {t}
              </span>
            ))}
          </div>
          <span aria-hidden className="note-cover__bricks flex shrink-0 flex-col items-center">
            <span className="mini-brick rounded-[2px]" />
            <span className="flex">
              <span className="mini-brick mini-brick--coral rounded-[2px]" />
              <span className="mini-brick mini-brick--soft rounded-[2px]" />
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
