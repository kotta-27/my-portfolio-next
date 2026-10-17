import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import { PiArrowUpRight, PiEnvelopeSimple } from 'react-icons/pi'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { contact } from '@/data/contact'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

const rowClass =
  'flex items-center gap-[8px] text-[12px] font-semibold text-slab-fg/75 no-underline hover:text-slab-fg transition-colors duration-150'

export function ContactTile({ lang }: { lang: Lang }) {
  const t = ui[lang]
  const c = contact[lang]
  return (
    <Tile id="contact" tone="dark">
      <TileLabel className="text-slab-fg/55">{t.sections.contact}</TileLabel>
      <span className="absolute right-4 top-4 grid h-[30px] w-[30px] place-items-center rounded-full bg-teal text-paper">
        <PiArrowUpRight className="text-[15px]" />
      </span>
      <p className="mt-2 text-[20px] font-extrabold leading-tight tracking-[-0.02em]">{c.title}</p>
      <p className="text-[11.5px] leading-[1.55] text-slab-fg/60">{c.body}</p>
      <div className="mt-auto flex flex-col gap-[6px] pt-3">
        <a href="mailto:mizukou27@gmail.com" className={rowClass}>
          <PiEnvelopeSimple className="shrink-0 text-[15px]" />
          {/* 狭い 2 列だと 1 語のアドレスが枠からはみ出すので、@ の後で折り返せるようにする */}
          <span className="min-w-0">
            mizukou27@<wbr />gmail.com
          </span>
        </a>
        <a href="https://x.com/Melmol_27" target="_blank" rel="noopener noreferrer" className={rowClass}>
          <FaXTwitter className="text-[13px]" />
          @Melmol_27
        </a>
        <a href="https://github.com/kotta-27" target="_blank" rel="noopener noreferrer" className={rowClass}>
          <FaGithub className="text-[14px]" />
          kotta-27
        </a>
      </div>
    </Tile>
  )
}
