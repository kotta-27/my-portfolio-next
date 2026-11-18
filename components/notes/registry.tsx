import type { ReactNode } from 'react'
import type { Lang } from '@/types'
import { GitWorktree, GitWorktreeEn, toc as gitWorktreeToc } from '@/components/notes/GitWorktree'
import { Hnsw, HnswEn, toc as hnswToc } from '@/components/notes/Hnsw'
import { OssIssue, OssIssueEn, toc as ossIssueToc } from '@/components/notes/OssIssue'

type Toc = { id: string; title: Record<Lang, string> }[]
type NoteBody = { Body: Record<Lang, () => ReactNode>; toc: Toc }

/** data/notes.ts の slug → 本文（日本語・英語）。ノートを足したらここにも登録する */
export const noteBodies: Record<string, NoteBody> = {
  'git-worktree': { Body: { ja: GitWorktree, en: GitWorktreeEn }, toc: gitWorktreeToc },
  hnsw: { Body: { ja: Hnsw, en: HnswEn }, toc: hnswToc },
  'oss-issue': { Body: { ja: OssIssue, en: OssIssueEn }, toc: ossIssueToc },
}
