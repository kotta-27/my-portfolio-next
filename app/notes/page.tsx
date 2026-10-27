import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import type { Lang } from '@/types'
import { notesData } from '@/data/notes'
import { getLang } from '@/lib/lang'
import { BLOG_ORIGIN, SITE_ORIGIN, isBlogHost } from '@/lib/blog'
import { Reveal } from '@/components/Reveal'
import { AssembleScript } from '@/components/AssembleScript'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BackLink } from '@/components/BackLink'
import { NoteCover } from '@/components/notes/NoteCover'

const NOTES_TITLE = 'Notes — Kota Mizuno'
const NOTES_DESC = '水野航太の勉強の記録。仕組みを動く図で整理したノート。'

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_ORIGIN),
  title: NOTES_TITLE,
  description: NOTES_DESC,
  alternates: { canonical: `${BLOG_ORIGIN}/` },
  openGraph: { type: 'website', title: NOTES_TITLE, description: NOTES_DESC, url: `${BLOG_ORIGIN}/`, siteName: 'Kota Mizuno — Notes', locale: 'ja_JP' },
  twitter: { card: 'summary_large_image', title: NOTES_TITLE, description: NOTES_DESC, creator: '@Melmol_27' },
}

/** ノートの一覧。blog.kotap.dev のトップ（middleware が / をここに振り替える） */
export default async function NotesIndex() {
  const lang: Lang = await getLang()
  const onBlog = isBlogHost((await headers()).get('host'))
  // blog.kotap.dev では /hnsw、kotap.dev では /notes/hnsw
  const hrefOf = (slug: string) => `${onBlog ? '' : '/notes'}/${slug}`
  const siteHref = onBlog ? `${SITE_ORIGIN}/` : '/'
  const notes = [...notesData].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="baseplate min-h-screen font-sans text-ink">
      <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-3 sm:px-6">
        <div className="relative z-[200] mb-3 flex items-center justify-between">
          <BackLink href={siteHref} label="Kota Mizuno" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle lang={lang} />
          </div>
        </div>

        <Reveal span={4}>
          <Tile className="p-6 sm:p-10">
            <TileLabel qty={notes.length}>Notes</TileLabel>
            <h1 className="mt-2 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-[40px]">
              {lang === 'ja' ? '勉強の記録' : 'Study notes'}
            </h1>
            <p className="mt-2 max-w-[60ch] text-[14px] leading-[1.8] text-mute">
              {lang === 'ja'
                ? '気になった技術の仕組みを、動く図で整理したノート。'
                : 'Notes on how things work, explained with interactive diagrams. Written in Japanese.'}
            </p>
          </Tile>
        </Reveal>

        <div className="mt-brick grid grid-cols-1 gap-y-brick sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n, i) => (
            <Reveal key={n.slug} span={1} index={i + 1}>
              <Tile pad={false} className="gap-0">
                <Link href={hrefOf(n.slug)} className="group flex h-full flex-col no-underline">
                  <div className="relative m-[10px] aspect-[1200/630] overflow-hidden rounded-[2px]">
                    <NoteCover title={n.title[lang]} date={n.date} tags={n.tags} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-[14px] pb-[14px] pt-[4px]">
                    <p className="text-[13px] leading-[1.7] text-mute">{n.summary[lang]}</p>
                  </div>
                </Link>
              </Tile>
            </Reveal>
          ))}
        </div>
        <AssembleScript />
      </div>
    </div>
  )
}
