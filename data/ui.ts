import type { Lang, View } from '@/types'

type UiStrings = {
  sections: {
    about: string
    career: string
    skills: string
    projects: string
    awards: string
    contact: string
  }
  nav: { label: string; view: View }[]
  tiles: {
    currently: string
    education: string
    tokyo: string
    tokyoSub: string
    skillsYears: string
    interests: string
    hobbies: string
    prizes: string
    writing: string
    intern: string
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
      skills: 'Skills',
      projects: 'Projects',
      awards: 'Awards',
      contact: 'Contact',
    },
    nav: [
      { label: 'Overview', view: 'all' },
      { label: 'Career', view: 'career' },
      { label: 'Skills', view: 'skills' },
      { label: 'Projects', view: 'projects' },
      { label: 'Writing', view: 'writing' },
    ],
    tiles: {
      currently: 'Currently',
      education: 'Education',
      tokyo: 'Tokyo',
      tokyoSub: 'JST · usually online 10–19',
      skillsYears: 'Skills · years',
      interests: 'Interests',
      hobbies: 'Off the clock',
      prizes: 'prizes',
      writing: 'Writing',
      intern: 'Intern',
      projectsBlurb: 'Web apps, hackathon builds and research tools.',
      moreProjects: 'more projects',
      lessProjects: 'Show less',
      contactTitle: "Let's talk.",
    },
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
      skills: 'Skills',
      projects: 'Projects',
      awards: 'Awards',
      contact: 'Contact',
    },
    nav: [
      { label: 'Overview', view: 'all' },
      { label: 'Career', view: 'career' },
      { label: 'Skills', view: 'skills' },
      { label: 'Projects', view: 'projects' },
      { label: 'Writing', view: 'writing' },
    ],
    tiles: {
      currently: '現職',
      education: '学歴',
      tokyo: '東京',
      tokyoSub: 'JST · だいたい 10–19 時に稼働',
      skillsYears: 'スキル · 経験年数',
      interests: '興味',
      hobbies: '趣味',
      prizes: '受賞',
      writing: '技術記事',
      intern: 'インターン',
      projectsBlurb: 'Webアプリ、ハッカソン作品、研究ツール。',
      moreProjects: 'その他のプロジェクト',
      lessProjects: '閉じる',
      contactTitle: "Let's talk.",
    },
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
      prevProject: '前のプロジェクト',
      nextProject: '次のプロジェクト',
    },
    showMoreProjects: 'もっと見る',
    showLessProjects: '閉じる',
  },
}
