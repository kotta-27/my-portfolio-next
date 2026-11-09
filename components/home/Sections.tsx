import Image from 'next/image'
import type { ReactNode } from 'react'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { PiArrowRightBold, PiArrowUpRightBold, PiEnvelopeSimpleBold, PiMedalFill } from 'react-icons/pi'
import type { Lang } from '@/types'
import { home, featured } from '@/data/home'
import { projectsData, type ProjectItem } from '@/data/projects'
import { notesData } from '@/data/notes'
import type { ResolvedCareerItem } from '@/data/career'
import type { OutputItem } from '@/lib/outputs'
import { companyPeriod, isOngoing } from '@/lib/career'
import { fetchOgImage } from '@/lib/fetchOgImage'
import { Thumb } from '@/components/Thumb'
import { NoteCover } from '@/components/notes/NoteCover'
import { DropBrick } from '@/components/home/DropBrick'

/*
 * トップページ（リニューアル版）の各セクション。どれも「左に見出し、右に中身」の 2 列（lg 以上）で、狭い画面では縦に積む。
 */

/** 見出しに添える部品（Clutch のエンジンで描いた画像）。セクションごとに部品を変える */
const SECTION_BRICKS = {
  projects: '/bricks-contact-b.png',
  career: '/bricks-section-plate.png',
  output: '/bricks-contact-a.png',
  list: '/bricks-section-tile.png',
} as const

export type SectionBrick = keyof typeof SECTION_BRICKS

/** 見出しの列。eyebrow は小さな英字のラベル。brick を渡すと、その上に部品を 1 つ置く */
export function SectionHead({ eyebrow, title, brick, children }: { eyebrow: string; title: string; brick?: SectionBrick; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {brick && <DropBrick src={SECTION_BRICKS[brick]} />}
      <span className="font-mono text-[12px] font-bold tracking-[.08em] text-mute">{eyebrow}</span>
      <h2 className="text-[32px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[44px]">{title}</h2>
      {children}
    </div>
  )
}

/** 見出しの下の「もっと見る」リンク */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="group mt-1 inline-flex w-fit items-center gap-[6px] text-[15px] font-bold text-teal no-underline">
      {children}
      <PiArrowRightBold className="text-[13px] transition-transform duration-200 group-hover:translate-x-[3px]" />
    </a>
  )
}

/** 左に見出し・右に中身の 2 列 */
export function Split({ id, head, children }: { id: string; head: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="grid scroll-mt-24 gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
      {head}
      <div className="min-w-0">{children}</div>
    </section>
  )
}

/** 現職・学歴・興味の 3 枚 */
export function FactCards({ lang }: { lang: Lang }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-3 sm:gap-5">
      {home[lang].facts.map((f) => (
        <li key={f.label} className="flex flex-col gap-2 rounded-[18px] bg-tile px-6 py-5 sm:px-7 sm:py-6">
          <span className="font-mono text-[11.5px] font-bold tracking-[.08em] text-mute">{f.label}</span>
          <span className="text-[17px] font-extrabold sm:text-[19px]">{f.title}</span>
          <span className="text-[13.5px] text-mute">{f.sub}</span>
        </li>
      ))}
    </ul>
  )
}

