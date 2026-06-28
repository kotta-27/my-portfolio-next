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
      <main className="max-w-[920px] mx-auto px-4 sm:px-7 pt-5 pb-20 flex flex-col gap-[10px]">
        <Hero lang={lang} />
        <About lang={lang} />
        <Career lang={lang} />
        <Skills lang={lang} />
        <Projects lang={lang} />
        <Awards lang={lang} />
        <Contact lang={lang} />
        <div className="flex justify-between items-center px-[2px]">
          <p className="text-[11px] font-light text-[#999]">{t.footer}</p>
          <a
            href="?"
            className="text-[11px] font-light text-[#999] no-underline hover:text-[#555] transition-colors duration-150"
          >
            ↑ Top
          </a>
        </div>
      </main>
    </div>
  )
}
