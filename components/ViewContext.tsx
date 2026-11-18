'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { View } from '@/types'

type ViewContextValue = {
  view: View
  setView: (view: View) => void
}

const ViewContext = createContext<ViewContextValue | null>(null)

export function ViewProvider({ children, initial = 'all' }: { children: ReactNode; initial?: View }) {
  const [view, setViewState] = useState<View>(initial)

  // 今のビューを URL（?view=）に残し、リロードしても同じタブで開くようにする
  const setView = useCallback((next: View) => {
    setViewState(next)
    const url = new URL(window.location.href)
    if (next === 'all') url.searchParams.delete('view')
    else url.searchParams.set('view', next)
    url.hash = ''
    window.history.replaceState(window.history.state, '', url)
  }, [])

  return <ViewContext.Provider value={{ view, setView }}>{children}</ViewContext.Provider>
}

export function useView(): ViewContextValue {
  const ctx = useContext(ViewContext)
  if (!ctx) throw new Error('useView must be used within <ViewProvider>')
  return ctx
}