/** 代表作の 1 行: 写真・名前・問題 / 工夫 / 結果・技術 */
function FeaturedRow({ project, lang, lines }: { project: ProjectItem; lang: Lang; lines: { label: string; text: string }[] }) {
  return (
    <li className="border-t border-ink/10 last:border-b">
      <a
        href={`/projects/${project.slug}`}
        className="group grid gap-4 py-6 text-ink no-underline sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-7 lg:grid-cols-[240px_minmax(0,1fr)_150px] lg:gap-8"
      >
        <span className="relative block aspect-[16/10] overflow-hidden rounded-[12px] bg-soft">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 200px, 100vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </span>
        <span className="flex min-w-0 flex-col gap-[10px]">
          <span className="flex flex-wrap items-center gap-[10px]">
            <span className="text-[22px] font-extrabold tracking-[-0.02em] transition-colors duration-150 group-hover:text-teal sm:text-[24px]">{project.name}</span>
            {project.badge && (
              <span className="inline-flex items-center gap-[4px] rounded-[6px] bg-coral px-2 py-[3px] text-[11px] font-extrabold text-paper">
                <PiMedalFill className="text-[12px]" />
                {project.badge[lang]}
              </span>
            )}
          </span>
          {lines.map((l) => (
            <span key={l.label} className="grid grid-cols-[44px_minmax(0,1fr)] gap-2 text-[14px] leading-[1.75] text-ink/80">
              <span className="font-mono text-[11px] font-bold leading-[2.2] text-teal">{l.label}</span>
              <span>{l.text}</span>
            </span>
          ))}
        </span>
        <span className="hidden pt-2 text-right font-mono text-[12px] text-mute lg:block">{project.tags.slice(0, 2).join(' · ')}</span>
      </a>
    </li>
  )
}

export function FeaturedProjects({ lang }: { lang: Lang }) {
  const t = home[lang].projects
  const rows = featured.flatMap((f) => {
    const project = projectsData.find((p) => p.slug === f.slug)
    if (!project) return []
    const lines = [
      { label: t.problem, text: f.problem[lang] },
      { label: t.approach, text: f.approach[lang] },
      { label: t.result, text: f.result[lang] },
    ]
    return [<FeaturedRow key={f.slug} project={project} lang={lang} lines={lines} />]
  })
  return (
    <Split
      id="projects"
      head={
        <SectionHead eyebrow={t.eyebrow} title={t.title} brick="projects">
          <p className="text-[15px] leading-[1.8] text-mute">{t.blurb}</p>
          <MoreLink href="/projects">{t.more(projectsData.length - rows.length)}</MoreLink>
        </SectionHead>
      }
    >
      <ul>{rows}</ul>
    </Split>
  )
}

