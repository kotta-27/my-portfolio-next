import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Lang } from '@/types'
import { notesData } from '@/data/notes'
import { getLang } from '@/lib/lang'
import { BLOG_ORIGIN, SITE_ORIGIN, isBlogHost } from '@/lib/blog'
import { noteBodies } from '@/components/notes/registry'
import { Reveal } from '@/components/Reveal'
import { AssembleScript } from '@/components/AssembleScript'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Tag } from '@/components/Tag'
import { LangToggle } from '@/components/LangToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BackLink } from '@/components/BackLink'
import { NoteProgress } from '@/components/notes/NoteProgress'
import { NoteLangProvider } from '@/components/notes/i18n'
import { LikeButton } from '@/components/notes/LikeButton'

export function generateStaticParams() {
  return notesData.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const note = notesData.find((n) => n.slug === slug)
  if (!note) return {}
  // 正式な URL は blog.kotap.dev 側。kotap.dev/notes/... はその写し
  const lang = await getLang()
  const title = `${note.title[lang]} — Kota Mizuno`
  const url = `${BLOG_ORIGIN}/${note.slug}`
  // 正式な URL は blog.kotap.dev 側。OGP 画像の URL もこのドメインで組み立てる。SNS のカードのタイトルは記事名だけ（サイト名は og:site_name に出る）
  return {
    metadataBase: new URL(BLOG_ORIGIN),
    title,
    description: note.summary[lang],
    alternates: { canonical: url },
    openGraph: { type: 'article', title: note.title[lang], description: note.summary[lang], url, siteName: 'Kota Mizuno — Notes', locale: lang === 'ja' ? 'ja_JP' : 'en_US', publishedTime: note.date },
    twitter: { card: 'summary_large_image', title: note.title[lang], description: note.summary[lang], creator: '@Melmol_27' },
  }
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const lang: Lang = await getLang()
  const note = notesData.find((n) => n.slug === slug)
  const body = noteBodies[slug]
  if (!note || !body) notFound()
  const Body = body.Body[lang]
  // 戻り先はポートフォリオの Output。blog.kotap.dev からは本体のドメインへ戻す
  const onBlog = isBlogHost((await headers()).get('host'))
  const backHref = `${onBlog ? SITE_ORIGIN : ''}/?view=writing`
  const backLabel = lang === 'ja' ? 'Output に戻る' : 'Back to Output'

  return (
    <div className="baseplate min-h-screen font-sans text-ink">
      <NoteProgress />
      <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-3 sm:px-6">
        <div className="relative z-[200] mb-3 flex items-center justify-between">
          <BackLink href={backHref} label={backLabel} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle lang={lang} />
          </div>
        </div>

        <Reveal span={4}>
          <Tile pad={false} clip={false}>
            <article className="flex flex-col gap-10 px-5 pb-12 pt-8 sm:px-10 sm:pb-16 sm:pt-12">
              <header className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <TileLabel>Note</TileLabel>
                  <time dateTime={note.date} className="font-mono text-[11px] text-mute tabular-nums">
                    {note.date.replaceAll('-', '.')}
                  </time>
                </div>
                <h1 className="text-[28px] font-extrabold leading-[1.25] tracking-[-0.03em] sm:text-[38px]">{note.title[lang]}</h1>
                <p className="text-[14.5px] leading-[1.9] text-mute">{note.summary[lang]}</p>
                <div className="flex flex-wrap gap-[5px]">
                  {note.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </header>

              {/* 目次 */}
              <nav aria-label={lang === 'ja' ? '目次' : 'Contents'} className="mx-auto w-full max-w-[720px] border-y border-ink/10 py-5">
                <span className="text-[10.5px] font-bold uppercase tracking-[.08em] text-mute">{lang === 'ja' ? '目次' : 'Contents'}</span>
                <ol className="mt-3 flex flex-col gap-[6px]">
                  {body.toc.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="group flex items-center gap-3 py-[3px] text-[13.5px] font-bold text-ink/80 no-underline hover:text-teal">
                        <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] border-[1.5px] border-current font-mono text-[11px] tabular-nums">
                          {i + 1}
                        </span>
                        {s.title[lang]}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <NoteLangProvider lang={lang}>
                <Body />
                <LikeButton slug={note.slug} />
              </NoteLangProvider>
            </article>
          </Tile>
        </Reveal>
        <AssembleScript />

        <div className="mt-8 flex justify-center">
          <BackLink href={backHref} label={backLabel} />
        </div>
      </div>
    </div>
  )
}
