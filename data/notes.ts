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
    slug: 'oss-issue',
    title: {
      en: 'Filing issues to a large OSS project (OpenSearch)',
      ja: '大きめの OSS に Issue を出してみた（OpenSearch）',
    },
    summary: {
      en: 'How I prepared, wrote and followed up a bug report (and a feature request) to OpenSearch — the flow, the structure of the issue, what happened after, and the mindset.',
      ja: 'OpenSearch に出したバグ報告を中心に、出すまでの流れ・Issue の組み立て・出したあとに起きたこと・心構えを、図でまとめた記録。機能要望の 1 件にも触れる。',
    },
    date: '2026-10-28',
    tags: ['OSS', 'OpenSearch'],
  },
  {
    slug: 'hnsw',
    title: {
      en: 'How HNSW works',
      ja: 'HNSW アルゴリズムの仕組み',
    },
    summary: {
      en: 'How HNSW finds nearest vectors fast: greedy graph search, stacked layers, random levels, insertion and the M / ef parameters — with a small working HNSW in the page.',
      ja: '近いベクトルを速く探す HNSW を、グラフの貪欲探索・層の重ね方・層の決め方・点の入れ方・パラメータの順に、ページ内で実際に動かした図で整理した勉強の記録。',
    },
    date: '2026-10-27',
    tags: ['Vector Search', 'Algorithm'],
  },
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
