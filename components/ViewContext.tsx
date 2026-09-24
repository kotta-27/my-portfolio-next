'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { View } from '@/types'

type ViewContextValue = {
  view: View
  setView: (view: View) => void
  /** true once the intro overlay has finished (or was skipped) and tiles may appear */
  introDone: boolean
  finishIntro: () => void
}

const ViewContext = createContext<ViewContextValue | null>(null)

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('all')
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])
  return (
    <ViewContext.Provider value={{ view, setView, introDone, finishIntro }}>{children}</ViewContext.Provider>
  )
}

export function useView(): ViewContextValue {
  const ctx = useContext(ViewContext)
  if (!ctx) throw new Error('useView must be used within <ViewProvider>')
  return ctx
}
