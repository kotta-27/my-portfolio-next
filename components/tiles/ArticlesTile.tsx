import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { articles } from '@/data/awards'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { LinkCard } from '@/components/LinkCard'

export async function ArticlesTile({ lang }: { lang: Lang }) {
  const t = ui[lang].tiles

  const withOg = await Promise.all(
    articles.map(async (article) => ({
      ...article,
      thumbnail: await fetchOgImage(article.href),
    }))
  )

  return (
    <Tile id="writing">
      <TileLabel>{t.writing}</TileLabel>
      <div className="mt-1 flex flex-col gap-[6px]">
        {withOg.map((article) => (
          <LinkCard
            key={article.href}
            card={{ url: article.href, label: article[lang], source: article.source, thumbnail: article.thumbnail }}
          />
        ))}
      </div>
    </Tile>
  )
}
