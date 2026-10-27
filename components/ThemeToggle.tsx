'use client'

import { useEffect, useState } from 'react'
import { PiMoonBold, PiSunBold } from 'react-icons/pi'

const STORAGE_KEY = 'theme'
const ONE_YEAR = 60 * 60 * 24 * 365

/** 保存した選択。kotap.dev のサブドメイン間で共有する cookie を優先し、無ければ localStorage */
function savedTheme() {
  return document.cookie.match(/(?:^|; )theme=(dark|light)/)?.[1] ?? localStorage.getItem(STORAGE_KEY)
}

/** 選択を保存する。kotap.dev 上では www と blog で共有できるよう、親ドメインの cookie にも書く */
function saveTheme(value: 'dark' | 'light') {
  localStorage.setItem(STORAGE_KEY, value)
  const domain = location.hostname.endsWith('kotap.dev') ? '; domain=.kotap.dev' : ''
  document.cookie = `${STORAGE_KEY}=${value}; path=/; max-age=${ONE_YEAR}; samesite=lax${domain}`
}

/** ライト / ダークの切替。選ぶまでは OS の設定に従い、選んだら保存する */
export function ThemeToggle() {
  // 初期クラスは layout の head スクリプトが描画前に付けている。ここではそれを読むだけ
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
    // 以前の版で localStorage にだけ保存した選択を、共有の cookie に移す
    const legacy = localStorage.getItem(STORAGE_KEY)
    if (!document.cookie.match(/(?:^|; )theme=/) && (legacy === 'dark' || legacy === 'light')) saveTheme(legacy)

    // 保存した選択が無いあいだは OS の切替に追従する
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      if (savedTheme()) return
      document.documentElement.classList.toggle('dark', e.matches)
      setDark(e.matches)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function toggle() {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    saveTheme(next ? 'dark' : 'light')
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
