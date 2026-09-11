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
      style={{ perspective: '1200px' }}
    >
      <AnimatePresence mode="wait">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={alt}
          initial={{ scale: 0.82, opacity: 0, z: -120 }}
          animate={{ scale: 1, opacity: 1, z: 0 }}
          exit={{ scale: 0.82, opacity: 0, z: -120 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="max-h-full max-w-full object-contain border border-[#e8e8e8] rounded-[4px]"
        />
      </AnimatePresence>

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
