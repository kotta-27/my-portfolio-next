import { notFound } from 'next/navigation'
import { PiArrowUpRight, PiCheckCircleFill, PiMedalFill, PiQuotes } from 'react-icons/pi'
import type { Lang } from '@/types'
import { projectsData } from '@/data/projects'
import { ui } from '@/data/ui'
import { Reveal } from '@/components/Reveal'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'
import { Tag } from '@/components/Tag'
import { LangToggle } from '@/components/LangToggle'
import { ProjectImageCarousel } from '@/components/ProjectImageCarousel'
import { BackLink } from '@/components/BackLink'
import { ProjectNeighborTile } from '@/components/tiles/ProjectNeighborTile'

export function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}) {
  const { slug } = await params
  const { lang: rawLang } = await searchParams
  const lang: Lang = rawLang === 'ja' ? 'ja' : 'en'

  const index = projectsData.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()
  const project = projectsData[index]
  const prev = projectsData[(index - 1 + projectsData.length) % projectsData.length]
  const next = projectsData[(index + 1) % projectsData.length]
  const t = ui[lang].projectMeta
  const meta = project.meta

  const facts: { label: string; value: string }[] = [
    meta?.period && { label: t.period, value: meta.period[lang] },
    meta?.role && { label: t.role, value: meta.role[lang].join(', ') },
    meta?.members && { label: t.members, value: meta.members[lang] },
    meta?.event && { label: t.event, value: meta.event },
  ].filter((f): f is { label: string; value: string } => Boolean(f))

  return (
    <div className="min-h-screen bg-ground font-sans text-ink">
      <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-3 sm:px-6">
        <div className="relative z-[200] mb-3 flex items-center justify-between">
          <BackLink href={`/?lang=${lang}`} label={t.back} />
          <LangToggle lang={lang} />
        </div>

        <Reveal span={4}>
          <Tile pad={false}>
            <ProjectImageCarousel
              images={project.images && project.images.length > 0 ? project.images : [project.image]}
              alt={project.name}
            />

            <div className="flex flex-col gap-10 p-6 sm:p-10">
              {/* Header */}
              <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <TileLabel>{ui[lang].sections.projects}</TileLabel>
                    {project.badge && (
                      <span className="inline-flex items-center gap-[3px] rounded-full bg-coral px-[8px] py-[3px] text-[10px] font-extrabold text-white">
                        <PiMedalFill className="text-[11px]" />
                        {project.badge}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-2 text-[32px] font-extrabold leading-[1] tracking-[-0.035em] sm:text-[44px]">
                    {project.name}
                  </h1>
                  <p className="mt-3 max-w-[60ch] text-[13.5px] leading-[1.6] text-mute">{project[lang]}</p>
                  <div className="mt-3 flex flex-wrap gap-[5px]">
                    {project.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
                {project.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end">
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-[5px] rounded-full bg-ink px-4 py-[9px] text-[11.5px] font-bold text-white no-underline transition-colors duration-150 hover:bg-teal"
                      >
                        {link.label}
                        <PiArrowUpRight className="text-[13px]" />
                      </a>
                    ))}
                  </div>
                )}
              </header>

              <p className="max-w-[72ch] text-[14px] leading-[1.9] text-ink/80 sm:text-[15px]">{project.detail[lang]}</p>

              {facts.length > 0 && (
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {facts.map((fact) => (
                    <div key={fact.label} className="rounded-[14px] bg-soft px-4 py-3">
                      <dt className="text-[10.5px] font-bold uppercase tracking-[.08em] text-mute">{fact.label}</dt>
                      <dd className="mt-1 text-[14px] font-extrabold leading-snug tracking-[-0.01em]">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {(meta?.techStack || meta?.contributions) && (
                <div className="grid grid-cols-1 gap-10 border-t border-soft pt-8 sm:grid-cols-2">
                  {meta?.techStack && (
                    <section>
                      <TileLabel>{t.techStack}</TileLabel>
                      <ul className="mt-2 flex flex-col divide-y divide-soft">
                        {meta.techStack.map((cat) => (
                          <li key={cat.category} className="grid grid-cols-[84px_1fr] items-start gap-3 py-[9px] first:pt-0 last:pb-0">
                            <span className="pt-[3px] text-[11px] font-bold uppercase tracking-[.06em] text-mute">{cat.category}</span>
                            <div className="flex flex-wrap gap-[5px]">
                              {cat.items.map((item) => (
                                <span key={item} className="rounded-full bg-soft px-[10px] py-[4px] text-[11.5px] font-bold">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {meta?.contributions && (
                    <section>
                      <TileLabel>{t.contributions}</TileLabel>
                      <ul className="mt-2 flex flex-col gap-[9px]">
                        {meta.contributions[lang].map((item) => (
                          <li key={item} className="flex items-start gap-[8px] text-[13px] font-semibold leading-[1.5]">
                            <PiCheckCircleFill className="mt-[2px] shrink-0 text-[16px] text-teal" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}

              {meta?.reflection && (
                <section className="rounded-[14px] bg-ink p-5 text-white sm:p-6">
                  <TileLabel className="text-white/55">{t.reflection}</TileLabel>
                  <div className="mt-2 flex items-start gap-4">
                    <PiQuotes className="hidden shrink-0 text-[34px] text-teal sm:block" />
                    <p className="max-w-[72ch] text-[14px] leading-[1.9] text-white/85 sm:text-[15px]">
                      {meta.reflection[lang]}
                    </p>
                  </div>
                </section>
              )}
            </div>
          </Tile>
        </Reveal>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Reveal span={1} index={1}>
            <ProjectNeighborTile project={prev} lang={lang} direction="prev" label={t.prevProject} />
          </Reveal>
          <Reveal span={1} index={2}>
            <ProjectNeighborTile project={next} lang={lang} direction="next" label={t.nextProject} />
          </Reveal>
        </div>

        <div className="mt-8 flex justify-center">
          <BackLink href={`/?lang=${lang}`} label={t.backToProjects} />
        </div>
      </div>
    </div>
  )
}
