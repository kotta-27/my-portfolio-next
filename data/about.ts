import type { Lang } from '@/types'

type AboutStrings = {
  currently: string
  currentCompany: string
  currentRole: string
  currentPeriod: string
  education: string
  university: string
  degree: string
  research: string
  labGroup: string
  labGroupPrefix: string
  labGroupSuffix: string
}

export const about: Record<Lang, AboutStrings> = {
  en: {
    currently: 'Currently',
    currentCompany: 'Studist Corporation',
    currentRole: 'Software Engineer',
    currentPeriod: 'Teachme Biz · Apr 2026 —',
    education: 'Education',
    university: 'Shibaura Institute of Technology',
    degree: 'M.Eng., 2026',
    research: 'Quantum Algorithms · Lattice Cryptography',
    labGroup: 'Watabe Group',
    labGroupPrefix: 'Former member of',
    labGroupSuffix: '.',
  },
  ja: {
    currently: '現職',
    currentCompany: '株式会社スタディスト',
    currentRole: 'ソフトウェアエンジニア',
    currentPeriod: 'Teachme Biz · 2026年4月〜',
    education: '学歴',
    university: '芝浦工業大学大学院',
    degree: '修士（工学）, 2026年',
    research: '量子アルゴリズム · 格子暗号',
    labGroup: '量子情報工学研究室（渡部研）',
    labGroupPrefix: '所属：',
    labGroupSuffix: '',
  },
}
