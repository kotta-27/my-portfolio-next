'use client'

import { useEffect, useState } from 'react'
import { PiMoonBold, PiSunBold } from 'react-icons/pi'

const STORAGE_KEY = 'theme'

/** ライト / ダークの切替。選ぶまでは OS の設定に従い、選んだら保存する */
export function ThemeToggle() {
  // 初期クラスは layout の head スクリプトが描画前に付けている。ここではそれを読むだけ
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))

    // 保存した選択が無いあいだは OS の切替に追従する
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) return
      document.documentElement.classList.toggle('dark', e.matches)
      setDark(e.matches)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function toggle() {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    setDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light' : 'Dark'}
      className="plate plate--tile grid h-[34px] w-[34px] shrink-0 place-items-center bg-tile text-mute hover:text-ink"
    >
      {/* 判定前（SSR 直後）は何も出さず、ちらつきを避ける */}
      {dark === null ? null : dark ? <PiSunBold className="text-[16px]" /> : <PiMoonBold className="text-[15px]" />}
    </button>
  )
}
