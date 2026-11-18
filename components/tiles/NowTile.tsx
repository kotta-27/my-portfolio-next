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
      {/* ロゴは PC ではブロックの右に上下中央で置く。モバイルは幅が狭く文字と重なるので出さない */}
      <div className="absolute right-4 top-1/2 hidden h-[64px] w-[64px] -translate-y-1/2 sm:block dark:rounded-[10px] dark:bg-white">
        <Image src="/studist.png" alt={a.currentCompany} fill sizes="64px" className="object-contain dark:p-[8px]" />
      </div>
      <TileLabel>{t.currently}</TileLabel>
      {/* 会社名・役職・期間はラベルのすぐ下に上揃えで（学歴タイルと同じ間隔） */}
      <div className="mt-1">
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
