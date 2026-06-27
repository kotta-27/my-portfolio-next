import Image from 'next/image'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { techStrip } from '@/data/projects'

export function Hero({ lang }: { lang: Lang }) {
  const t = ui[lang]
  return (
    <section id="hero" className="animate-fade-in">
      <div className="bg-[#1a1a1a] rounded-xl p-12">
        <div className="grid grid-cols-[1fr_172px] gap-11 items-start">
          <div>
            <span className="text-[10.5px] tracking-[.1em] uppercase text-[#777] block mb-5 animate-fade-in-up [animation-delay:100ms]">
              {t.roleTag}
            </span>
            <div className="mb-6 animate-fade-in-up [animation-delay:180ms]">
              <div className="text-[70px] font-bold leading-[0.9] tracking-[-0.04em] text-white">
                Kota
              </div>
              <div className="text-[70px] font-light leading-[0.9] tracking-[-0.04em] text-[#666]">
                Mizuno
              </div>
            </div>
            <p className="font-light text-[14.5px] leading-[1.75] text-[#aaa] mb-8 max-w-[380px] animate-fade-in-up [animation-delay:260ms]">
              {t.tagline}
              <br />
              {t.currentlyAt}
            </p>
            <div className="flex gap-[9px] flex-wrap animate-fade-in-up [animation-delay:340ms]">
              <a
                href="#projects"
                className="text-[10.5px] font-medium tracking-[.05em] uppercase text-white no-underline bg-white/10 border border-white/[.15] rounded-md px-5 py-[11px] hover:bg-white/20 transition-colors duration-150"
              >
                {t.viewWork}
              </a>
              <a
                href="https://github.com/kotta-27"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[7px] text-[10.5px] font-medium tracking-[.05em] uppercase text-[#777] no-underline border border-[#3a3a3a] rounded-md px-5 py-[11px] hover:text-[#bbb] hover:border-[#555] transition-colors duration-150"
              >
                <FaGithub className="text-[15px]" />
                GitHub
              </a>
              <a
                href="https://x.com/Melmol_27"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[7px] text-[10.5px] font-medium tracking-[.05em] uppercase text-[#777] no-underline border border-[#3a3a3a] rounded-md px-5 py-[11px] hover:text-[#bbb] hover:border-[#555] transition-colors duration-150"
              >
                <FaXTwitter className="text-[14px]" />
                @Melmol_27
              </a>
            </div>
          </div>

          <div className="relative w-[172px] h-[212px] rounded-[10px] overflow-hidden shrink-0 animate-fade-in [animation-delay:200ms]">
            <Image
              src="/mepic2.png"
              alt="Kota Mizuno"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#252525] flex items-center flex-wrap animate-fade-in-up [animation-delay:420ms]">
          {techStrip.map((tech, i) => (
            <span
              key={tech}
              className={`text-[9.5px] tracking-[.07em] uppercase text-[#666] ${
                i < techStrip.length - 1 ? 'pr-5 mr-5 border-r border-[#333]' : ''
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
