import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { collectOutputs } from '@/lib/outputs'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { PreviewLink } from '@/components/PreviewLink'

/** Overview の Output タイル。記事・インタビュー・ブログ・登壇をまとめて一覧 */
export async function OutputTile({ lang }: { lang: Lang }) {
  const t = ui[lang].tiles
  const items = await Promise.all(
    collectOutputs().map(async (o) => ({ ...o, thumbnail: o.thumbnail ?? (await fetchOgImage(o.url)) }))
  )
  return (
    <Tile id="writing" clip={false}>
      <TileLabel>{t.writing}</TileLabel>
      <div className="mt-1 flex flex-col gap-[6px]">
        {items.map((o) => (
          <PreviewLink key={o.url} card={{ url: o.url, label: o.label[lang], source: o.source, thumbnail: o.thumbnail }} />
        ))}
      </div>
    </Tile>
  )
}
