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
  internships: string
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
    internships: 'Internships',
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
    internships: 'インターン経験',
    contactTitle: 'お気軽にご連絡を。',
    contactBody:
      '新しいプロジェクト・研究コラボレーション・量子コンピューティングやWebエンジニアリングに関する面白い会話を歓迎します。',
    qiitaLabel: 'Qiita 記事',
    footer: '© 2026 水野航太 — Built brick by brick.',
  },
}
