import Image from 'next/image'
import type { Lang } from '@/types'
import type { ResolvedCareerItem } from '@/data/career'
import { Tag } from '@/components/Tag'

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
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[10px] border border-[#f0f0f0] rounded-[7px] overflow-hidden no-underline hover:border-[#ddd] hover:bg-[#fafafa] transition-colors duration-150 group"
            >
              <div className="w-[72px] sm:w-[80px] h-[52px] shrink-0 bg-[#f4f4f4] overflow-hidden">
                {link.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={link.image} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex flex-col gap-[3px] py-[8px] pr-[12px] min-w-0">
                <span className="text-[9.5px] tracking-[.07em] uppercase text-[#888]">
                  {link.source}
                </span>
                <span className="text-[12px] leading-[1.4] text-[#333] group-hover:text-[#1a1a1a] transition-colors duration-150 line-clamp-2">
                  {link.label}
                </span>
              </div>
              <span className="ml-auto pr-[14px] text-[#999] text-[13px] shrink-0 group-hover:text-[#555] transition-colors duration-150">
                ↗
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
