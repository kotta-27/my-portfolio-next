import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Lang } from '@/types'
import { projectsData } from '@/data/projects'
import { Tag } from '@/components/Tag'
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

  return (
    <div className="min-h-screen bg-[#edeae3] font-sans text-[#1a1a1a]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-7 pt-6 pb-20">
        <FadeIn delay={0}>
          <Link
            href={`/?lang=${lang}#projects`}
            className="inline-flex items-center gap-[6px] text-[12px] text-[#999] no-underline hover:text-[#1a1a1a] transition-colors duration-150 mb-8"
          >
            ← {lang === 'ja' ? '戻る' : 'Back'}
          </Link>
        </FadeIn>

        <FadeIn delay={60}>
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="relative h-[240px] sm:h-[420px] bg-[#f4f4f4]">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="p-7 sm:p-10">
              <FadeIn delay={140}>
                <h1 className="text-[24px] sm:text-[32px] font-bold text-[#1a1a1a] mb-3">
                  {project.name}
                </h1>
              </FadeIn>

              <FadeIn delay={200}>
                <div className="flex flex-wrap gap-[6px] mb-6">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={260}>
                <p className="text-[14px] sm:text-[15px] leading-[1.9] text-[#555] mb-8 max-w-[680px]">
                  {project.detail[lang]}
                </p>
              </FadeIn>

              {project.links.length > 0 && (
                <FadeIn delay={320}>
                  <div className="flex flex-wrap gap-3">
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
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
