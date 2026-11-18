import { redirect } from 'next/navigation'
import type { Lang } from '@/types'
import { home } from '@/data/home'
import { featured } from '@/data/home'
import { projectsData } from '@/data/projects'
import { getLang } from '@/lib/lang'
import { loadCareer } from '@/lib/career'
import { collectOutputs } from '@/lib/outputs'
import { TownView } from '@/components/town/TownView'
import { townPanels } from '@/components/town/Panels'
import { CareerStrip, ContactBand, FactCards, FeaturedProjects, OutputCards } from '@/components/home/Sections'

/** 以前のタブ表示（?view=…）へのリンクは、それぞれの一覧ページへ送る */
const LEGACY_VIEWS: Record<string, string> = { career: '/career', projects: '/projects', writing: '/output' }

/** 街の下の一覧に並べる「書いたもの」の数 */
const OUTPUT_ON_HOME = 6

/**
 * トップ。画面いっぱいの「レゴの街」（components/town/TownView.tsx）と、その下に同じ中身を縦に並べた一覧。
 * 一覧は、街を歩かずに読みたい人・検索エンジン・WebGL が使えない環境のためのもの。
 */
export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  if (view && LEGACY_VIEWS[view]) redirect(LEGACY_VIEWS[view])

  const lang: Lang = await getLang()
  const career = await loadCareer()
  const outputs = collectOutputs()
  // 工房の窓に飾る代表作と、建物の各階のロゴ（下の階 = 古い会社から。loadCareer は古い順に返す）
  const workImages = featured.flatMap((f) => projectsData.filter((p) => p.slug === f.slug).map((p) => p.image)).slice(0, 3)
  const careerLogos = career.map((c) => c.logo)

  return (
    <div className="font-sans text-ink">
      <TownView key={lang} lang={lang} panels={townPanels(lang, career, outputs)} workImages={workImages} careerLogos={careerLogos} />
      <main id="list" className="mx-auto flex max-w-[1312px] scroll-mt-6 flex-col gap-24 px-5 pb-16 pt-20 sm:gap-28 sm:px-8 sm:pt-28 lg:px-16">
        <header className="flex flex-col gap-4">
          <span className="font-mono text-[12px] font-bold tracking-[.08em] text-mute">{home[lang].hero.eyebrow}</span>
          <h1 className="text-[44px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[64px]">Kota Mizuno</h1>
          <p className="max-w-[640px] text-[17px] font-extrabold leading-[1.6] sm:text-[20px]">{home[lang].hero.headline}</p>
          <p className="max-w-[640px] text-[15px] leading-[1.85] text-ink/75">{home[lang].hero.sub}</p>
        </header>
        <FactCards lang={lang} />
        <FeaturedProjects lang={lang} />
        <CareerStrip lang={lang} items={career} />
        <OutputCards lang={lang} items={outputs.slice(0, OUTPUT_ON_HOME)} total={outputs.length} />
        <ContactBand lang={lang} />
      </main>
      <footer className="pb-10 text-center text-[12px] text-mute">{home[lang].footer}</footer>
    </div>
  )
}
