import Image from 'next/image'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { about } from '@/data/about'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

export function NowTile({ lang }: { lang: Lang }) {
  const t = ui[lang].tiles
  const a = about[lang]
  return (
    <Tile>
      {/* ロゴは右上の空きスペースにそのまま置く */}
      <div className="absolute right-3 top-3 h-[40px] w-[40px] sm:right-4 sm:top-4 sm:h-[64px] sm:w-[64px]">
        <Image src="/studist.png" alt={a.currentCompany} fill className="object-contain" />
      </div>
      <TileLabel>{t.currently}</TileLabel>
      <div className="mt-auto">
        <a
          href="https://studist.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[13px] font-extrabold leading-tight text-ink no-underline hover:text-teal transition-colors duration-150 sm:text-[13.5px]"
        >
          {a.currentCompany}
        </a>
        <p className="mt-[3px] text-[11.5px] leading-[1.45] text-mute">
          {a.currentRole}
          <br />
          {a.currentPeriod}
        </p>
      </div>
    </Tile>
  )
}
