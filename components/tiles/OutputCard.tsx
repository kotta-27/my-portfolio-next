import { PiArrowUpRight } from 'react-icons/pi'
import type { Lang } from '@/types'
import { fetchOgImage } from '@/lib/fetchOgImage'
import type { OutputItem } from '@/lib/outputs'
import { Tile } from '@/components/Tile'

/**
 * Output ビューの 1 枚カード。サムネイルを主役にし、hover で下からソースとタイトルが出る。
 * 画像が取れなかったときだけ最初からテキストで表示する。
 */
export async function OutputCard({ item, lang }: { item: OutputItem; lang: Lang }) {
  const thumbnail = item.thumbnail ?? (await fetchOgImage(item.url))
  return (
    <Tile pad={false} className="gap-0">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        title={item.label[lang]}
        aria-label={`${item.source}: ${item.label[lang]}`}
        className="group relative flex h-full flex-col no-underline"
      >
        {thumbnail ? (
          <div className="relative aspect-[1200/630] w-full overflow-hidden bg-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt={item.label[lang]} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/90 to-ink/0 px-3 pb-3 pt-8 text-white transition-transform duration-200 group-hover:translate-y-0">
              <span className="text-[9.5px] font-extrabold uppercase tracking-[.08em] text-white/70">{item.source}</span>
              <p className="line-clamp-2 text-[12px] font-bold leading-[1.4]">{item.label[lang]}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-[6px] px-[14px] py-[12px]">
            <span className="w-fit rounded-full bg-soft px-[8px] py-[3px] text-[10px] font-extrabold uppercase tracking-[.06em] text-mute">{item.source}</span>
            <p className="text-[12.5px] font-bold leading-[1.5] text-ink">{item.label[lang]}</p>
          </div>
        )}
        <span className="absolute right-[10px] top-[10px] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-ink/85 text-white opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <PiArrowUpRight className="text-[14px]" />
        </span>
      </a>
    </Tile>
  )
}
