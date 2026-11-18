import type { Metadata } from 'next'
import { Suspense } from 'react'
import { home } from '@/data/home'
import { getLang } from '@/lib/lang'
import { SiteShell } from '@/components/home/SiteShell'
import { PageHead } from '@/components/home/Sections'
import { CareerTimelineTile } from '@/components/tiles/CareerTimelineTile'
import { TileSkeleton } from '@/components/TileSkeleton'

export const metadata: Metadata = { title: 'Career — Kota Mizuno' }

/** 経歴の詳細。各社のポジション・やったこと・関連記事まで */
export default async function CareerPage() {
  const lang = await getLang()
  const t = home[lang]
  return (
    <SiteShell lang={lang}>
      <div className="flex flex-col gap-10">
        <PageHead back={t.pages.back} eyebrow={t.career.eyebrow} title={t.pages.career.title} blurb={t.pages.career.blurb} />
        <Suspense fallback={<TileSkeleton className="h-[600px]" />}>
          <CareerTimelineTile lang={lang} bare />
        </Suspense>
      </div>
    </SiteShell>
  )
}
