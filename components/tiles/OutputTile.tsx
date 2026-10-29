import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { collectOutputs } from '@/lib/outputs'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Thumb } from '@/components/Thumb'
import { NoteCover } from '@/components/notes/NoteCover'
import { notesData } from '@/data/notes'
import { noteUrl } from '@/lib/blog'
import { ViewSwitchLink } from '@/components/ViewSwitchLink'

/** Overview に出す件数。残りは Output タブで見せる */
const OVERVIEW_COUNT = 4

/**
 * Overview の Output タイル。記事・インタビュー・ブログ・登壇のうち新しいものだけを並べ、全件は Output タブへ誘導する。
 * 呼び出し側で <Suspense> に包むこと(このタイル単体がストリーミングで後から届く)。
 */
export async function OutputTile({ lang }: { lang: Lang }) {
  const t = ui[lang].tiles
  const all = collectOutputs()
  const items = await Promise.all(
    all.slice(0, OVERVIEW_COUNT).map(async (o) => ({ ...o, thumbnail: o.thumbnail ?? (o.internal ? null : await fetchOgImage(o.url)) }))
  )
  return (
    <Tile id="writing" clip={false}>
      <div className="flex items-center justify-between gap-3">
        <TileLabel qty={all.length}>{t.writing}</TileLabel>
        <ViewSwitchLink view="writing" label={t.careerMore} />
      </div>
      {/* 新しいものから 4 件を、サムネイル付きのカードで 2 列に並べる */}
      <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((o) => {
          const note = o.internal ? notesData.find((n) => noteUrl(n.slug) === o.url) : undefined
          return (
            <a
              key={o.url}
              href={o.url}
              {...(o.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="group flex flex-col overflow-hidden rounded-[6px] bg-soft no-underline transition-colors duration-150 hover:bg-ground"
            >
              <div className="relative aspect-[1200/630] overflow-hidden bg-soft">
                {note ? (
                  <NoteCover title={note.title[lang]} date={note.date} tags={note.tags} />
                ) : o.thumbnail ? (
                  <Thumb src={o.thumbnail} alt="" sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-[3px] px-3 pb-3 pt-[10px]">
                <span className="text-[9.5px] font-extrabold uppercase tracking-[.08em] text-mute">{o.source}</span>
                <p className="line-clamp-2 text-[12.5px] font-bold leading-[1.45] text-ink group-hover:text-teal">{o.label[lang]}</p>
              </div>
            </a>
          )
        })}
      </div>
    </Tile>
  )
}
