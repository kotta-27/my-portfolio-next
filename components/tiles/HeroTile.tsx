import Image from 'next/image'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import type { Lang } from '@/types'
import { hero } from '@/data/hero'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

const linkBase =
  'inline-flex items-center justify-center gap-[6px] whitespace-nowrap rounded-full px-[14px] py-[7px] text-[11.5px] font-bold no-underline transition-colors duration-150'

export function HeroTile({ lang }: { lang: Lang }) {
  const h = hero[lang]
  return (
    <Tile id="hero" className="p-5 sm:p-6">
      <TileLabel>{h.roleTag}</TileLabel>
      {/* スマホ: 文章 | 画像 の下にボタンを全幅で。sm 以上: ボタンは文章の下、画像は右に縦通し */}
      <div className="mt-5 grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 gap-y-4 sm:grid-rows-[1fr_auto]">
        <div className="min-w-0 self-end">
          <h1 className="text-[40px] font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-[56px]">
            Kota
            <br />
            <span className="font-medium text-mute">Mizuno</span>
          </h1>
          <p className="mt-3 max-w-[32ch] text-[13px] leading-[1.6] text-mute">
            {h.tagline}
            {h.currentlyAt && (
              <>
                <br />
                {h.currentlyAt}
              </>
            )}
          </p>
        </div>
        <div className="relative aspect-[5/6] w-[96px] shrink-0 self-end overflow-hidden rounded-[14px] sm:row-span-2 sm:w-[136px]">
          <Image src="/mepic2.png" alt="Kota Mizuno" fill priority sizes="(min-width: 640px) 136px, 96px" className="object-cover" />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:w-fit">
          <a href="#projects" className={`${linkBase} bg-ink text-white hover:bg-teal`}>
            {h.viewWork}
          </a>
          <a
            href="https://github.com/kotta-27"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkBase} bg-soft text-ink hover:bg-ground`}
          >
            <FaGithub className="shrink-0 text-[14px]" />
            kotta-27
          </a>
          <a
            href="https://x.com/Melmol_27"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkBase} bg-soft text-ink hover:bg-ground`}
          >
            <FaXTwitter className="shrink-0 text-[13px]" />
            @Melmol_27
          </a>
          <a
            href="https://youtrust.jp/users/356b120bc6d76c20101a4096b1896d95"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkBase} bg-soft text-ink hover:bg-ground`}
          >
            YouTrust
          </a>
        </div>
      </div>
    </Tile>
  )
}
