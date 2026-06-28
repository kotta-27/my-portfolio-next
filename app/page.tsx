import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Career } from '@/components/Career'
import { Skills } from '@/components/Skills'
import { Projects } from '@/components/Projects'
import { Awards } from '@/components/Awards'
import { Contact } from '@/components/Contact'
import { ScrollReveal } from '@/components/ScrollReveal'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang: rawLang } = await searchParams
  const lang: Lang = rawLang === 'ja' ? 'ja' : 'en'
  const t = ui[lang]

  return (
    <div className="min-h-screen bg-[#edeae3] font-sans text-[#1a1a1a]">
      <Nav lang={lang} />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-7 pt-5 pb-20 flex flex-col gap-[30px]">
        <Hero lang={lang} />
        <ScrollReveal><About lang={lang} /></ScrollReveal>
        <ScrollReveal><Career lang={lang} /></ScrollReveal>
        <ScrollReveal><Skills lang={lang} /></ScrollReveal>
        <ScrollReveal><Projects lang={lang} /></ScrollReveal>
        <ScrollReveal><Awards lang={lang} /></ScrollReveal>
        <ScrollReveal><Contact lang={lang} /></ScrollReveal>
        <ScrollReveal>
          <div className="flex flex-col items-center gap-4 py-4">
            <a
              href="?"
              className="text-[12px] font-medium tracking-[.06em] uppercase text-[#999] no-underline hover:text-[#1a1a1a] transition-colors duration-150"
            >
              ↑ Back to Top
            </a>
            <p className="text-[11px] font-light text-[#999]">{t.footer}</p>
          </div>
        </ScrollReveal>
      </main>
    </div>
  )
}
