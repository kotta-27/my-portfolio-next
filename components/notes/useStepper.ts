'use client'

import { useEffect, useState } from 'react'

/** 図のコマ送り。play で最後まで自動で進み、途中で手で動かすと止まる */
export function useStepper(count: number, intervalMs = 1300) {
  const [step, setStepRaw] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    if (step >= count - 1) {
      setPlaying(false)
      return
    }
    const id = window.setTimeout(() => setStepRaw((s) => Math.min(s + 1, count - 1)), intervalMs)
    return () => window.clearTimeout(id)
  }, [playing, step, count, intervalMs])

  return {
    step,
    playing,
    atEnd: step >= count - 1,
    setStep: (s: number) => {
      setPlaying(false)
      setStepRaw(Math.max(0, Math.min(s, count - 1)))
    },
    next: () => {
      setPlaying(false)
      setStepRaw((s) => Math.min(s + 1, count - 1))
    },
    prev: () => {
      setPlaying(false)
      setStepRaw((s) => Math.max(s - 1, 0))
    },
    /** 最後まで来ていたら最初から再生し直す */
    play: () => {
      setStepRaw((s) => (s >= count - 1 ? 0 : s))
      setPlaying(true)
    },
    pause: () => setPlaying(false),
  }
}
