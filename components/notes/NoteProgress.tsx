'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** 画面上端の読み進めバー。ブロックを積むように左から伸びる */
export function NoteProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[300] h-[4px] origin-left bg-teal" style={{ scaleX }} />
}
