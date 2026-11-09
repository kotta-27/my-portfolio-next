import { redirect } from 'next/navigation'
import type { Lang } from '@/types'
import { home } from '@/data/home'
import { getLang } from '@/lib/lang'
import { loadCareer } from '@/lib/career'
import { collectOutputs } from '@/lib/outputs'
import { SiteShell } from '@/components/home/SiteShell'
import { ClockScene } from '@/components/home/ClockScene'
import { CareerStrip, ContactBand, FactCards, FeaturedProjects, OutputCards } from '@/components/home/Sections'

/** 以前のタブ表示（?view=…）へのリンクは、それぞれの一覧ページへ送る */
const LEGACY_VIEWS: Record<string, string> = { career: '/career', projects: '/projects', writing: '/output' }

/** トップに並べる「書いたもの」の数。ノートを先に、残りを記事・ブログで埋める */
const OUTPUT_ON_HOME = 6

export default async function Page({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  if (view && LEGACY_VIEWS[view]) redirect(LEGACY_VIEWS[view])

  const lang: Lang = await getLang()
  const t = home[lang]
  const career = await loadCareer()
  const outputs = collectOutputs()

  return (
    <SiteShell lang={lang}>
        <section className="grid items-center gap-2 pt-4 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)] lg:pt-6">
          <div className="flex flex-col gap-6 sm:gap-7">
            <p className="font-mono text-[12px] font-bold tracking-[.08em] text-mute sm:text-[13px]">{t.hero.eyebrow}</p>
            <h1 className="text-[64px] font-extrabold leading-[0.92] tracking-[-0.045em] sm:text-[96px] lg:text-[104px]">
              Kota
              <br />
              <span className="font-medium text-mute">Mizuno</span>
            </h1>
            <div className="flex max-w-[540px] flex-col gap-3">
              <p className="text-[19px] font-extrabold leading-[1.5] tracking-[-0.01em] sm:text-[22px]">{t.hero.headline}</p>
              <p className="text-[14.5px] leading-[1.9] text-ink/75 sm:text-[16px]">{t.hero.sub}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="rounded-[12px] bg-ink px-6 py-[15px] text-[15px] font-bold text-paper no-underline shadow-[0_4px_0_rgb(var(--shadow-rgb)/0.9)] transition-transform duration-150 active:translate-y-[2px]">
                {t.hero.work}
              </a>
              <a href="https://github.com/kotta-27" target="_blank" rel="noopener noreferrer" className="rounded-[12px] bg-tile px-6 py-[15px] text-[15px] font-bold text-ink no-underline shadow-[0_4px_0_rgb(var(--shadow-rgb)/0.14)] transition-transform duration-150 active:translate-y-[2px]">
                GitHub
              </a>
            </div>
          </div>
          <div className="relative -mx-5 h-[300px] sm:mx-0 sm:h-[460px] lg:-mr-16 lg:h-[clamp(480px,74vh,640px)]">
            <ClockScene label={t.hero.sceneLabel} hint={t.hero.sceneHint} />
          </div>
        </section>

        <div className="-mt-12 sm:-mt-16">
          <FactCards lang={lang} />
        </div>

        <FeaturedProjects lang={lang} />
        <CareerStrip lang={lang} items={career} />
        <OutputCards lang={lang} items={outputs.slice(0, OUTPUT_ON_HOME)} total={outputs.length} />
        <ContactBand lang={lang} />
    </SiteShell>
  )
}
