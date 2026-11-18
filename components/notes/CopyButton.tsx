'use client'

import { useState } from 'react'
import { PiCheckBold, PiCopyBold } from 'react-icons/pi'
import { useTr } from '@/components/notes/i18n'

/** テキストをクリップボードへ。押した直後だけチェックに変わる */
/** label は [日本語, 英語] */
export function CopyButton({ text, label: labels, showText = false, className = '' }: { text: string; label: [string, string]; showText?: boolean; className?: string }) {
  const [copied, setCopied] = useState(false)
  const tr = useTr()
  const label = tr(...labels)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // クリップボードが使えない環境では何もしない（テキストは選択してコピーできる）
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? tr('コピーしました', 'Copied') : label}
      title={label}
      className={`inline-flex shrink-0 items-center gap-[5px] rounded-[6px] px-[7px] py-[4px] font-sans text-[11px] font-bold transition-colors duration-150 ${
        copied ? 'text-teal' : 'text-white/45 hover:bg-white/10 hover:text-white'
      } ${className}`}
    >
      {copied ? <PiCheckBold className="text-[13px]" /> : <PiCopyBold className="text-[13px]" />}
      {showText && (copied ? tr('コピーしました', 'Copied') : tr('コピー', 'Copy'))}
    </button>
  )
}
