import type { Metadata } from 'next'
import { home } from '@/data/home'
import { projectsData } from '@/data/projects'
import { getLang } from '@/lib/lang'
import { SiteShell } from '@/components/home/SiteShell'
import { PageHead, ProjectRow } from '@/components/home/Sections'

export const metadata: Metadata = { title: 'Projects — Kota Mizuno' }

/** 作ったものの一覧（トップの代表作 4 件以外も含めて全部） */
export default async function ProjectsPage() {
  const lang = await getLang()
  const t = home[lang]
  return (
    <SiteShell lang={lang}>
      <div className="flex flex-col gap-10">
        <PageHead back={t.pages.back} eyebrow={t.projects.eyebrow} title={t.pages.projects.title} blurb={t.pages.projects.blurb} />
        <ul>
          {projectsData.map((p) => (
            <ProjectRow key={p.slug} project={p} lang={lang} />
          ))}
        </ul>
      </div>
    </SiteShell>
  )
}
