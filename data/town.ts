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
  /** スマホの下の地図・パネルのつまみ（読み上げ用） */
  mapLabel: string
  sheetMore: string
  sheetLess: string
  /** パネルから一覧ページへ */
  more: Record<'works' | 'career' | 'output', (n: number) => string>
  now: string
  /** ABOUT の家のパネル */
  about: {
    kana: string
    role: string
    /** これまで（2 文）。link.text の部分を link.href へのリンクにする */
    story: string
    link: { text: string; href: string }
    likes: string
    /** 好きな技術。パネルの 3 列に収まる短さで（長い説明は data/favoriteTech.ts） */
    likeItems: { name: string; note: string }[]
    awards: string
    /** 受賞・展示。名前は短くしたもの（正式名は data/awards.ts）。best は一番の受賞（色を変える） */
    awardItems: { date: string; title: string; badge: string; best?: boolean }[]
    /** 余談 1 行 */
    aside: string
  }
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
    hint: '建物や看板をクリック ／ ← → か A D で歩く・↑ W で入る・↓ S で道に戻る ／ ベンチは長押しで動かせる',
    label: 'レゴで組んだ街。建物がそれぞれ、自己紹介・作ったもの・経歴・書いたもの・連絡先になっている',
    close: '閉じる',
    mapLabel: '街の地図',
    sheetMore: 'パネルを広げる',
    sheetLess: 'パネルを縮める',
    more: {
      works: (n) => `すべての作品を見る（${n}）`,
      career: () => '経歴を詳しく見る',
      output: (n) => `すべて見る（${n}）`,
    },
    now: '現在',
    about: {
      kana: '水野 航太',
      role: 'SOFTWARE ENGINEER · TOKYO',
      story:
        '大学院では量子アルゴリズムと格子暗号を研究しながら、量子の考え方をゲームや触れる UI で伝えるものを作ってきました。いまはスタディストで、検索の仕組みと、使う人が迷わない画面の両方をつくっています。',
      link: { text: 'スタディスト', href: 'https://studist.jp/' },
      likes: 'LIKES',
      likeItems: [
        { name: 'Vue.js', note: '素直なリアクティビティで、書きやすく読みやすい' },
        { name: 'Three.js', note: 'ブラウザだけで 3D。この街もこれ' },
        { name: '検索技術', note: '欲しい結果が上に来る仕組み' },
      ],
      awards: 'AWARDS & EXHIBITS',
      awardItems: [
        { date: '2024.06', title: 'Progate Hackathon powered by AWS', badge: '最優秀賞', best: true },
        { date: '2024.05', title: '量子アニーリングアイディアソン', badge: '2位' },
        { date: '2024.10', title: 'Quantum Innovation 2024 ポスター', badge: '若手ポスター賞' },
        { date: '2025.08', title: '大阪・関西万博でゲーム展示', badge: '展示' },
      ],
      aside: 'レゴとドラクエと謎解きが好き。',
    },
  },
  en: {
    buildings: {
      about: { title: 'ABOUT', sub: 'About me' },
      works: { title: 'WORKS', sub: 'Projects' },
      career: { title: 'CAREER', sub: 'Career' },
      output: { title: 'OUTPUT', sub: 'Writing' },
      contact: { title: 'CONTACT', sub: 'Contact' },
    },
    hint: 'Click a building or sign / ← → or A D walk, ↑ W enter, ↓ S back to the street / long-press a bench to move it',
    label: 'A town built from bricks. Each building is a section: about, works, career, writing and contact',
    close: 'Close',
    mapLabel: 'Town map',
    sheetMore: 'Expand panel',
    sheetLess: 'Shrink panel',
    more: {
      works: (n) => `See all projects (${n})`,
      career: () => 'See full career',
      output: (n) => `See all (${n})`,
    },
    now: 'now',
    about: {
      kana: '',
      role: 'SOFTWARE ENGINEER · TOKYO',
      story:
        'In grad school I researched quantum algorithms and lattice cryptography, and built games and hands-on UIs that explain quantum ideas. Now at Studist, I work on both how search works and screens people never get lost in.',
      link: { text: 'Studist', href: 'https://studist.jp/' },
      likes: 'LIKES',
      likeItems: [
        { name: 'Vue.js', note: 'Plain reactivity and single-file components' },
        { name: 'Three.js', note: '3D in the browser. This town, too' },
        { name: 'Search', note: 'Getting the right result to the top' },
      ],
      awards: 'AWARDS & EXHIBITS',
      awardItems: [
        { date: '2024.06', title: 'Progate Hackathon powered by AWS', badge: 'Best Prize', best: true },
        { date: '2024.05', title: 'Quantum Annealing Ideathon', badge: '2nd Place' },
        { date: '2024.10', title: 'Quantum Innovation 2024 poster', badge: 'Young Researcher Award' },
        { date: '2025.08', title: 'Game exhibit at Expo 2025 Osaka', badge: 'Exhibit' },
      ],
      aside: 'I love LEGO, Dragon Quest and puzzle games.',
    },
  },
}
