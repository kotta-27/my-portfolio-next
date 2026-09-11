'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [images.length, intervalMs])

  return (
    <div
      className="relative h-[240px] sm:h-[420px] bg-white flex items-center justify-center overflow-hidden"
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
            src={images[index]}
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
            className="absolute max-h-full max-w-full object-contain rounded-[4px] border border-[#e8e8e8] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)]"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-[6px]">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-[6px] rounded-full transition-all duration-300 ${
                i === index ? 'w-[18px] bg-[#1a1a1a]' : 'w-[6px] bg-[#ccc] hover:bg-[#999]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
