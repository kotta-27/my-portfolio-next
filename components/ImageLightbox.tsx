'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { PiCaretLeftBold, PiCaretRightBold, PiXBold } from 'react-icons/pi'
import { optimizedImage } from '@/lib/optimizedImage'

type Props = {
  images: string[]
  alt: string
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

/** スワイプ（ドラッグ）でページ送りとみなす距離 */
const SWIPE_PX = 80

/** プロジェクト画像の全画面表示。←/→・スワイプ・サムネイルで移動、Esc・背景クリックで閉じる */
export function ImageLightbox({ images, alt, index, onIndexChange, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  // 1: 次へ（右から入る） / -1: 前へ（左から入る）
  const [direction, setDirection] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const multiple = images.length > 1

  const go = (step: number) => {
    if (!multiple) return
    setDirection(step)
    onIndexChange((index + step + images.length) % images.length)
  }
  const goTo = (i: number) => {
    if (i === index) return
    setDirection(i > index ? 1 : -1)
    onIndexChange(i)
  }

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // 背面のスクロールを止め、閉じたら開く前のフォーカスに戻す
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      prevFocus?.focus()
    }
  }, [])

  useEffect(() => {
    if (mounted) closeRef.current?.focus()
  }, [mounted])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_PX) go(1)
    else if (info.offset.x > SWIPE_PX) go(-1)
  }

  if (!mounted) return null

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[300] flex flex-col bg-ink/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* 上部: 枚数と閉じる */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-[max(12px,env(safe-area-inset-top))] sm:px-6">
        <span className="font-mono text-[12px] text-white/80 tabular-nums">
          {multiple ? `${index + 1} / ${images.length}` : ''}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-[40px] w-[40px] place-items-center rounded-full bg-white/10 text-white outline-none transition-colors duration-150 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <PiXBold className="text-[18px]" />
        </button>
      </div>

      {/* 画像 */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-3 sm:px-20">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            key={images[index]}
            {...optimizedImage(images[index], alt, { width: 2400, sizes: '100vw' })}
            alt={`${alt} (${index + 1}/${images.length})`}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 80 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -80 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            drag={multiple ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={onDragEnd}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
            className="max-h-full max-w-full cursor-grab select-none rounded-[12px] object-contain shadow-[0_32px_64px_-24px_rgba(0,0,0,0.6)] active:cursor-grabbing"
          />
        </AnimatePresence>

        {multiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 hidden h-[44px] w-[44px] -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white outline-none transition-colors duration-150 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 sm:grid"
            >
              <PiCaretLeftBold className="text-[18px]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 hidden h-[44px] w-[44px] -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white outline-none transition-colors duration-150 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 sm:grid"
            >
              <PiCaretRightBold className="text-[18px]" />
            </button>
          </>
        )}
      </div>

      {/* 下部: サムネイル */}
      {multiple && (
        <div className="flex shrink-0 justify-center gap-2 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goTo(i)
              }}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`h-[44px] w-[70px] overflow-hidden rounded-[8px] transition-all duration-200 ${
                i === index ? 'opacity-100 ring-2 ring-white' : 'opacity-45 hover:opacity-80'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...optimizedImage(src, '', { width: 256, sizes: '70px' })} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>,
    document.body,
  )
}
