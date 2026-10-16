'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useView } from '@/components/ViewContext'

/** 今いるビューを `from` に載せて遷移する。詳細ページの「戻る」が元のビューに戻れるように */
export function ViewLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const { view } = useView()
  const sep = href.includes('?') ? '&' : '?'
  return (
    <Link href={`${href}${sep}from=${view}`} className={className}>
      {children}
    </Link>
  )
}
