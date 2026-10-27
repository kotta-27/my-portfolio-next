import type { ReactNode } from 'react'

type NoteBody = { Body: () => ReactNode; toc: { id: string; title: string }[] }

/** data/notes.ts の slug → 本文。ノートを足したらここにも登録する */
export const noteBodies: Record<string, NoteBody> = {}
