import Image from 'next/image'
import type { Lang } from '@/types'
import type { ResolvedCareerItem } from '@/data/career'
import { Tag } from '@/components/Tag'
import { LinkCard } from '@/components/LinkCard'

export function CareerCard({ item, lang }: { item: ResolvedCareerItem; lang: Lang }) {
  return (
    <div className="bg-white rounded-[10px] px-5 sm:px-7 py-[22px]">
      <div className="flex flex-wrap justify-between items-baseline gap-y-[2px] mb-[6px]">
        <div className="flex items-center gap-[10px]">
          {item.logo && (
            <div className="relative w-[20px] h-[20px] shrink-0">
              <Image src={item.logo} alt={item[lang].company} fill className="object-contain" />
            </div>
          )}
          <span className="text-[14.5px] font-semibold text-[#1a1a1a]">{item[lang].company}</span>
          <span className="text-[12px] text-[#888]">{item[lang].role}</span>
        </div>
        <span className="text-[11px] font-light text-[#999] shrink-0">{item.period}</span>
      </div>

      <p className="text-[12.5px] leading-[1.65] text-[#444] mb-3">{item[lang].description}</p>

      <div className="flex gap-[6px] flex-wrap mb-3">
        {item.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      {item.links.length > 0 && (
        <div className="flex flex-col gap-[6px]">
          {item.links.map((link) => (
            <LinkCard
              key={link.url}
              card={{ url: link.url, label: link.label, source: link.source, thumbnail: link.image }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
