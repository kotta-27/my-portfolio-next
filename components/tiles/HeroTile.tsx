import Image from 'next/image'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import type { Lang } from '@/types'
import { hero } from '@/data/hero'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

const linkBase =
  'inline-flex items-center gap-[6px] rounded-full px-[14px] py-[7px] text-[11.5px] font-bold no-underline transition-colors duration-150'

export function HeroTile({ lang }: { lang: Lang }) {
  const h = hero[lang]
  return (
    <Tile id="hero" className="p-5 sm:p-6">
      <TileLabel>{h.roleTag}</TileLabel>
      <div className="mt-5 flex flex-1 items-end justify-between gap-4">
        <div className="min-w-0">
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
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="#projects" className={`${linkBase} bg-ink text-white hover:bg-teal`}>
              {h.viewWork}
            </a>
            <a
              href="https://github.com/kotta-27"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkBase} bg-soft text-ink hover:bg-ground`}
            >
              <FaGithub className="text-[14px]" />
              kotta-27
            </a>
            <a
              href="https://x.com/Melmol_27"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkBase} bg-soft text-ink hover:bg-ground`}
            >
              <FaXTwitter className="text-[13px]" />
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
        <div className="relative aspect-[5/6] w-[96px] shrink-0 overflow-hidden rounded-[14px] sm:w-[136px]">
          <Image src="/mepic2.png" alt="Kota Mizuno" fill priority className="object-cover" />
        </div>
      </div>
    </Tile>
  )
}
