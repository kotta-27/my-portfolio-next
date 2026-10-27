import type { ReactNode } from 'react'
import { GitWorktree, toc as gitWorktreeToc } from '@/components/notes/GitWorktree'
import { Hnsw, toc as hnswToc } from '@/components/notes/Hnsw'
import { OssIssue, toc as ossIssueToc } from '@/components/notes/OssIssue'

type NoteBody = { Body: () => ReactNode; toc: { id: string; title: string }[] }

/** data/notes.ts の slug → 本文。ノートを足したらここにも登録する */
export const noteBodies: Record<string, NoteBody> = {
  'git-worktree': { Body: GitWorktree, toc: gitWorktreeToc },
  hnsw: { Body: Hnsw, toc: hnswToc },
  'oss-issue': { Body: OssIssue, toc: ossIssueToc },
}
