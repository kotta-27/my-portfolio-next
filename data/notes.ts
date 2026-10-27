import type { Lang } from '@/types'

/** ポートフォリオ内で書く学習ノート。本文は components/notes/ の slug と同名のコンポーネント */
export type NoteMeta = {
  slug: string
  title: Record<Lang, string>
  summary: Record<Lang, string>
  /** 公開日（YYYY-MM-DD） */
  date: string
  tags: string[]
}

export const notesData: NoteMeta[] = [
  {
    slug: 'git-worktree',
    title: {
      en: 'What is git worktree?',
      ja: 'git worktree とは？',
    },
    summary: {
      en: 'Study notes on git worktree: how it differs from stash & switch, what lives in .git, and the pitfalls — with interactive diagrams.',
      ja: 'stash と switch で行き来する代わりに、ブランチごとに作業フォルダを並べる。仕組み（.git の中身）と注意点を、動く図で整理した勉強の記録。',
    },
    date: '2026-10-27',
    tags: ['Git', 'CLI'],
  },
]
