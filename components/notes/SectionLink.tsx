'use client'

import { useState } from 'react'
import { PiCheckBold, PiLinkSimpleBold } from 'react-icons/pi'

/** 見出し横のリンク。押すとそのセクションへの URL をコピーし、アドレスバーにも反映する */
export function SectionLink({ id, title }: { id: string; title: string }) {
  const [copied, setCopied] = useState(false)

  async function copy(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const url = `${location.origin}${location.pathname}${location.search}#${id}`
    history.replaceState(null, '', `#${id}`)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // クリップボードが使えなくても、アドレスバーの URL はそのセクションを指している
    }
  }

  return (
    <a
      href={`#${id}`}
      onClick={copy}
      aria-label={`「${title}」へのリンクをコピー`}
      className="relative grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[7px] text-mute opacity-60 transition-opacity duration-150 hover:bg-soft hover:text-ink hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 sm:opacity-0"
    >
      {copied ? <PiCheckBold className="text-[16px] text-teal" /> : <PiLinkSimpleBold className="text-[16px]" />}
      {copied && (
        <span role="status" className="absolute left-full ml-2 whitespace-nowrap rounded-[6px] bg-ink px-2 py-[3px] text-[11px] font-bold text-paper">
          リンクをコピーしました
        </span>
      )}
    </a>
  )
}
