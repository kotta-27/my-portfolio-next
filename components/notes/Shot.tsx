'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion'
import { PiArrowsOutSimpleBold } from 'react-icons/pi'
import { ImageLightbox } from '@/components/ImageLightbox'
import { useTr } from '@/components/notes/i18n'

/** 記事内のスクリーンショット。押すと全画面で開く */
export function Shot({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  const tr = useTr()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={tr(`全画面で見る: ${alt}`, `View full screen: ${alt}`)}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[10px] border border-ink/10 bg-tile"
      >
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 960px) 920px, 100vw" className="block h-auto w-full" />
        <span
          aria-hidden
          className="absolute right-3 top-3 grid h-[34px] w-[34px] place-items-center rounded-full bg-night/70 text-white opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
        >
          <PiArrowsOutSimpleBold className="text-[16px]" />
        </span>
      </button>
      <AnimatePresence>{open && <ImageLightbox images={[src]} alt={alt} index={0} onIndexChange={() => {}} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}
