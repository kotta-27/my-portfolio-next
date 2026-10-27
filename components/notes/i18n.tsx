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
