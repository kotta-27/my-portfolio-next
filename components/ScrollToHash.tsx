'use client'

import { useEffect } from 'react'

/**
 * 別ページから `/#projects` のように戻ってきたとき、その位置までスクロールする。
 * Next のハッシュスクロールは、上のタイルが Suspense で後から差し込まれると位置がずれたり効かなかったりするため自前で行う。
 */
export function ScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const timer = setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      // タイルは登場アニメ中で transform がかかっているので、transform を含まない offsetTop で最終位置を出す
      let y = 0
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop
      // 固定ナビの下に少し余白を空けて止める
      const navH = document.querySelector('nav')?.getBoundingClientRect().height ?? 0
      window.scrollTo({ top: y - navH - 12, behavior: 'instant' })
    }, 100)
    return () => clearTimeout(timer)
  }, [])
  return null
}
