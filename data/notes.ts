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

export const notesData: NoteMeta[] = []
