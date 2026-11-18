'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Lang } from '@/types'

/** ノートの中の図やボタンが、ページの言語を props で受け渡さずに読めるようにする */
const NoteLangContext = createContext<Lang>('ja')

export function NoteLangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <NoteLangContext.Provider value={lang}>{children}</NoteLangContext.Provider>
}

export const useNoteLang = () => useContext(NoteLangContext)

/** tr('次へ', 'Next') のように、日本語と英語を並べて書く */
export function useTr() {
  const lang = useNoteLang()
  return (ja: string, en: string) => (lang === 'ja' ? ja : en)
}

/** 文中の `...` をコード表記にして返す（図やリストの文字列用。本文の <C> と同じ見た目） */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="rounded-[4px] bg-ink/[0.07] px-[5px] py-[1px] font-mono text-[0.88em] font-semibold text-ink">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  )
}
