export type CareerLink = {
  url: string
  label: string
  source: string
  thumbnail: string | null
}

export type CareerItem = {
  en: { company: string; role: string; description: string }
  ja: { company: string; role: string; description: string }
  period: string
  isIntern: boolean
  tags: string[]
  logo: string
  links: CareerLink[]
}

export type ResolvedCareerLink = Omit<CareerLink, 'thumbnail'> & { image: string | null }

export type ResolvedCareerItem = Omit<CareerItem, 'links'> & {
  links: ResolvedCareerLink[]
}

export const careerData: CareerItem[] = [
  {
    en: {
      company: 'Studist Corporation',
      role: 'Software Engineer',
      description:
        'Teachme Biz product development and R&D. ',
    },
    ja: {
      company: '株式会社スタディスト',
      role: 'ソフトウェアエンジニア',
      description:
        '自社プロダクト「Teachme Biz」の機能開発およびR&D領域。',
    },
    period: 'Apr 2026 —',
    isIntern: false,
    tags: ['Ruby on Rails', 'Vue.js', 'Python'],
    logo: '/studist.png',
    links: [
      {
        url: 'https://path.progate.com/career-stories/studist-intern',
        label: 'ハッカソンから始まった長期インターン。その出会いが変えた就活観とは？',
        source: 'Interview',
        thumbnail: '/thumb_progate.png',
      },
      {
        url: 'https://studist.tech/longterm-intern-mizuno-2779a93df71c',
        label: 'CREチームで学んだ"ユーザファーストな開発"',
        source: 'Tech Blog',
        thumbnail: '/thumb_studist_tech.webp',
      },
      {
        url: 'https://speakerdeck.com/kotap/xin-zu-dakarakosoiroirotiao-zhan-suruzonojuan',
        label: '新卒だからこそいろいろ挑戦するぞの巻',
        source: 'Talk',
        thumbnail: null,
      },
    ],
  },
  {
    en: {
      company: 'Jij Inc.',
      role: 'Research Engineer Intern',
      description:
        'Quantum information research — reproducing and evaluating the Noise-Directed Adaptive Remapping (NDAR) method for quantum algorithms.',
    },
    ja: {
      company: '株式会社Jij',
      role: 'リサーチエンジニアインターン',
      description:
        '量子情報分野の提案手法を再現・評価。特にNoise-Directed Adaptive Remapping（NDAR）手法の実験再現と考察。',
    },
    period: 'Oct 2024 – Mar 2025',
    isIntern: true,
    tags: ['Python', 'Qiskit'],
    logo: '/jij.svg',
    links: [
      {
        url: 'https://www.j-ij.com/ja/recruit/interview-mizuno',
        label: 'サマーインターンシップ インタビュー',
        source: 'Interview',
        thumbnail: '/thumb_jij_interview.webp',
      },
    ],
  },
  {
    en: {
      company: 'CRISP, INC.',
      role: 'Engineer Intern',
      description: 'RAG system design and use-case exploration; Flutter mobile app implementation.',
    },
    ja: {
      company: '株式会社CRISP',
      role: 'エンジニアインターン',
      description: 'RAGシステムの設計とユースケース探索。Flutterモバイルアプリの実装。',
    },
    period: 'Jun 2024 – Mar 2026',
    isIntern: true,
    tags: ['Python', 'Flutter', 'GCP'],
    logo: '/crisp.png',
    links: [],
  },
  {
    en: {
      company: 'QunaSys Inc.',
      role: 'Quantum Intern',
      description:
        'Quantum information workforce development — skillset definition and science event resource creation.',
    },
    ja: {
      company: '株式会社QunaSys',
      role: '量子×情報インターン',
      description: '量子情報人材育成に向けたスキルセット定義と、科学イベント用教材の作成。',
    },
    period: 'Sep 2023 – Mar 2024',
    isIntern: true,
    tags: ['Python'],
    logo: '/qunasys.png',
    links: [],
  },
]
