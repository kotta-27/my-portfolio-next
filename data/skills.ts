import type { Lang } from '@/types'

type SkillGroup = {
  [K in Lang]: string
} & {
  skills: { name: string; years: string }[]
}

export const skillsData: SkillGroup[] = [
  {
    en: 'Frontend',
    ja: 'フロントエンド',
    skills: [
      { name: 'React / Next.js', years: '3y' },
      { name: 'Vue.js', years: '2y' },
      { name: 'TypeScript', years: '3y' },
      { name: 'CSS / SCSS', years: '3y' },
    ],
  },
  {
    en: 'Backend',
    ja: 'バックエンド',
    skills: [
      { name: 'Python', years: '4y' },
      { name: 'Ruby on Rails', years: '2y' },
      { name: 'Django', years: '2y' },
      { name: 'Node.js', years: '2y' },
    ],
  },
  {
    en: 'Quantum / Research',
    ja: '量子 / 研究',
    skills: [
      { name: 'Qiskit', years: '2y' },
      { name: 'QuTiP', years: '1y' },
      { name: 'Julia', years: '1y' },
      { name: 'LaTeX / Typst', years: '' },
    ],
  },
  {
    en: 'Infra',
    ja: 'インフラ',
    skills: [
      { name: 'AWS', years: '2y' },
      { name: 'GCP', years: '1y' },
      { name: 'Docker', years: '2y' },
      { name: 'Git', years: '4y' },
    ],
  },
]
