import Image from 'next/image'
import type { ReactNode } from 'react'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { PiArrowRightBold, PiEnvelopeSimpleBold } from 'react-icons/pi'
import type { Lang } from '@/types'
import { featured, home } from '@/data/home'
import { projectsData } from '@/data/projects'
import { town } from '@/data/town'
import type { ResolvedCareerItem } from '@/data/career'
import type { OutputItem } from '@/lib/outputs'
import { companyPeriod } from '@/lib/career'
import { OutputItemCard } from '@/components/home/Sections'
import type { Section } from '@/lib/town/sections'

/*
 * 街の建物に着いたとき右（スマホでは下）に開く、各セクションの中身。サーバーで組んで TownView に渡す。
 * 長い中身は今の一覧ページ（/projects・/career・/output）に任せ、ここは要点だけ。
 */

function More({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="group inline-flex w-fit items-center gap-[6px] text-[14px] font-extrabold text-teal no-underline">
      {children}
      <PiArrowRightBold className="text-[12px] transition-transform duration-200 group-hover:translate-x-[3px]" />
    </a>
  )
}

/** ABOUT（名刺の形）: 写真と名前 → これまで → 好きな技術 → 受賞・展示 → 余談 */
function About({ lang }: { lang: Lang }) {
  const a = town[lang].about
  return (
    <>
      <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-5 sm:grid-cols-[120px_minmax(0,1fr)]">
        <span className="relative block aspect-square overflow-hidden rounded-full shadow-[0_0_0_4px_rgb(var(--tile)),0_0_0_5px_rgb(var(--ink)/0.08)]">
          <Image src="/me-sq.jpg" alt="" fill sizes="120px" className="object-cover" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[30px]">Kota Mizuno</span>
          {a.kana && <span className="mt-1 text-[13px] text-mute">{a.kana}</span>}
          <span className="mt-[10px] font-mono text-[11.5px] font-bold tracking-[.06em] text-teal">{a.role}</span>
        </span>
      </div>
      <p className="text-[14.5px] leading-[1.9] text-ink/80">{a.story}</p>

      <h3 className="font-mono text-[10.5px] font-bold tracking-[.08em] text-mute">{a.likes}</h3>
      <ul className="grid gap-[10px] sm:grid-cols-3">
        {a.likeItems.map((f) => (
          <li key={f.name} className="flex flex-col gap-[6px] rounded-[14px] bg-soft p-[14px]">
            <b className="text-[15px]">{f.name}</b>
            <span className="text-[12px] leading-[1.6] text-mute">{f.note}</span>
          </li>
        ))}
      </ul>

      <h3 className="font-mono text-[10.5px] font-bold tracking-[.08em] text-mute">{a.awards}</h3>
      <ul className="flex flex-col">
        {a.awardItems.map((x) => (
          <li key={x.title} className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-[10px] border-t border-ink/10 py-[10px] text-[13.5px] font-bold">
            <span className="font-mono text-[11px] font-medium tabular-nums text-mute">{x.date}</span>
            <span className="min-w-0">{x.title}</span>
            <span className={`rounded-[6px] px-2 py-[3px] text-[11px] font-extrabold ${x.best ? 'bg-coral text-paper' : 'bg-soft text-ink'}`}>{x.badge}</span>
          </li>
        ))}
      </ul>

      <p className="flex items-center gap-3 rounded-[14px] border-[1.5px] border-dashed border-ink/15 px-4 py-[14px] text-[13.5px] leading-[1.8] text-mute">
        <span aria-hidden className="mini-brick h-[10px] w-[18px] shrink-0 rounded-[2px]" />
        {a.aside}
      </p>
    </>
  )
}

