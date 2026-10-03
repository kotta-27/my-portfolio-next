import { PiArrowUpRight } from 'react-icons/pi'
import type { Lang } from '@/types'
import type { ArticleLink } from '@/data/awards'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { Tile } from '@/components/Tile'

/**
 * Writing ビューの 1 記事カード。Zenn などの OG 画像にはタイトルが入っているので画像だけを見せる。
 * 画像が取れなかったときだけテキストで表示する。
 */
export async function ArticleTile({ article, lang }: { article: ArticleLink; lang: Lang }) {
  const thumbnail = await fetchOgImage(article.href)
  return (
    <Tile pad={false} className="gap-0">
      <a
        href={article.href}
        target="_blank"
        rel="noopener noreferrer"
        title={article[lang]}
        aria-label={`${article.source}: ${article[lang]}`}
        className="group relative flex h-full flex-col no-underline"
      >
        {thumbnail ? (
          <div className="relative aspect-[1200/630] w-full overflow-hidden bg-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt={article[lang]} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-[6px] px-[14px] py-[12px]">
            <span className="w-fit rounded-full bg-soft px-[8px] py-[3px] text-[10px] font-extrabold uppercase tracking-[.06em] text-mute">{article.source}</span>
            <p className="text-[12.5px] font-bold leading-[1.5] text-ink">{article[lang]}</p>
          </div>
        )}
        <span className="absolute bottom-[10px] right-[10px] flex h-[26px] w-[26px] items-center justify-center rounded-full bg-ink/85 text-white opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <PiArrowUpRight className="text-[14px]" />
        </span>
      </a>
    </Tile>
  )
}
