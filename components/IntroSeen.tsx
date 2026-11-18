'use client'

import { useEffect } from 'react'
import { INTRO_COOKIE } from '@/lib/intro'

/** イントロを見たことをセッション Cookie に残す。次からはサーバーがイントロを描画しない */
export function IntroSeen() {
  useEffect(() => {
    document.cookie = `${INTRO_COOKIE}=1; path=/; SameSite=Lax`
  }, [])
  return null
}
