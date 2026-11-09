import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PiArrowLeftBold, PiArrowRightBold, PiArrowUpRightBold, PiCheckCircleFill, PiMedalFill, PiQuotes } from 'react-icons/pi'
import type { Lang } from '@/types'
import { projectsData, type ProjectItem } from '@/data/projects'
import { ui } from '@/data/ui'
import { home } from '@/data/home'
import { getLang } from '@/lib/lang'
import { SiteShell } from '@/components/home/SiteShell'
import { ProjectImageCarousel } from '@/components/ProjectImageCarousel'

export function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug }))
}

const eyebrow = 'font-mono text-[11.5px] font-bold uppercase tracking-[.08em] text-mute'

/** 前後のプロジェクトへのリンク */
function Neighbor({ project, label, dir }: { project: ProjectItem; label: string; dir: 'prev' | 'next' }) {
  return (
    <a
      href={`/projects/${project.slug}`}
      className={`group flex items-center gap-4 rounded-[18px] bg-tile p-4 text-ink no-underline ${dir === 'next' ? 'flex-row-reverse text-right' : ''}`}
    >
      <span className="relative block aspect-[16/10] w-[120px] shrink-0 overflow-hidden rounded-[10px] bg-soft sm:w-[160px]">
        <Image src={project.image} alt="" fill sizes="160px" className="object-cover object-top" />
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className={`inline-flex items-center gap-[6px] ${eyebrow} ${dir === 'next' ? 'justify-end' : ''}`}>
          {dir === 'prev' && <PiArrowLeftBold className="text-[11px]" />}
          {label}
          {dir === 'next' && <PiArrowRightBold className="text-[11px]" />}
        </span>
        <span className="truncate text-[17px] font-extrabold transition-colors duration-150 group-hover:text-teal sm:text-[19px]">{project.name}</span>
      </span>
    </a>
  )
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lang: Lang = await getLang()
  const index = projectsData.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()
  const project = projectsData[index]
  const prev = projectsData[(index - 1 + projectsData.length) % projectsData.length]
  const next = projectsData[(index + 1) % projectsData.length]
  const t = ui[lang].projectMeta
  const h = home[lang]
  const meta = project.meta

  const facts = [
    meta?.period && { label: t.period, value: meta.period[lang] },
    meta?.role && { label: t.role, value: meta.role[lang].join(', ') },
    meta?.members && { label: t.members, value: meta.members[lang] },
    meta?.event && { label: t.event, value: meta.event },
  ].filter((f): f is { label: string; value: string } => Boolean(f))

  return (
    <SiteShell lang={lang}>
      <article className="flex flex-col gap-10 pt-6 sm:pt-10">
        <header className="flex flex-col gap-4">
          <a href="/projects" className="group inline-flex w-fit items-center gap-[6px] text-[14px] font-bold text-mute no-underline hover:text-ink">
            <PiArrowLeftBold className="text-[12px] transition-transform duration-200 group-hover:-translate-x-[3px]" />
            {h.pages.projects.title}
          </a>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[44px] font-extrabold leading-none tracking-[-0.04em] sm:text-[64px]">{project.name}</h1>
                {project.badge && (
                  <span className="inline-flex items-center gap-[4px] rounded-[6px] bg-coral px-2 py-[4px] text-[12px] font-extrabold text-paper">
                    <PiMedalFill className="text-[13px]" />
                    {project.badge[lang]}
                  </span>
                )}
              </div>
              <p className="max-w-[640px] text-[15px] leading-[1.8] text-ink/75 sm:text-[17px]">{project[lang]}</p>
            </div>
            {project.links.length > 0 && (
              <div className="flex flex-wrap gap-2 lg:shrink-0 lg:justify-end">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-[6px] rounded-[12px] bg-ink px-5 py-3 text-[14px] font-bold text-paper no-underline transition-colors duration-150 hover:bg-teal"
                  >
                    {link.label}
                    <PiArrowUpRightBold className="text-[13px]" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="overflow-hidden rounded-[24px] bg-tile">
          <ProjectImageCarousel images={project.images && project.images.length > 0 ? project.images : [project.image]} alt={project.name} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div className="flex min-w-0 flex-col gap-10">
            <p className="whitespace-pre-line text-[15px] leading-[2] text-ink/85 sm:text-[16px]">{project.detail[lang]}</p>

            {meta?.contributions && (
              <section className="flex flex-col gap-4">
                <h2 className={eyebrow}>{t.contributions}</h2>
                <ul className="flex flex-col gap-3">
                  {meta.contributions[lang].map((item) => (
                    <li key={item} className="flex items-start gap-[10px] text-[15px] font-semibold leading-[1.6]">
                      <PiCheckCircleFill className="mt-[3px] shrink-0 text-[18px] text-teal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {meta?.reflection && (
              <section className="flex flex-col gap-3 rounded-[18px] bg-slab p-6 text-slab-fg sm:p-8">
                <h2 className="font-mono text-[11.5px] font-bold uppercase tracking-[.08em] text-slab-fg/60">{t.reflection}</h2>
                <div className="flex items-start gap-4">
                  <PiQuotes className="hidden shrink-0 text-[34px] text-teal sm:block" />
                  <p className="whitespace-pre-line text-[15px] leading-[1.9] text-slab-fg/85">{meta.reflection[lang]}</p>
                </div>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-6 self-start rounded-[18px] bg-tile p-6 lg:sticky lg:top-24">
            {facts.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-1">
                    <dt className={eyebrow}>{fact.label}</dt>
                    <dd className="text-[15px] font-extrabold leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="flex flex-col gap-3">
              <h2 className={eyebrow}>{t.techStack}</h2>
              {meta?.techStack ? (
                <ul className="flex flex-col gap-3">
                  {meta.techStack.map((cat) => (
                    <li key={cat.category} className="flex flex-col gap-[6px]">
                      <span className="text-[12px] font-bold text-mute">{cat.category}</span>
                      <span className="flex flex-wrap gap-[6px]">
                        {cat.items.map((item) => (
                          <span key={item} className="rounded-[6px] bg-soft px-[10px] py-[5px] text-[12.5px] font-bold">
                            {item}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="flex flex-wrap gap-[6px]">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-[6px] bg-soft px-[10px] py-[5px] text-[12.5px] font-bold">
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </aside>
        </div>

        <nav aria-label="Projects" className="grid gap-4 sm:grid-cols-2">
          <Neighbor project={prev} label={t.prevProject} dir="prev" />
          <Neighbor project={next} label={t.nextProject} dir="next" />
        </nav>
      </article>
    </SiteShell>
  )
}
