import type { Lang, View } from '@/types'

type UiStrings = {
  sections: {
    about: string
    career: string
    projects: string
    awards: string
    contact: string
  }
  nav: { label: string; view: View }[]
  /** スマホのタブ一覧で Overview の右に出す文言 */
  navAll: string
  tiles: {
    currently: string
    education: string
    tokyo: string
    tokyoSub: string
    favoriteTech: string
    interests: string
    hobbies: string
    writing: string
    intern: string
    fullTime: string
    careerHighlights: string
    careerLinks: string
    careerMore: string
    projectsBlurb: string
    moreProjects: string
    lessProjects: string
    contactTitle: string
  }
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
    prevProject: string
    nextProject: string
  }
  showMoreProjects: string
  showLessProjects: string
}

export const ui: Record<Lang, UiStrings> = {
  en: {
    sections: {
      about: 'About',
      career: 'Career',
      projects: 'Projects',
      awards: 'Awards',
      contact: 'Contact',
    },
    nav: [
      { label: 'Overview', view: 'all' },
      { label: 'Career', view: 'career' },
      { label: 'Projects', view: 'projects' },
      { label: 'Output', view: 'writing' },
    ],
    tiles: {
      currently: 'Currently',
      education: 'Education',
      tokyo: 'Tokyo',
      tokyoSub: 'JST',
      favoriteTech: 'Favorite tech',
      interests: 'Interests',
      hobbies: 'Off the clock',
      writing: 'Output',
      intern: 'Intern',
      fullTime: 'Full-time',
      careerHighlights: 'What I did',
      careerLinks: 'Related',
      careerMore: 'See details',
      projectsBlurb: 'Web apps, hackathon builds and research tools.',
      moreProjects: 'more projects',
      lessProjects: 'Show less',
      contactTitle: "Let's talk.",
    },
    navAll: 'All',
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
      back: 'Back to Top',
      backToProjects: 'Back to Projects',
      prevProject: 'Previous',
      nextProject: 'Next',
    },
    showMoreProjects: 'Show more projects',
    showLessProjects: 'Show less',
  },
  ja: {
    sections: {
      about: 'About',
      career: 'Career',
      projects: 'Projects',
      awards: 'Awards',
      contact: 'Contact',
    },
    nav: [
      { label: 'Overview', view: 'all' },
      { label: 'Career', view: 'career' },
      { label: 'Projects', view: 'projects' },
      { label: 'Output', view: 'writing' },
    ],
    tiles: {
      currently: 'Currently',
      education: 'Education',
      tokyo: 'Tokyo',
      tokyoSub: 'JST',
      favoriteTech: 'Favorite tech',
      interests: 'Interests',
      hobbies: 'Off the clock',
      writing: 'Output',
      intern: 'インターン',
      fullTime: '正社員',
      careerHighlights: 'What I did',
      careerLinks: 'Related',
      careerMore: '詳しく見る',
      projectsBlurb: 'Webアプリ、ハッカソン作品、研究ツール。',
      moreProjects: 'その他のプロジェクト',
      lessProjects: '閉じる',
      contactTitle: "Let's talk.",
    },
    navAll: 'すべて',
    internships: 'インターン経験',
    articlesLabel: '技術記事',
    footer: '© 2026 水野航太 — Built brick by brick.',
    projectMeta: {
      reflection: 'Reflection',
      contributions: 'Contributions',
      techStack: 'Tech Stack',
      period: '開発期間',
      role: '担当',
      members: 'メンバー',
      event: '発表',
      back: 'TOPに戻る',
      backToProjects: 'Projectsに戻る',
      prevProject: 'Previous',
      nextProject: 'Next',
    },
    showMoreProjects: 'もっと見る',
    showLessProjects: '閉じる',
  },
}
