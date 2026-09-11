'use client'

import { motion } from 'framer-motion'

export function SectionLabel({ children }: { children: string }) {
  return (
    <motion.p
      className="text-[15.5px] tracking-[.1em] uppercase text-[#111] font-bold mb-[10px] pl-[2px] origin-top-left inline-block"
      initial={{ rotate: -14, opacity: 0 }}
      whileInView={{ rotate: [-14, 6, -3, 1, 0], opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut', opacity: { duration: 0.2 } }}
    >
      {children}
    </motion.p>
  )
}
