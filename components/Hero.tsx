import Image from 'next/image'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { hero } from '@/data/hero'

export function Hero({ lang }: { lang: Lang }) {
  const t = ui[lang]
  const h = hero[lang]
  return (
    <section id="hero" className="animate-fade-in">
      <div className="bg-[#1a1a1a] rounded-xl p-6 sm:p-12">
        <div className="relative">
          {/* 写真: モバイルは右上、デスクトップは右下に絶対配置 */}
          <div className="absolute top-[25px] right-0 w-[96px] h-[118px] rounded-[8px] overflow-hidden sm:hidden animate-fade-in [animation-delay:200ms]">
            <Image src="/mepic2.png" alt="Kota Mizuno" fill className="object-cover" priority />
          </div>
          <div>
            <span className="text-[10.5px] tracking-[.1em] text-[#777] block mb-5 animate-fade-in-up [animation-delay:100ms]">
              {h.roleTag}
            </span>
            <div className="mb-6 pr-[112px] sm:pr-0 animate-fade-in-up [animation-delay:180ms]">
              <div className="text-[48px] sm:text-[70px] font-bold leading-[0.9] tracking-[-0.04em] text-white">
                Kota
              </div>
              <div className="text-[48px] sm:text-[70px] font-light leading-[0.9] tracking-[-0.04em] text-[#666]">
                Mizuno
              </div>
            </div>
            <p className="font-light text-[14.5px] leading-[1.75] text-[#aaa] mb-8 max-w-[380px] animate-fade-in-up [animation-delay:260ms]">
              {h.tagline}
              <br />
              {h.currentlyAt}
            </p>
            <div className="mb-6 animate-fade-in-up [animation-delay:300ms] font-mono text-[12px] text-[#555]">
              <span className="text-[#aaa]">interests</span>
              <span className="text-[#4f4]">{' {'}</span>
              {h.interests.map((item, i) => (
                <span key={item}>
                  <span className="text-[#4f4]">"{item}"</span>
                  {i < h.interests.length - 1 && <span className="text-[#4f4]">, </span>}
                </span>
              ))}
              <span className="text-[#4f4]">{'}'}</span>
            </div>

            <div className="mb-8 animate-fade-in-up [animation-delay:300ms] font-mono text-[12px] text-[#555]">
              <span className="text-[#aaa]">hobbies</span>
              <span className="text-[#4af]">{' {'}</span>
              {h.hobbies.map((item, i) => (
                <span key={item}>
                  <span className="text-[#4af]">"{item}"</span>
                  {i < h.hobbies.length - 1 && <span className="text-[#4af]">, </span>}
                </span>
              ))}
              <span className="text-[#4af]">{'}'}</span>
            </div>

            <div className="flex gap-[9px] flex-wrap animate-fade-in-up [animation-delay:340ms]">
              <a
                href="#projects"
                className="text-[10.5px] font-medium tracking-[.05em] text-white no-underline bg-white/10 border border-white/[.15] rounded-md px-5 py-[11px] hover:bg-white/20 transition-colors duration-150"
              >
                {h.viewWork}
              </a>
              <a
                href="https://x.com/Melmol_27"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[7px] text-[10.5px] font-medium tracking-[.05em] text-[#777] no-underline border border-[#3a3a3a] rounded-md px-5 py-[11px] hover:text-[#bbb] hover:border-[#555] transition-colors duration-150"
              >
                <FaXTwitter className="text-[14px]" />
                @Melmol_27
              </a>
              <a
                href="https://github.com/kotta-27"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[7px] text-[10.5px] font-medium tracking-[.05em] text-[#777] no-underline border border-[#3a3a3a] rounded-md px-5 py-[11px] hover:text-[#bbb] hover:border-[#555] transition-colors duration-150"
              >
                <FaGithub className="text-[15px]" />
                kotta-27
              </a>
              <a
                href="https://youtrust.jp/users/356b120bc6d76c20101a4096b1896d95"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[7px] text-[10.5px] font-medium tracking-[.05em] text-[#777] no-underline border border-[#3a3a3a] rounded-md px-5 py-[11px] hover:text-[#bbb] hover:border-[#555] transition-colors duration-150"
              >
                YouTrust
              </a>

            </div>

          </div>

          <div className="hidden sm:block absolute top-[25px] right-[20px] w-[202px] h-[242px] rounded-[10px] overflow-hidden animate-fade-in [animation-delay:200ms]">
            <Image src="/mepic2.png" alt="Kota Mizuno" fill className="object-cover" priority />
          </div>
        </div>
      </div>
    </section>
  )
}
