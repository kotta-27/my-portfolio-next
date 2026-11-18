'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PiHeartBold, PiHeartFill } from 'react-icons/pi'
import { useTr } from '@/components/notes/i18n'

const storeKey = (slug: string) => `liked:${slug}`

/** 記事の末尾のいいねボタン。押したかどうかはこのブラウザに覚え、数はサーバー（Redis）に持つ */
export function LikeButton({ slug }: { slug: string }) {
  const tr = useTr()
  const [count, setCount] = useState<number | null>(null)
  const [liked, setLiked] = useState(false)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(storeKey(slug)) === '1')
    } catch {
      // localStorage が使えない環境でも数は出す
    }
    fetch(`/api/likes/${slug}`)
      .then((r) => r.json())
      .then((d: { count: number | null }) => setCount(d.count))
      .catch(() => setCount(null))
      .finally(() => setReady(true))
  }, [slug])

  async function toggle() {
    if (busy || count === null) return
    const next = !liked
    // 先に見た目を変え、サーバーの返事で数を合わせる
    setLiked(next)
    setCount((c) => (c === null ? c : Math.max(0, c + (next ? 1 : -1))))
    setBusy(true)
    try {
      const d: { count: number | null } = await fetch(`/api/likes/${slug}`, { method: next ? 'POST' : 'DELETE' }).then((r) => r.json())
      setCount(d.count)
      try {
        if (next) localStorage.setItem(storeKey(slug), '1')
        else localStorage.removeItem(storeKey(slug))
      } catch {
        // 保存できなくても数はサーバーで合っている
      }
    } catch {
      setLiked(!next)
      setCount((c) => (c === null ? c : Math.max(0, c + (next ? -1 : 1))))
    } finally {
      setBusy(false)
    }
  }

  // 保存先がつながっていない環境（手元など）では出さない
  if (ready && count === null) return null

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-3 border-t border-ink/10 pt-10">
      <p className="text-[13.5px] font-semibold text-mute">{tr('参考になったら', 'Found this useful?')}</p>
      <button
        type="button"
        onClick={toggle}
        disabled={!ready || busy}
        aria-pressed={liked}
        aria-label={liked ? tr('いいねを取り消す', 'Remove like') : tr('いいね', 'Like')}
        className={`group inline-flex items-center gap-3 rounded-full border-2 px-6 py-3 text-[15px] font-extrabold transition-colors duration-150 disabled:cursor-default ${
          liked ? 'border-coral bg-coral/10 text-coral' : 'border-ink/15 bg-tile text-ink hover:border-coral/60 hover:text-coral'
        }`}
      >
        <motion.span key={String(liked)} initial={{ scale: liked ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }} className="grid">
          {liked ? <PiHeartFill className="text-[22px]" /> : <PiHeartBold className="text-[22px]" />}
        </motion.span>
        <span className="font-mono tabular-nums">{count ?? '–'}</span>
      </button>
    </div>
  )
}