/** 会社のロゴ（白い角丸の枠。ダークでも白地のまま見せる） */
function CompanyLogo({ src, alt, size }: { src: string; alt: string; size: 'sm' | 'lg' }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-[12px] bg-white shadow-[inset_0_0_0_1px_rgb(var(--ink)/0.08)] ${size === 'lg' ? 'h-[56px] w-[56px]' : 'h-[48px] w-[48px]'}`}>
      <Image src={src} alt={alt} fill sizes="56px" className="object-contain p-[8px]" />
    </span>
  )
}

/** 経歴: 今の会社を大きな白いカードに、過去の会社はロゴ付きの小さなカードで新しい順に */
export function CareerStrip({ lang, items }: { lang: Lang; items: ResolvedCareerItem[] }) {
  const t = home[lang].career
  const current = items.find((item) => isOngoing(item.positions[0].period))
  const past = items.filter((item) => item !== current).reverse()
  return (
    <Split
      id="career"
      head={
        <SectionHead eyebrow={t.eyebrow} title={t.title} brick="career">
          <MoreLink href="/career">{t.more}</MoreLink>
        </SectionHead>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {current && (
          <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[20px] bg-tile p-7 sm:p-8">
            <span aria-hidden className="absolute inset-x-0 top-0 h-[6px] bg-teal" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <CompanyLogo src={current.logo} alt="" size="lg" />
                <span className="rounded-[6px] bg-teal px-[10px] py-[5px] font-mono text-[11px] font-extrabold text-paper">
                  {t.now} · {companyPeriod(current)}
                </span>
              </div>
              <h3 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[32px]">{current.company[lang]}</h3>
              {/* インターンから正社員のように、同じ会社で役割が変わったときは流れで見せる */}
              <p className="text-[16px] font-bold text-teal">
                {[...current.positions].reverse().map((pos) => pos.role[lang]).join(' → ')}
              </p>
              <p className="text-[14.5px] leading-[1.85] text-ink/80">{current.positions[0].description[lang]}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.tags.map((tag) => (
                <span key={tag} className="rounded-[6px] bg-soft px-[10px] py-[5px] text-[12px] font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <ul className="flex flex-col justify-between gap-3">
          {past.map((item) => {
            const [latest] = item.positions
            return (
              <li key={item.company.en} className="flex items-center gap-4 rounded-[16px] bg-tile px-5 py-[18px]">
                <CompanyLogo src={item.logo} alt="" size="sm" />
                <div className="flex min-w-0 flex-col gap-[3px]">
                  <span className="text-[16px] font-extrabold">
                    {item.company[lang]}
                    {/* 狭い画面では役割を次の行に */}
                    <span className="block text-[12.5px] font-medium text-mute sm:ml-1 sm:inline">
                      <span className="hidden sm:inline">· </span>
                      {latest.role[lang]}
                    </span>
                  </span>
                  <span className="line-clamp-2 text-[13px] leading-[1.6] text-mute">{latest.description[lang]}</span>
                  <span className="font-mono text-[11.5px] tabular-nums text-mute">{companyPeriod(item)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Split>
  )
}

/** 書いたもの 1 件のカード。サムネイルだけ（タイトルは画像の中にある）。ノートは表紙を描き、ほかはリンク先の OGP 画像 */
export async function OutputItemCard({ item, lang }: { item: OutputItem; lang: Lang }) {
  const note = item.kind === 'note' ? notesData.find((n) => item.url.endsWith(`/${n.slug}`)) : undefined
  const thumbnail = note ? null : (item.thumbnail ?? (await fetchOgImage(item.url)))
  return (
    <a
      href={item.url}
      {...(item.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      aria-label={`${item.source}: ${item.label[lang]}`}
      title={item.label[lang]}
      className="group relative block aspect-[1200/630] overflow-hidden rounded-[14px] bg-soft shadow-[inset_0_0_0_1px_rgb(var(--ink)/0.08)] transition-transform duration-200 hover:-translate-y-[2px]"
    >
      {note ? (
        <NoteCover title={note.title[lang]} date={note.date} tags={note.tags} />
      ) : thumbnail ? (
        <Thumb src={thumbnail} alt="" sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 90vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
      ) : (
        <span className="flex h-full flex-col justify-between bg-tile p-5">
          <span className="font-mono text-[11px] font-bold uppercase text-mute">{item.source}</span>
          <span className="line-clamp-3 text-[16px] font-extrabold leading-[1.5]">{item.label[lang]}</span>
        </span>
      )}
      {!item.internal && (
        <span className="absolute right-3 top-3 grid h-[28px] w-[28px] place-items-center rounded-full bg-night/75 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <PiArrowUpRightBold className="text-[13px]" />
        </span>
      )}
    </a>
  )
}

/** 書いたもの（トップ）: 先頭の数件だけ並べ、残りは /output へ */
export function OutputCards({ lang, items, total }: { lang: Lang; items: OutputItem[]; total: number }) {
  const t = home[lang].output
  return (
    <Split
      id="output"
      head={
        <SectionHead eyebrow={t.eyebrow} title={t.title} brick="output">
          <MoreLink href="/output">{t.more(total)}</MoreLink>
        </SectionHead>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((o) => (
          <li key={o.url}>
            <OutputItemCard item={o} lang={lang} />
          </li>
        ))}
      </ul>
    </Split>
  )
}

/** 連絡先の帯。右に 3D で描いたブロックを添える */
export function ContactBand({ lang }: { lang: Lang }) {
  const t = home[lang].contact
  const btn = 'inline-flex items-center gap-2 rounded-[12px] px-5 py-[14px] text-[15px] font-bold no-underline transition-colors duration-150'
  return (
    <section id="contact" className="grid scroll-mt-24 items-center gap-8 rounded-[24px] bg-slab px-6 py-10 text-slab-fg sm:px-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-16">
      <div className="flex flex-col gap-5">
        <span className="font-mono text-[12px] font-bold tracking-[.08em] text-slab-fg/60">{t.eyebrow}</span>
        <h2 className="text-[34px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[56px]">{t.title}</h2>
        <p className="text-[15px] leading-[1.8] text-slab-fg/70">{t.body}</p>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:mizukou27@gmail.com" className={`${btn} bg-slab-fg text-slab hover:bg-teal hover:text-paper`}>
            <PiEnvelopeSimpleBold className="text-[16px]" />
            mizukou27@gmail.com
          </a>
          <a href="https://x.com/Melmol_27" target="_blank" rel="noopener noreferrer" className={`${btn} bg-slab-fg/10 text-slab-fg hover:bg-slab-fg/20`}>
            <FaXTwitter className="text-[14px]" />
            @Melmol_27
          </a>
          <a href="https://github.com/kotta-27" target="_blank" rel="noopener noreferrer" className={`${btn} bg-slab-fg/10 text-slab-fg hover:bg-slab-fg/20`}>
            <FaGithub className="text-[16px]" />
            kotta-27
          </a>
        </div>
      </div>
      <div aria-hidden className="relative hidden h-[220px] lg:block">
        <Image src="/bricks-contact-a.png" alt="" width={180} height={180} className="absolute left-0 top-[30px] -rotate-12" />
        <Image src="/bricks-contact-b.png" alt="" width={210} height={210} className="absolute right-0 top-0 rotate-[14deg]" />
      </div>
    </section>
  )
}

/** 一覧ページの見出し。左にトップへ戻るリンク */
export function PageHead({ back, eyebrow, title, blurb }: { back: string; eyebrow: string; title: string; blurb: string }) {
  return (
    <header className="flex flex-col gap-4 pt-6 sm:pt-10">
      <a href="/" className="group inline-flex w-fit items-center gap-[6px] text-[14px] font-bold text-mute no-underline hover:text-ink">
        <PiArrowRightBold className="rotate-180 text-[12px] transition-transform duration-200 group-hover:-translate-x-[3px]" />
        {back}
      </a>
      <span className="font-mono text-[12px] font-bold tracking-[.08em] text-mute">{eyebrow}</span>
      <h1 className="text-[44px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[64px]">{title}</h1>
      <p className="max-w-[560px] text-[15px] leading-[1.8] text-mute sm:text-[16px]">{blurb}</p>
    </header>
  )
}

/** 作ったもの一覧の 1 行: 写真・名前・ひとこと・技術 */
export function ProjectRow({ project, lang }: { project: ProjectItem; lang: Lang }) {
  return (
    <li className="border-t border-ink/10 last:border-b">
      <a
        href={`/projects/${project.slug}`}
        className="group grid items-center gap-4 py-5 text-ink no-underline grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-7 lg:grid-cols-[220px_minmax(0,1fr)_200px] lg:gap-8"
      >
        <span className="relative block aspect-[16/10] overflow-hidden rounded-[10px] bg-soft">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 220px, (min-width: 640px) 200px, 120px"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </span>
        <span className="flex min-w-0 flex-col gap-[6px]">
          <span className="flex flex-wrap items-center gap-[10px]">
            <span className="text-[18px] font-extrabold tracking-[-0.02em] transition-colors duration-150 group-hover:text-teal sm:text-[22px]">{project.name}</span>
            {project.badge && (
              <span className="inline-flex items-center gap-[4px] rounded-[6px] bg-coral px-2 py-[3px] text-[11px] font-extrabold text-paper">
                <PiMedalFill className="text-[12px]" />
                {project.badge[lang]}
              </span>
            )}
          </span>
          <span className="text-[13.5px] leading-[1.7] text-ink/75 sm:text-[15px]">{project[lang]}</span>
        </span>
        <span className="hidden text-right font-mono text-[12px] text-mute lg:block">{project.tags.join(' · ')}</span>
      </a>
    </li>
  )
}
