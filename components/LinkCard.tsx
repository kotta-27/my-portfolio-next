import type { Lang } from '@/types'

export type LinkCardData = {
  url: string
  label: string
  source: string
  thumbnail?: string | null
}

type Props = {
  card: LinkCardData
  lang?: Lang
  mobileThumbnail?: boolean
}

export function LinkCard({ card, lang: _lang, mobileThumbnail = true }: Props) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center border border-[#ddd] rounded-[7px] overflow-hidden no-underline hover:border-[#ddd] hover:bg-[#fafafa] transition-colors duration-150 group"
    >
      {card.thumbnail && (
        <div className={`${mobileThumbnail ? 'block' : 'hidden sm:block'} w-[80px] h-[52px] shrink-0 bg-[#f4f4f4] overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.thumbnail} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-[2px] px-[12px] py-[8px] min-w-0">
        <span className="text-[9.5px] tracking-[.07em] uppercase text-[#888]">{card.source}</span>
        <span className="text-[12px] leading-[1.4] text-[#333] group-hover:text-[#1a1a1a] transition-colors duration-150 line-clamp-2">
          {card.label}
        </span>
      </div>
      <span className="ml-auto pr-[14px] text-[#999] text-[13px] shrink-0 group-hover:text-[#555] transition-colors duration-150">
        ↗
      </span>
    </a>
  )
}
