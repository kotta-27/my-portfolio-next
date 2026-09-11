'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function PandaPeek() {
  return (
    <motion.div
      className="absolute -top-[24px] right-[20px] w-[80px] h-[32px] sm:-top-[42px] sm:right-[36px] sm:w-[130px] sm:h-[52px] z-10 pointer-events-none select-none"
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <Image src="/panda.png" alt="" fill className="object-contain drop-shadow-sm" priority={false} />
      </motion.div>
    </motion.div>
  )
}
