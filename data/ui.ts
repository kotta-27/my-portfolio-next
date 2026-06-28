import type { Lang } from '@/types'

type UiStrings = {
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
  qiitaLabel: string
  footer: string
}

export const ui: Record<Lang, UiStrings> = {
  en: {
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
    qiitaLabel: 'Qiita Articles',
    footer: '© 2026 Kota Mizuno — Built brick by brick.',
  },
  ja: {
    sections: {
      about: 'About',
      career: 'Career',
      skills: 'Skills',
      projects: 'Projects',
      awards: 'Awards & Output',
      contact: 'Contact',
    },
    nav: ['About', 'Career', 'Skills', 'Projects'],
    internships: 'インターン経験',
    qiitaLabel: 'Qiita 記事',
    footer: '© 2026 水野航太 — Built brick by brick.',
  },
}
