'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useView } from '@/components/ViewContext'

const SEEN_KEY = 'intro-seen'
const INTRO_MS = 1000

/** Full-screen splash shown once per session; lifts away to reveal the grid. */
export function IntroOverlay() {
  const { introDone, finishIntro } = useView()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      // storage unavailable: just play the intro
    }
    if (seen || reduceMotion) {
      finishIntro()
      return
    }
    const id = setTimeout(finishIntro, INTRO_MS)
    return () => clearTimeout(id)
  }, [finishIntro, reduceMotion])

  return (
    <AnimatePresence>
      {!introDone && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-ground"
          exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          aria-hidden
        >
          <motion.span
            className="block h-[56px] w-[56px] rounded-[14px] bg-teal"
            animate={{ scale: [1, 1.12, 1], rotate: [0, 90, 90] }}
            transition={{ duration: 0.9, ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.p
            className="text-[13px] font-extrabold tracking-[-0.01em] text-ink"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            Kota Mizuno
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
