import type { Lang } from '@/types'

export type ActivityCategory = 'hackathon' | 'conference' | 'event'

export type SubLinkCard = { url: string; en: string; ja: string; thumbnail?: string }

export type ActivityItem = {
  en: string
  ja: string
  date: string
  category: ActivityCategory
  award?: { en: string; ja: string }
  link?: string
  interview?: SubLinkCard
  pressRelease?: SubLinkCard
  page?: SubLinkCard
}

export type ArticleLink = {
  href: string
  source: 'Qiita' | 'Zenn'
} & { [K in Lang]: string }

export const categoryLabel: Record<ActivityCategory, { en: string; ja: string }> = {
  hackathon: { en: 'Hackathon', ja: 'ハッカソン' },
  conference: { en: 'Conference', ja: '学会' },
  event: { en: 'Event', ja: 'イベント' },
}

export const activitiesData: ActivityItem[] = [
  {
    en: 'Progate Hackathon powered by AWS',
    ja: 'Progate Hackathon powered by AWS',
    date: 'Jun 2024',
    category: 'hackathon',
    award: { en: 'Best Prize', ja: '最優秀賞' },
    page: {
      url: 'https://topaz.dev/projects/c2b70f218e31d6ed65d6',
      en: 'What we built: Project page',
      ja: 'プロジェクトページを見る',
      thumbnail: '/hackathon_page.png',
    },
  },
  {
    en: 'Quantum Annealing Ideathon',
    ja: '量子アニーリングアイディアソン',
    date: 'May 2024',
    category: 'hackathon',
    award: { en: '2nd Place', ja: '2位' },
  },
  {
    en: 'Quantum Innovation 2024 — Poster Session',
    ja: 'Quantum Innovation 2024 — ポスターセッション発表',
    date: 'Oct 2024',
    category: 'conference',
    award: { en: 'Poster Presentation Award for Young Researcher', ja: 'Poster Presentation Award for Young Researcher' },
  },
  {
    en: "Game Exhibition at Osaka-Kansai Expo 'Entangle Moment — [Quantum, Sea, Space] × Art'",
    ja: '大阪・関西万博 エンタングル・モーメント ―［量子・海・宇宙］× 芸術 ゲーム展示',
    date: 'Aug 2025',
    category: 'event',
    pressRelease: {
      url: 'https://www.shibaura-it.ac.jp/headline/detail/20250730_3727.html',
      en: 'Press release (Shibaura Institute of Technology)',
      ja: 'プレスリリース（芝浦工業大学）',
    },
  },
  {
    en: "Game Exhibition at Pre-Event of Osaka-Kansai Expo 'Experience Quantum Through Games!'",
    ja: "大阪・関西万博 プレイベント『ゲームで体験！作って実感！量子の世界』ゲーム展示",
    date: 'Mar 2025',
    category: 'event',
  },
  {
    en: 'NQC Quantum ICT Human Resource Development Program',
    ja: '量子ICT人材育成プログラム NQC 参加',
    date: 'Aug 2024 – Feb 2025',
    category: 'event',
    interview: {
      url: 'https://nqc.nict.go.jp/report/250528_02.html',
      en: 'Read the interview',
      ja: 'インタビュー記事を読む',
      thumbnail: '/nqc_interview.png',
    },
  },
  {
    en: "Student Staff — RIKEN × Miraikan 'Quantum Computers Through Quizzes and Games'",
    ja: '理化学研究所×日本科学未来館主催「クイズとゲームでせまる！量子コンピュータ」学生スタッフ',
    date: 'Aug 2024',
    category: 'event',
    link: 'https://www.miraikan.jst.go.jp/events/202408033551.html',
  },
  {
    en: "Student Staff — RIKEN 'What is a Quantum Computer?'",
    ja: '理化学研究所主催「量子コンピュータってなんだろう？」学生スタッフ',
    date: 'Aug 2023',
    category: 'event',
    link: 'https://www.riken.jp/pr/events/events/20230811_1/index.html',
  },
]

export const articles: ArticleLink[] = [
  {
    en: '[Qiskit] How to use QuantumCircuit.draw() for circuit visualization',
    ja: '【Qiskit】量子回路描画QuantumCircuit.draw()の使い方',
    href: 'https://zenn.dev/kotap/articles/acfc7bdcf478e5',
    source: 'Zenn',
  },
  {
    en: '[Dify] Fix for "Weaviate 1.19 is not supported" after an update',
    ja: '【Dify】アプデで「Weaviate 1.19 is not supported」が出た時の対処法',
    href: 'https://zenn.dev/kotap/articles/ea3b5995b8ba44',
    source: 'Zenn',
  },
  {
    en: '[LaTeX] Using the latexdiff command in Overleaf',
    ja: '【LaTex】Overleafでlatexdiffコマンドを使う',
    href: 'https://zenn.dev/kotap/articles/5ea5c8b69ecbef',
    source: 'Zenn',
  },
]
