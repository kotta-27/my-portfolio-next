'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PiArrowsOutSimpleBold } from 'react-icons/pi'
import { optimizedImage } from '@/lib/optimizedImage'
import { ImageLightbox } from '@/components/ImageLightbox'

export function ProjectImageCarousel({
  images,
  alt,
  intervalMs = 4000,
}: {
  images: string[]
  alt: string
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  // 1: 次へ（手前のカードが左へ抜け、後ろのカードがせり上がる） / -1: 前へ（逆向き）
  const [dir, setDir] = useState(1)
  const multiple = images.length > 1
  const next = (index + 1) % images.length

  const go = (i: number) => {
    if (i === index) return
    setDir(i > index ? 1 : -1)
    setIndex(i)
  }

  // 全画面表示中・ホバー中は自動送りを止める
  useEffect(() => {
    if (!multiple || open || paused) return
    const id = setTimeout(() => {
      setDir(1)
      setIndex((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearTimeout(id)
  }, [index, multiple, images.length, intervalMs, open, paused])

  const imgClass = 'absolute max-h-full max-w-full rounded-[10px] border border-soft object-contain shadow-[0_24px_48px_-24px_rgba(13,27,42,0.35)]'

  return (
    <div
      className="relative flex h-[240px] w-full items-center justify-center overflow-hidden bg-tile p-4 sm:h-[420px] sm:p-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/*
          カードの束: 手前に今の画像、その少し後ろ（下にずれて小さく）に次の画像を覗かせる。
          送ると手前のカードが少し傾きながら横へ抜け、後ろのカードが手前へせり上がる。
        */}
        {multiple && (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            key={`peek-${images[next]}`}
            {...optimizedImage(images[next], '', { width: 1600, sizes: '(min-width: 768px) 900px, 100vw' })}
            alt=""
            aria-hidden
            initial={{ opacity: 0, y: 28, scale: 0.86 }}
            animate={{ opacity: 0.5, y: 18, scale: 0.92 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className={`${imgClass} blur-[1px]`}
          />
        )}
        <AnimatePresence initial={false} custom={dir}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            key={images[index]}
            {...optimizedImage(images[index], alt, { width: 1600, sizes: '(min-width: 768px) 900px, 100vw' })}
            alt={alt}
            custom={dir}
            variants={{
              enter: (d: number) => (d > 0 ? { opacity: 0.5, y: 18, scale: 0.92, x: 0, rotate: 0 } : { opacity: 0, x: '-60%', rotate: -8, y: 0, scale: 1 }),
              center: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, zIndex: 2 },
              exit: (d: number) => (d > 0 ? { opacity: 0, x: '-60%', rotate: -8, zIndex: 3 } : { opacity: 0, y: 18, scale: 0.92, zIndex: 1 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9, opacity: { duration: 0.35 } }}
            className={imgClass}
          />
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open image fullscreen"
        className="group absolute inset-0 cursor-zoom-in"
      >
        <span className="absolute right-3 top-3 grid h-[34px] w-[34px] place-items-center rounded-full bg-night/70 text-white opacity-70 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0">
          <PiArrowsOutSimpleBold className="text-[15px]" />
        </span>
      </button>

      {images.length > 1 && (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-[6px]">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`pointer-events-auto relative h-[6px] overflow-hidden rounded-full bg-ink/15 transition-[width] duration-300 ${i === index ? 'w-[28px]' : 'w-[6px] hover:bg-ink/30'}`}
            >
              {/* 今の 1 枚は、次へ送るまでの残り時間をバーで見せる（止まっている間は満タン） */}
              {i === index && (
                <motion.span
                  key={`${index}-${paused || open}`}
                  className="absolute inset-y-0 left-0 rounded-full bg-teal"
                  initial={{ width: paused || open ? '100%' : '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: paused || open ? 0 : intervalMs / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <ImageLightbox images={images} alt={alt} index={index} onIndexChange={go} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
