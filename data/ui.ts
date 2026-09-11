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
  articlesLabel: string
  footer: string
  projectMeta: {
    reflection: string
    contributions: string
    techStack: string
    period: string
    role: string
    members: string
    event: string
    back: string
    backToProjects: string
  }
  showMoreProjects: string
  showLessProjects: string
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
    articlesLabel: 'Articles',
    footer: '© 2026 Kota Mizuno — Built brick by brick.',
    projectMeta: {
      reflection: 'Reflection',
      contributions: 'Contributions',
      techStack: 'Tech Stack',
      period: 'Period',
      role: 'Role',
      members: 'Team',
      event: 'Event',
      back: 'Back',
      backToProjects: 'Back to Projects',
    },
    showMoreProjects: 'Show more projects',
    showLessProjects: 'Show less',
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
    articlesLabel: '技術記事',
    footer: '© 2026 水野航太 — Built brick by brick.',
    projectMeta: {
      reflection: '感想',
      contributions: '貢献',
      techStack: '使用技術',
      period: '開発期間',
      role: '担当',
      members: 'メンバー',
      event: '発表',
      back: '戻る',
      backToProjects: '戻る',
    },
    showMoreProjects: 'もっと見る',
    showLessProjects: '閉じる',
  },
}