function Works({ lang }: { lang: Lang }) {
  const items = featured.flatMap((f) => projectsData.filter((p) => p.slug === f.slug))
  return (
    <>
      <ul className="flex flex-col gap-3">
        {items.map((p) => (
          <li key={p.slug}>
            <a href={`/projects/${p.slug}`} className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 text-ink no-underline sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
              <span className="relative block aspect-[16/10] overflow-hidden rounded-[8px] bg-soft">
                <Image src={p.image} alt="" fill sizes="(min-width: 640px) 150px, 96px" className="object-cover object-top" />
              </span>
              <span className="flex min-w-0 flex-col">
                <b className="text-[15px] font-extrabold transition-colors duration-150 group-hover:text-teal">{p.name}</b>
                <span className="line-clamp-2 text-[12.5px] leading-[1.6] text-mute">{p[lang]}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <More href="/projects">{town[lang].more.works(projectsData.length)}</More>
    </>
  )
}

function Career({ lang, items }: { lang: Lang; items: ResolvedCareerItem[] }) {
  return (
    <>
      <p className="text-[13px] text-mute">{town[lang].careerNote}</p>
      <ul className="flex flex-col gap-[10px]">
        {[...items].reverse().map((c) => (
          <li key={c.company.en} className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-[12px] bg-soft px-3 py-[10px]">
            <span className="relative block h-[44px] w-[44px] overflow-hidden rounded-[10px] bg-white">
              <Image src={c.logo} alt="" fill sizes="44px" className="object-contain p-[6px]" />
            </span>
            <span className="flex min-w-0 flex-col">
              <b className="text-[15px] font-extrabold">{c.company[lang]}</b>
              <span className="text-[12.5px] text-mute">{c.positions[0].role[lang]}</span>
              <span className="font-mono text-[11px] tabular-nums text-mute">{companyPeriod(c)}</span>
            </span>
          </li>
        ))}
      </ul>
      <More href="/career">{town[lang].more.career(items.length)}</More>
    </>
  )
}

/** 書いたもの: 一覧ページやトップと同じサムネイル（ノートは表紙、ほかはリンク先の OGP 画像）を 2 列で */
function Output({ lang, items, total }: { lang: Lang; items: OutputItem[]; total: number }) {
  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3">
        {items.map((o) => (
          <li key={o.url}>
            <OutputItemCard item={o} lang={lang} />
          </li>
        ))}
      </ul>
      <More href="/output">{town[lang].more.output(total)}</More>
    </>
  )
}

function Contact({ lang }: { lang: Lang }) {
  const row = 'grid grid-cols-[28px_minmax(0,1fr)] items-center gap-2 rounded-[12px] bg-soft px-[14px] py-3 text-[15px] font-extrabold text-ink no-underline transition-colors duration-150 hover:bg-teal hover:text-paper'
  return (
    <>
      <p className="text-[14.5px] leading-[1.85] text-ink/80">{home[lang].contact.body}</p>
      <ul className="flex flex-col gap-[10px]">
        <li>
          <a href="mailto:mizukou27@gmail.com" className={row}>
            <PiEnvelopeSimpleBold className="text-[17px]" />
            mizukou27@gmail.com
          </a>
        </li>
        <li>
          <a href="https://x.com/Melmol_27" target="_blank" rel="noopener noreferrer" className={row}>
            <FaXTwitter className="text-[15px]" />
            @Melmol_27
          </a>
        </li>
        <li>
          <a href="https://github.com/kotta-27" target="_blank" rel="noopener noreferrer" className={row}>
            <FaGithub className="text-[17px]" />
            kotta-27
          </a>
        </li>
      </ul>
    </>
  )
}

/** title が空なら見出しを出さない（ABOUT は名刺の中に名前がある） */
export type PanelContent = { eyebrow: string; title: string; body: ReactNode }

/** 建物ごとのパネルの中身 */
export function townPanels(lang: Lang, career: ResolvedCareerItem[], outputs: OutputItem[]): Record<Section, PanelContent> {
  const t = home[lang]
  const b = town[lang].buildings
  return {
    about: { eyebrow: b.about.title, title: '', body: <About lang={lang} /> },
    works: { eyebrow: b.works.title, title: t.projects.title, body: <Works lang={lang} /> },
    // career は古い順。パネルでは今の会社を先に出す
    career: { eyebrow: b.career.title, title: t.career.title, body: <Career lang={lang} items={career} /> },
    output: { eyebrow: b.output.title, title: t.output.title, body: <Output lang={lang} items={outputs.slice(0, 8)} total={outputs.length} /> },
    contact: { eyebrow: b.contact.title, title: t.contact.title, body: <Contact lang={lang} /> },
  }
}
