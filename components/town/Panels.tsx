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

function About({ lang }: { lang: Lang }) {
  const t = home[lang]
  return (
    <>
      <p className="text-[17px] font-extrabold leading-[1.6]">{t.hero.headline}</p>
      <p className="text-[14.5px] leading-[1.85] text-ink/80">{t.hero.sub}</p>
      <dl className="flex flex-col gap-[10px]">
        {t.facts.map((f) => (
          <div key={f.label} className="rounded-[12px] bg-soft px-[14px] py-3">
            <dt className="font-mono text-[10.5px] font-bold tracking-[.08em] text-mute">{f.label}</dt>
            <dd className="flex flex-col">
              <b className="text-[15px]">{f.title}</b>
              <span className="text-[12.5px] text-mute">{f.sub}</span>
            </dd>
          </div>
        ))}
      </dl>
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
            <a href={`/projects/${p.slug}`} className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 text-ink no-underline">
              <span className="relative block aspect-[16/10] overflow-hidden rounded-[8px] bg-soft">
                <Image src={p.image} alt="" fill sizes="96px" className="object-cover object-top" />
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

function Output({ lang, items, total }: { lang: Lang; items: OutputItem[]; total: number }) {
  return (
    <>
      <ul className="flex flex-col">
        {items.map((o) => (
          <li key={o.url} className="border-b border-ink/10 py-[10px] first:pt-0">
            <a
              href={o.url}
              {...(o.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="group flex flex-col gap-[2px] text-ink no-underline"
            >
              <span className="font-mono text-[11px] uppercase text-mute">{o.source}</span>
              <b className="text-[14.5px] font-extrabold leading-[1.5] transition-colors duration-150 group-hover:text-teal">{o.label[lang]}</b>
            </a>
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

export type PanelContent = { eyebrow: string; title: string; body: ReactNode }

/** 建物ごとのパネルの中身 */
export function townPanels(lang: Lang, career: ResolvedCareerItem[], outputs: OutputItem[]): Record<Section, PanelContent> {
  const t = home[lang]
  const b = town[lang].buildings
  return {
    about: { eyebrow: b.about.title, title: 'Kota Mizuno', body: <About lang={lang} /> },
    works: { eyebrow: b.works.title, title: t.projects.title, body: <Works lang={lang} /> },
    // career は古い順。パネルでは今の会社を先に出す
    career: { eyebrow: b.career.title, title: t.career.title, body: <Career lang={lang} items={career} /> },
    output: { eyebrow: b.output.title, title: t.output.title, body: <Output lang={lang} items={outputs.slice(0, 7)} total={outputs.length} /> },
    contact: { eyebrow: b.contact.title, title: t.contact.title, body: <Contact lang={lang} /> },
  }
}
