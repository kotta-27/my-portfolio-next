import type { Lang } from '@/types'
import type { Section } from '@/lib/town/sections'

/*
 * トップの「レゴの街」の文言。建物の看板（英字 + 小さな言葉）と、操作の説明。
 */

type TownStrings = {
  /** 建物の看板。title は英字、sub は看板に小さく添える */
  buildings: Record<Section, { title: string; sub: string }>
  hint: string
  /** 街の読み上げ */
  label: string
  close: string
  /** パネルから一覧ページへ */
  more: Record<'works' | 'career' | 'output', (n: number) => string>
  careerNote: string
  now: string
}

export const town: Record<Lang, TownStrings> = {
  ja: {
    buildings: {
      about: { title: 'ABOUT', sub: '自己紹介' },
      works: { title: 'WORKS', sub: '作ったもの' },
      career: { title: 'CAREER', sub: '経歴' },
      output: { title: 'OUTPUT', sub: '書いたもの' },
      contact: { title: 'CONTACT', sub: '連絡先' },
    },
    hint: '建物をクリック ／ ← → で歩く ／ ドラッグで回す',
    label: 'レゴで組んだ街。建物がそれぞれ、自己紹介・作ったもの・経歴・書いたもの・連絡先になっている',
    close: '閉じる',
    more: {
      works: (n) => `すべての作品を見る（${n}）`,
      career: () => '経歴を詳しく見る',
      output: (n) => `すべて見る（${n}）`,
    },
    careerNote: '建物は下の階から古い順。一番上の階が今の会社。',
    now: '現在',
  },
  en: {
    buildings: {
      about: { title: 'ABOUT', sub: 'About me' },
      works: { title: 'WORKS', sub: 'Projects' },
      career: { title: 'CAREER', sub: 'Career' },
      output: { title: 'OUTPUT', sub: 'Writing' },
      contact: { title: 'CONTACT', sub: 'Contact' },
    },
    hint: 'Click a building / ← → to walk / drag to rotate',
    label: 'A town built from bricks. Each building is a section: about, works, career, writing and contact',
    close: 'Close',
    more: {
      works: (n) => `See all projects (${n})`,
      career: () => 'See full career',
      output: (n) => `See all (${n})`,
    },
    careerNote: 'Oldest company on the ground floor, the current one at the top.',
    now: 'now',
  },
}
