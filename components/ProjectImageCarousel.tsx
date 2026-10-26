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

  // 全画面表示中は自動送りを止める
  useEffect(() => {
    if (images.length <= 1 || open) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [images.length, intervalMs, open])

  return (
    <div
      className="relative flex h-[240px] w-full items-center justify-center overflow-hidden bg-tile p-4 sm:h-[420px] sm:p-8"
      style={{ perspective: '1400px' }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {/*
            上から見て時計回りに回転する2枚のカードをイメージ:
            手前(θ=0)にあるものは右側面(θ=90)を通って奥(θ=180)へ、
            奥(θ=180)にあるものは左側面(θ=270)を通って手前(θ=360=0)へ。
            どちらも同じ回転方向(時計回り)で入れ替わる。
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            key={images[index]}
            {...optimizedImage(images[index], alt, { width: 1600, sizes: '(min-width: 768px) 900px, 100vw' })}
            alt={alt}
            initial={{
              opacity: 0.85,
              scale: 0.7,
              z: -220,
              x: 0,
              rotateY: 180,
            }}
            animate={{
              opacity: [0.85, 0.95, 1],
              scale: [0.7, 0.85, 1],
              z: [-220, -110, 0],
              x: [0, -110, 0],
              rotateY: [180, 270, 360],
            }}
            exit={{
              opacity: [1, 0.95, 0.85],
              scale: [1, 0.85, 0.7],
              z: [0, -110, -220],
              x: [0, 110, 0],
              rotateY: [0, 90, 180],
            }}
            transition={{ duration: 1.5, ease: [0.45, 0, 0.2, 1] }}
            className="absolute max-h-full max-w-full object-contain rounded-[10px] border border-soft shadow-[0_24px_48px_-24px_rgba(13,27,42,0.35)]"
            style={{ transformStyle: 'preserve-3d' }}
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
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-[6px]">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`stud-dot pointer-events-auto h-[10px] w-[10px] transition-transform duration-200 ${i === index ? 'stud-dot--on' : 'hover:scale-110'}`}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <ImageLightbox images={images} alt={alt} index={index} onIndexChange={setIndex} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
