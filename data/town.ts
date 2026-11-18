import type { Lang } from '@/types'
import type { Section } from '@/lib/town/sections'

/** 手前の歩道に立てる看板（外へのリンク）。アイコンは components/town/TownView.tsx で react-icons から描く */
export type TownLink = { id: 'x' | 'github' | 'zenn' | 'mail'; label: string; href: string; bg: string; fg: string }

export const townLinks: TownLink[] = [
  { id: 'x', label: '@Melmol_27', href: 'https://x.com/Melmol_27', bg: '#0F1419', fg: '#FFFFFF' },
  { id: 'github', label: 'kotta-27', href: 'https://github.com/kotta-27', bg: '#24292F', fg: '#FFFFFF' },
  { id: 'zenn', label: 'kotap', href: 'https://zenn.dev/kotap', bg: '#3EA8FF', fg: '#FFFFFF' },
  { id: 'mail', label: 'Mail', href: 'mailto:mizukou27@gmail.com', bg: '#C84A2C', fg: '#FFFFFF' },
]

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
    hint: '建物や看板をクリック ／ ← → で歩く・↑ で入る・↓ で道に戻る ／ ドラッグで回す',
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
    hint: 'Click a building or sign / ← → walk, ↑ enter, ↓ back to the street / drag to rotate',
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
