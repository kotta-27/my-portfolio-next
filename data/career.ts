import type { Lang } from '@/types'

export type CareerLink = {
  url: string
  label: Record<Lang, string>
  source: string
  thumbnail: string | null
}

/** 1 社の中の 1 ポジション（インターン → 正社員のように複数持てる） */
export type CareerPosition = {
  /** 'Sep 2024 – Mar 2026' / 現職は 'Apr 2026 —' */
  period: string
  isIntern: boolean
  role: Record<Lang, string>
  description: Record<Lang, string>
  /** キャリアタブで箇条書きにする「やったこと」 */
  highlights?: Record<Lang, string[]>
  links: CareerLink[]
}

export type CareerItem = {
  company: Record<Lang, string>
  logo: string
  tags: string[]
  /** 新しい順 */
  positions: CareerPosition[]
}

export type ResolvedCareerLink = Omit<CareerLink, 'thumbnail'> & { image: string | null }

export type ResolvedCareerPosition = Omit<CareerPosition, 'links'> & { links: ResolvedCareerLink[] }

export type ResolvedCareerItem = Omit<CareerItem, 'positions'> & {
  positions: ResolvedCareerPosition[]
}

export const careerData: CareerItem[] = [
  {
    company: { en: 'Studist Corporation', ja: '株式会社スタディスト' },
    logo: '/studist.png',
    tags: ['Ruby on Rails', 'Vue.js', 'Python'],
    positions: [
      {
        period: 'Apr 2026 —',
        isIntern: false,
        role: { en: 'Software Engineer', ja: 'ソフトウェアエンジニア' },
        description: {
          en: 'Teachme Biz product development and R&D.',
          ja: '自社プロダクト「Teachme Biz」の機能開発およびR&D領域。',
        },
        links: [
          {
            url: 'https://zenn.dev/studist/articles/unauthenticated-ai-search-defense-in-depth',
            label: {
              en: 'Defending APIs that let unauthenticated users call an LLM',
              ja: '未認証ユーザに LLM を叩かせる API をどう守るか',
            },
            source: 'Tech Blog',
            thumbnail: null,
          },
          {
            url: 'https://speakerdeck.com/kotap/xin-zu-dakarakosoiroirotiao-zhan-suruzonojuan',
            label: {
              en: "Trying everything — because I'm a new grad",
              ja: '新卒だからこそいろいろ挑戦するぞの巻',
            },
            source: 'Talk',
            thumbnail: '/thumb_speakerdeck_talk.jpg',
          },
        ],
      },
      {
        period: 'Sep 2024 – Mar 2026',
        isIntern: true,
        role: { en: 'Engineer Intern', ja: 'エンジニアインターン' },
        description: {
          en: 'Joined as a long-term intern after a hackathon, developing on the CRE team.',
          ja: 'ハッカソンをきっかけに長期インターンとして参加し、CREチームで開発に携わる。',
        },
        links: [
          {
            url: 'https://path.progate.com/career-stories/studist-intern',
            label: {
              en: 'From a hackathon to a long-term internship — how that meeting changed my job hunt',
              ja: 'ハッカソンから始まった長期インターン。その出会いが変えた就活観とは？',
            },
            source: 'Interview',
            thumbnail: '/thumb_progate.png',
          },
          {
            url: 'https://studist.tech/longterm-intern-mizuno-2779a93df71c',
            label: {
              en: 'What the CRE team taught me about "user-first development"',
              ja: 'CREチームで学んだ"ユーザファーストな開発"',
            },
            source: 'Tech Blog',
            thumbnail: '/thumb_studist_tech.webp',
          },
        ],
      },
    ],
  },
  {
    company: { en: 'Jij Inc.', ja: '株式会社Jij' },
    logo: '/jij.svg',
    tags: ['Python', 'Qiskit'],
    positions: [
      {
        period: 'Oct 2024 – Mar 2025',
        isIntern: true,
        role: { en: 'Research Engineer Intern', ja: 'リサーチエンジニアインターン' },
        description: {
          en: 'Quantum information research — reproducing and evaluating the Noise-Directed Adaptive Remapping (NDAR) method for quantum algorithms.',
          ja: '量子情報分野の提案手法を再現・評価。特にNoise-Directed Adaptive Remapping（NDAR）手法の実験再現と考察。',
        },
        links: [
          {
            url: 'https://www.j-ij.com/ja/recruit/interview-mizuno',
            label: {
              en: 'Summer internship interview',
              ja: 'サマーインターンシップ インタビュー',
            },
            source: 'Interview',
            thumbnail: '/thumb_jij_interview.webp',
          },
        ],
      },
    ],
  },
  {
    company: { en: 'CRISP, INC.', ja: '株式会社CRISP' },
    logo: '/crisp.png',
    tags: ['Python', 'Flutter', 'GCP'],
    positions: [
      {
        period: 'Jun 2024 – Mar 2026',
        isIntern: true,
        role: { en: 'Engineer Intern', ja: 'エンジニアインターン' },
        description: {
          en: 'RAG system design and use-case exploration; Flutter mobile app implementation.',
          ja: 'RAGシステムの設計とユースケース探索。Flutterモバイルアプリの実装。',
        },
        links: [],
      },
    ],
  },
  {
    company: { en: 'QunaSys Inc.', ja: '株式会社QunaSys' },
    logo: '/qunasys.png',
    tags: ['Python'],
    positions: [
      {
        period: 'Sep 2023 – Mar 2024',
        isIntern: true,
        role: { en: 'Quantum Intern', ja: '量子×情報インターン' },
        description: {
          en: 'Quantum information workforce development — skillset definition and science event resource creation.',
          ja: '量子情報人材育成に向けたスキルセット定義と、科学イベント用教材の作成。',
        },
        links: [],
      },
    ],
  },
]
