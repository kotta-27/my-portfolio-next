import type { Lang } from '@/types'

type UiStrings = {
  roleTag: string
  tagline: string
  currentlyAt: string
  viewWork: string
  sections: {
    about: string
    career: string
    skills: string
    projects: string
    awards: string
    contact: string
  }
  nav: string[]
  currently: string
  education: string
  currentRole: string
  currentPeriod: string
  degree: string
  research: string
  bio: string
  contactTitle: string
  contactBody: string
  qiitaLabel: string
  footer: string
}

export const ui: Record<Lang, UiStrings> = {
  en: {
    roleTag: 'Software Engineer · Tokyo, Japan',
    tagline: 'Web Engineering.',
    currentlyAt: 'Currently Working at Studist Corporation',
    viewWork: 'View Work',
    sections: {
      about: 'About',
      career: 'Career',
      skills: 'Skills',
      projects: 'Projects',
      awards: 'Awards & Output',
      contact: 'Contact',
    },
    nav: ['About', 'Career', 'Skills', 'Projects'],
    currently: 'Currently',
    education: 'Education',
    currentRole: 'Software Engineer',
    currentPeriod: 'Teachme Biz · Apr 2026 —',
    degree: 'M.Eng., 2026',
    research: 'Quantum Algorithms · Lattice Cryptography',
    bio: 'Tokyo-based software engineer with a background in quantum computing, lattice cryptography, and full-stack web development. I build products at Studist, pursue quantum research, and make educational tools that turn complex ideas into accessible experiences — from quantum gate games to AI-powered formula extractors.',
    contactTitle: "Let's talk.",
    contactBody:
      'Open to new projects, research collaborations, and interesting conversations about quantum computing and web engineering.',
    qiitaLabel: 'Qiita Articles',
    footer: '© 2026 Kota Mizuno — Built brick by brick.',
  },
  ja: {
    roleTag: 'ソフトウェアエンジニア · 東京',
    tagline: 'Web Engineering.',
    currentlyAt: 'Currently Working at Studist Corporation',
    viewWork: '実績を見る',
    sections: {
      about: 'アバウト',
      career: 'キャリア',
      skills: 'スキル',
      projects: 'プロジェクト',
      awards: '受賞・アウトプット',
      contact: 'コンタクト',
    },
    nav: ['About', 'Career', 'Skills', 'Projects'],
    currently: '現職',
    education: '学歴',
    currentRole: 'ソフトウェアエンジニア',
    currentPeriod: 'Teachme Biz · 2026年4月〜',
    degree: '修士（工学）, 2026年',
    research: '量子アルゴリズム · 格子暗号',
    bio: '東京在住のソフトウェアエンジニア。量子コンピューティング・格子暗号・フルスタックWeb開発を専門とする。スタディストでプロダクト開発に従事しながら量子研究を続け、量子ゲートゲームやAI数式抽出ツールなど、複雑なアイデアを誰もがアクセスできる形に変える教育ツールを制作している。',
    contactTitle: 'お気軽にご連絡を。',
    contactBody:
      '新しいプロジェクト・研究コラボレーション・量子コンピューティングやWebエンジニアリングに関する面白い会話を歓迎します。',
    qiitaLabel: 'Qiita 記事',
    footer: '© 2026 水野航太 — Built brick by brick.',
  },
}
