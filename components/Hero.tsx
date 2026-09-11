'use client'

import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'
import type { Lang } from '@/types'
import { ui } from '@/data/ui'
import { hero } from '@/data/hero'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export function Hero({ lang }: { lang: Lang }) {
  const t = ui[lang]
  const h = hero[lang]
  return (
    <section id="hero">
      <div className="bg-[#1a1a1a] rounded-xl p-6 sm:p-12">
        <motion.div
          className="relative"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* 写真: モバイルは右上、デスクトップは右下に絶対配置 */}
          <motion.div
            variants={fadeUp}
            className="absolute top-[25px] right-0 w-[96px] h-[118px] rounded-[8px] overflow-hidden sm:hidden"
          >
            <Image src="/mepic2.png" alt="Kota Mizuno" fill className="object-cover" priority />
          </motion.div>
          <div>
            <motion.span variants={fadeUp} className="text-[10.5px] tracking-[.1em] text-[#777] block mb-5">
              {h.roleTag}
            </motion.span>
            <motion.div variants={fadeUp} className="mb-6 pr-[112px] sm:pr-0">
              <div className="text-[48px] sm:text-[70px] font-bold leading-[0.9] tracking-[-0.04em] text-white">
                Kota
              </div>
              <div className="text-[48px] sm:text-[70px] font-light leading-[0.9] tracking-[-0.04em] text-[#666]">
                Mizuno
              </div>
            </motion.div>
            <motion.p variants={fadeUp} className="font-light text-[14.5px] leading-[1.75] text-[#aaa] mb-8 max-w-[380px]">
              {h.tagline}
              <br />
              {h.currentlyAt}
            </motion.p>
            <motion.div variants={fadeUp} className="mb-6 font-mono text-[12px] text-[#555]">
              <span className="text-[#aaa]">interests</span>
              <span className="text-[#4f4]">{' {'}</span>
              {h.interests.map((item, i) => (
                <span key={item}>
                  <span className="text-[#4f4]">"{item}"</span>
                  {i < h.interests.length - 1 && <span className="text-[#4f4]">, </span>}
                </span>
              ))}
              <span className="text-[#4f4]">{'}'}</span>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-8 font-mono text-[12px] text-[#555]">
              <span className="text-[#aaa]">hobbies</span>
              <span className="text-[#4af]">{' {'}</span>
              {h.hobbies.map((item, i) => (
                <span key={item}>
                  <span className="text-[#4af]">"{item}"</span>
                  {i < h.hobbies.length - 1 && <span className="text-[#4af]">, </span>}
                </span>
              ))}
              <span className="text-[#4af]">{'}'}</span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-[9px] flex-wrap">
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

            </motion.div>

          </div>

          <motion.div variants={fadeUp} className="hidden sm:block absolute top-[45px] right-[60px] w-[252px] h-[292px] rounded-[10px] overflow-hidden">
            <Image src="/mepic2.png" alt="Kota Mizuno" fill className="object-cover" priority />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
