'use client'

import { useEffect, useState } from 'react'

/**
 * ページを移るときの読み込み表示。サイト内のリンクを押した瞬間に、画面の上端に細いティールの線を出して伸ばす。
 * サイトのリンクはほとんど普通の <a>（ページごと読み込み直す）なので、次のページが出るまでのあいだ「押せた」ことを伝える。
 * 新しいタブで開くリンク、ページ内の移動（#…）、同じページへのリンクでは出さない。
 */
export function NavProgress() {
  const [state, setState] = useState<'idle' | 'loading'>('idle')

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname && url.search === location.search) return
      setState('loading')
    }
    // 戻るボタンで戻ってきたとき（ページがそのまま残っていたとき）は消す
    const onShow = () => setState('idle')
    document.addEventListener('click', onClick)
    window.addEventListener('pageshow', onShow)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('pageshow', onShow)
    }
  }, [])

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-x-0 top-0 z-[1000] h-[3px] ${state === 'loading' ? '' : 'hidden'}`}>
      <div className="nav-progress h-full bg-teal shadow-[0_0_8px_rgb(var(--teal)/0.6)]" />
    </div>
  )
}
