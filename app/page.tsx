import { redirect } from 'next/navigation'
import type { Lang } from '@/types'
import { featured } from '@/data/home'
import { projectsData } from '@/data/projects'
import { getLang } from '@/lib/lang'
import { loadCareer } from '@/lib/career'
import { collectOutputs } from '@/lib/outputs'
import { TownView } from '@/components/town/TownView'
import { townPanels } from '@/components/town/Panels'

/** 以前のタブ表示（?view=…）へのリンクは、それぞれの一覧ページへ送る */
const LEGACY_VIEWS: Record<string, string> = { career: '/career', projects: '/projects', writing: '/output' }

/** トップ。画面いっぱいの「レゴの街」だけ（components/town/TownView.tsx）。詳しい中身は各一覧ページへ */
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
    <main className="font-sans text-ink">
      <h1 className="sr-only">Kota Mizuno</h1>
      <TownView key={lang} lang={lang} panels={townPanels(lang, career, outputs)} workImages={workImages} careerLogos={careerLogos} />
    </main>
  )
}
