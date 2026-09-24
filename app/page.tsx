import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { projectsData } from '@/data/projects'
import { articles } from '@/data/awards'
import { ViewProvider } from '@/components/ViewContext'
import { Nav } from '@/components/Nav'
import { IntroOverlay } from '@/components/IntroOverlay'
import { BentoGrid, type BentoItemDef } from '@/components/BentoGrid'
import { HeroTile } from '@/components/tiles/HeroTile'
import { NowTile } from '@/components/tiles/NowTile'
import { ClockTile } from '@/components/tiles/ClockTile'
import { EducationTile } from '@/components/tiles/EducationTile'
import { HobbiesTile } from '@/components/tiles/HobbiesTile'
import { SkillsTile } from '@/components/tiles/SkillsTile'
import { CareerTile } from '@/components/tiles/CareerTile'
import { AwardsTile } from '@/components/tiles/AwardsTile'
import { ArticlesTile } from '@/components/tiles/ArticlesTile'
import { ArticleTile } from '@/components/tiles/ArticleTile'
import { ProjectTile } from '@/components/tiles/ProjectTile'
import { ProjectsHeadTile } from '@/components/tiles/ProjectsHeadTile'
import { ContactTile } from '@/components/tiles/ContactTile'

/** Projects shown in the overview before the "+N more" tile. */
const VISIBLE_PROJECTS = 7

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang: rawLang } = await searchParams
  const lang: Lang = rawLang === 'ja' ? 'ja' : 'en'
  const t = ui[lang]

  const items: BentoItemDef[] = [
    { key: 'hero', views: ['all'], span: 2, rows: 2, node: <HeroTile lang={lang} /> },
    { key: 'now', views: ['all'], node: <NowTile lang={lang} /> },
    { key: 'clock', views: ['all'], node: <ClockTile label={t.tiles.tokyo} sub={t.tiles.tokyoSub} /> },
    // 幅の狭い画面では 1 カラムだと詰まるので全幅にする
    { key: 'education', views: ['all'], mobileFull: true, node: <EducationTile lang={lang} /> },
    { key: 'hobbies', views: ['all'], mobileFull: true, node: <HobbiesTile lang={lang} /> },
    { key: 'skills', views: ['all', 'skills'], span: 4, node: <SkillsTile lang={lang} /> },
    { key: 'career', views: ['all', 'career'], span: 4, node: <CareerTile lang={lang} /> },
    { key: 'projects-head', views: ['all', 'projects'], node: <ProjectsHeadTile lang={lang} count={projectsData.length} /> },
    ...projectsData.map((project, i) => ({
      key: `project-${project.slug}`,
      views: ['all' as const, 'projects' as const],
      overflow: i >= VISIBLE_PROJECTS,
      node: <ProjectTile project={project} lang={lang} />,
    })),
    { key: 'awards', views: ['all'], span: 2, node: <AwardsTile lang={lang} /> },
    // Overview shows one Writing tile; the Writing view breaks it into one card per article
    { key: 'writing', views: ['all'], span: 2, node: <ArticlesTile lang={lang} /> },
    ...articles.map((article) => ({
      key: `article-${article.href}`,
      views: ['writing' as const],
      node: <ArticleTile article={article} lang={lang} />,
    })),
    { key: 'contact', views: ['all'], node: <ContactTile lang={lang} /> },
  ]

  return (
    <ViewProvider>
      <IntroOverlay />
      <div className="min-h-screen bg-ground font-sans text-ink">
        <Nav lang={lang} />
        <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-3 sm:px-6">
          <BentoGrid items={items} labels={{ more: t.tiles.moreProjects, less: t.tiles.lessProjects }} />
          <footer className="flex flex-col items-center gap-3 pt-10">
            <a
              href="?"
              className="text-[11.5px] font-bold uppercase tracking-[.06em] text-mute no-underline transition-colors duration-150 hover:text-ink"
            >
              ↑ Back to Top
            </a>
            <p className="text-[11px] text-mute">{t.footer}</p>
          </footer>
        </main>
      </div>
    </ViewProvider>
  )
}
