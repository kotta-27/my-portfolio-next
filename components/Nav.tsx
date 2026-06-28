import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { LangToggle } from '@/components/LangToggle'

export function Nav({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <nav className="sticky top-0 z-50 bg-[#edeae3] border-b border-black/[.07] px-5 sm:px-10 flex justify-between items-center h-[58px]">
      <a
        href="?"
        className="text-[14px] font-semibold tracking-[-0.01em] text-[#1a1a1a] no-underline"
      >
        Kota Mizuno
      </a>
      <div className="flex gap-[16px] sm:gap-[26px] items-center">
        {t.nav.map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="hidden sm:block text-[12px] text-[#555] no-underline hover:text-[#1a1a1a] transition-colors duration-150"
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          className="text-[11.5px] font-medium tracking-[.02em] text-white no-underline bg-[#1a1a1a] rounded-[5px] px-4 py-2 hover:bg-[#333] transition-colors duration-150"
        >
          Contact
        </a>
        <LangToggle lang={lang} />
      </div>
    </nav>
  )
}
