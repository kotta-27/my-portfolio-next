import type { ReactNode } from 'react'
import { GitWorktree, toc as gitWorktreeToc } from '@/components/notes/GitWorktree'

type NoteBody = { Body: () => ReactNode; toc: { id: string; title: string }[] }

/** data/notes.ts の slug → 本文。ノートを足したらここにも登録する */
export const noteBodies: Record<string, NoteBody> = {
  'git-worktree': { Body: GitWorktree, toc: gitWorktreeToc },
}
