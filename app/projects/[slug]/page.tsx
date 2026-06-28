import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Lang } from '@/types'
import { projectsData } from '@/data/projects'
import { ui } from '@/data/ui'
import { Tag } from '@/components/Tag'
import { LangToggle } from '@/components/LangToggle'
import { FadeIn } from './ProjectPageClient'

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

  const project = projectsData.find((p) => p.slug === slug)
  if (!project) notFound()
  const t = ui[lang].projectMeta

  return (
    <div className="min-h-screen bg-[#edeae3] font-sans text-[#1a1a1a]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-7 pt-6 pb-20">
        <FadeIn delay={0} className="relative z-[200]">
          <div className="flex items-center justify-between mb-8">
            <Link
              href={`/?lang=${lang}#projects`}
              className="inline-flex items-center gap-[6px] text-[12px] text-[#999] no-underline hover:text-[#1a1a1a] transition-colors duration-150 z-100"
            >
              ← {t.back}
            </Link>
            <LangToggle lang={lang} />
          </div>
        </FadeIn>

        <div className="bg-white rounded-2xl overflow-hidden pt-6">
          <FadeIn delay={60}>
            <div className="h-[240px] sm:h-[420px] bg-white flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.name}
                className="max-h-full max-w-full object-contain border border-[#e8e8e8] rounded-[4px]"
              />
            </div>
          </FadeIn>

          <div className="p-7 sm:p-10">
            <FadeIn delay={120}>
              <div className="flex items-center justify-between gap-4 mb-3">
                <h1 className="text-[24px] sm:text-[32px] font-bold text-[#1a1a1a]">
                  {project.name}
                </h1>
                {project.links.length > 0 && (
                  <div className="hidden sm:flex flex-wrap gap-2 shrink-0">
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-[6px] text-[12px] font-medium tracking-[.04em] uppercase no-underline bg-[#1a1a1a] text-white rounded-lg px-5 py-[10px] hover:bg-[#333] transition-colors duration-150"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={240}>
              <p className="text-[14px] sm:text-[15px] leading-[1.9] text-[#555] mb-8">
                {project.detail[lang]}
              </p>
            </FadeIn>

            {project.links.length > 0 && (
              <FadeIn delay={280}>
                <div className="flex sm:hidden flex-wrap gap-3 mb-10">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-[6px] text-[12px] font-medium tracking-[.04em] uppercase no-underline bg-[#1a1a1a] text-white rounded-lg px-5 py-[10px] hover:bg-[#333] transition-colors duration-150"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </FadeIn>
            )}

            {project.meta && (
              <FadeIn delay={320}>
                <div className="border-t border-[#f0f0f0] pt-8 flex flex-col gap-8">

                  {project.meta.reflection && (
                    <div>
                      <p className="text-[15px] font-semibold tracking-[.1em] uppercase text-[#aaa] mb-3">
                        {t.reflection}
                      </p>
                      <p className="text-[13.5px] leading-[1.9] text-[#555]">
                        {project.meta.reflection[lang]}
                      </p>
                    </div>
                  )}

                  {project.meta.contributions && (
                    <div>
                      <p className="text-[15px] font-semibold tracking-[.1em] uppercase text-[#aaa] mb-3">
                        {t.contributions}
                      </p>
                      <ul className="ml-4 flex flex-col gap-[8px]">
                        {project.meta.contributions[lang].map((item) => (
                          <li key={item} className="flex items-center gap-3 text-[13px] text-[#555]">
                            <span className="w-[4px] h-[4px] rounded-full bg-[#ccc] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.meta.techStack && (
                    <div>
                      <p className="text-[15px] font-semibold tracking-[.1em] uppercase text-[#aaa] mb-3">
                        {t.techStack}
                      </p>
                      <div className="flex flex-col gap-[10px]">
                        {project.meta.techStack.map((cat) => (
                          <div key={cat.category} className="flex items-start gap-4">
                            <span className="text-[13px] text-[#888] w-[72px] shrink-0 pt-[2px]">{cat.category}</span>
                            <div className="w-px bg-[#e8e8e8] self-stretch shrink-0" />
                            <span className="text-[13px] text-[#444]">{cat.items.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {project.meta.period && (
                      <div>
                        <p className="text-[15px] font-semibold tracking-[.1em] uppercase text-[#aaa] mb-1">
                          {t.period}
                        </p>
                        <p className="text-[13px] text-[#333]">{project.meta.period[lang]}</p>
                      </div>
                    )}
                    {project.meta.role && (
                      <div>
                        <p className="text-[15px] font-semibold tracking-[.1em] uppercase text-[#aaa] mb-1">
                          {t.role}
                        </p>
                        <p className="text-[13px] text-[#333]">{project.meta.role[lang].join(', ')}</p>
                      </div>
                    )}
                    {project.meta.members && (
                      <div>
                        <p className="text-[15px] font-semibold tracking-[.1em] uppercase text-[#aaa] mb-1">
                          {t.members}
                        </p>
                        <p className="text-[13px] text-[#333]">{project.meta.members[lang]}</p>
                      </div>
                    )}
                    {project.meta.event && (
                      <div>
                        <p className="text-[15px] font-semibold tracking-[.1em] uppercase text-[#aaa] mb-1">
                          {t.event}
                        </p>
                        <p className="text-[13px] text-[#333]">{project.meta.event}</p>
                      </div>
                    )}
                  </div>

                </div>
              </FadeIn>
            )}
          </div>
        </div>

        <FadeIn delay={400}>
          <div className="mt-8">
            <Link
              href={`/?lang=${lang}#projects`}
              className="inline-flex items-center gap-[6px] text-[12px] text-[#999] no-underline hover:text-[#1a1a1a] transition-colors duration-150"
            >
              ← {t.backToProjects}
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
