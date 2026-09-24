import { PiArrowUpRight } from 'react-icons/pi'
import type { Lang } from '@/types'
import type { ArticleLink } from '@/data/awards'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { Tile } from '@/components/Tile'

/** One article as its own card; used in the Writing view. */
export async function ArticleTile({ article, lang }: { article: ArticleLink; lang: Lang }) {
  const thumbnail = await fetchOgImage(article.href)
  return (
    <Tile pad={false} className="gap-0">
      <a
        href={article.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col no-underline"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-soft">
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-[6px] px-[14px] py-[12px]">
          {/* OG 画像側にタイトルやロゴが入っているので、ラベルは画像に重ねず本文側に置く */}
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-soft px-[8px] py-[3px] text-[10px] font-extrabold uppercase tracking-[.06em] text-mute">
              {article.source}
            </span>
            <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-soft text-mute transition-colors duration-200 group-hover:bg-ink group-hover:text-white">
              <PiArrowUpRight className="text-[13px]" />
            </span>
          </div>
          <p className="line-clamp-3 text-[12.5px] font-bold leading-[1.5] text-ink group-hover:text-teal transition-colors duration-150">
            {article[lang]}
          </p>
        </div>
      </a>
    </Tile>
  )
}
