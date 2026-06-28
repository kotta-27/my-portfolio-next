import type { Lang } from '@/types'

export type ProjectLink = {
  label: string
  url: string
}

export type ProjectMeta = {
  reflection?: Record<Lang, string>
  contributions?: Record<Lang, string[]>
  period?: string
  role?: Record<Lang, string[]>
  members?: Record<Lang, string>
  event?: string
}

export type ProjectItem = {
  name: string
  slug: string
  image: string
  tags: string[]
  links: ProjectLink[]
  detail: Record<Lang, string>
  meta?: ProjectMeta
} & Record<Lang, string>

export const projectsData: ProjectItem[] = [
  {
    name: 'Quantum Circuit Simulator',
    slug: 'quantum-circuit-simulator',
    en: 'Browser-based quantum circuit simulator built with Nuxt.js.',
    ja: 'Nuxt.js で構築したブラウザ上で動く量子回路シミュレータ。',
    detail: {
      en: 'A browser-based quantum circuit simulator for visually placing and connecting quantum gates to explore quantum computation. Built with Nuxt.js, it simulates qubit state evolution in real time — from ideal probability distributions to noisy sampling — all without any local setup.',
      ja: '量子ゲートを視覚的に配置・接続し、量子計算を体験できるブラウザ上の量子回路シミュレータ。Nuxt.js で構築し、Qubitの状態変化をリアルタイムにシミュレーション。理想的な確率分布の表示から、ノイズを含めたサンプリングまでをローカル環境不要で量子回路設計を手軽に試せる。',
    },
    tags: ['Nuxt.js', 'Quantum Computing'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kotta-27/nuxt-qc-app' },
      { label: 'App', url: 'https://nuxt-qc-app.vercel.app/' },
    ],
    image: '/qc_nuxt_1.png',
    meta: {
      reflection: {
        en: 'Getting drag-and-drop to feel natural was a real challenge. Designing the UI representation of control and target qubits for multi-qubit gates was also particularly tricky.',
        ja: 'DnDを違和感なく実装するのに苦労しました。また、複数量子ゲートにおける制御・標的ビットのUI表現の設計は難しかったです。',
      },
      contributions: {
        en: [
          'Circuit UI design and implementation',
          'Qubit state simulation logic',
          'Gate operation rendering',
        ],
        ja: [
          '回路UIのデザインと実装',
          'Qubit状態シミュレーションロジックの実装',
          'ゲート操作のレンダリング',
        ],
      },
      period: '2025-Jan（5日）',
      role: { en: ['All'], ja: ['すべて'] },
      members: { en: '1 person', ja: '1人' },
      event: undefined,
    },
  },
  {
    name: 'Orbit',
    slug: 'orbit',
    en: 'Task management app with habit, routine, and TODO tracking.',
    ja: '習慣・ルーティン・TODOをまとめて管理するタスク管理アプリ。',
    detail: {
      en: 'A personal productivity app built to unify habit tracking, daily routines, and one-off TODOs in a single interface. Designed around a calendar-first view, it lets users visualize consistency over time. Built with Vue.js and Ruby on Rails, backed by PostgreSQL.',
      ja: '習慣・ルーティン・TODOを一元管理するパーソナル生産性アプリ。カレンダービューを中心に据え、継続性を可視化できる設計。Vue.js + Ruby on Rails + PostgreSQL で構築。',
    },
    tags: ['Vue.js', 'Rails', 'PostgreSQL'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kotta-27/orbit-todo-app' },
    ],
    image: '/orbit_1.png',
    meta: {
      reflection: {
        en: 'Designing a unified interface for three different task types — habits, routines, and TODOs — was the core challenge. Balancing flexibility with simplicity in the UX took several iterations.',
        ja: '習慣・ルーティン・TODOという3種類の異なるタスクを一つのUIで扱う設計が難しかったです。柔軟性とシンプルさのバランスを取るためにUIを何度も見直しました。',
      },
      contributions: {
        en: ['Full-stack implementation', 'Database schema design', 'Calendar UI design'],
        ja: ['フルスタック実装', 'データベーススキーマ設計', 'カレンダーUIのデザイン'],
      },
      period: '2023-XX（XX日）',
      role: { en: ['All'], ja: ['すべて'] },
      members: { en: '1 person', ja: '1人' },
    },
  },
  {
    name: 'Lab Purchase System',
    slug: 'lab-purchase-system',
    en: 'Purchase request management for research labs with approval workflows.',
    ja: '承認フロー付き、研究室向け購入申請管理システム。',
    detail: {
      en: 'An internal tool for university research labs to manage equipment and consumable purchase requests. Features a multi-step approval workflow and Discord integration for instant notifications to lab members.',
      ja: '大学研究室向けの物品購入申請管理システム。承認フローと Discord 通知連携を実装し、研究室内のやり取りを効率化。',
    },
    tags: ['React', 'Firebase', 'Discord API'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kotta-27/lab-purchase-app' },
    ],
    image: '/purchase_1.png',
    meta: {
      reflection: {
        en: 'Building a real tool for actual lab members meant requirements kept evolving. Integrating Discord notifications made the approval flow much more practical for day-to-day use.',
        ja: '実際に研究室メンバーが使うツールだったため、要件が開発中に変化し続けました。Discord通知の連携を追加したことで、承認フローが実用的になりました。',
      },
      contributions: {
        en: ['Full-stack implementation', 'Approval workflow design', 'Discord notification integration'],
        ja: ['フルスタック実装', '承認フロー設計', 'Discord通知連携'],
      },
      period: '2024-XX（XX日）',
      role: { en: ['All'], ja: ['すべて'] },
      members: { en: '1 person', ja: '1人' },
    },
  },
  {
    name: 'Quantum Pizza',
    slug: 'quantum-pizza',
    en: 'Educational quantum gate game — learn quantum information by making pizza.',
    ja: 'ピザを作りながら量子情報を学ぶ、量子ゲートの教育ゲーム。',
    detail: {
      en: 'A browser-based educational game that teaches quantum gate operations through a pizza-making metaphor. Players apply quantum gates (X, H, CNOT…) to qubits to reach target states, making abstract concepts tangible and fun.',
      ja: 'ピザ作りを通して量子ゲート操作を学ぶブラウザゲーム。X・H・CNOTなどのゲートをクビットに適用して目標状態を目指す。抽象的な概念を直感的に体験できる設計。',
    },
    tags: ['React', 'Quantum Computing'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kotta-27/qpizza-game' },
    ],
    image: '/qpizza_1.png',
    meta: {
      reflection: {
        en: 'Mapping quantum gate logic onto a pizza-making narrative required creative thinking about how to make abstract concepts feel tangible. It was a great exercise in educational UX design.',
        ja: '量子ゲートの動作をピザ作りのストーリーに落とし込む発想が難しかったです。抽象的な概念を直感的に体験させる教育UXの設計を深く考える良い機会になりました。',
      },
      contributions: {
        en: ['Game mechanics design', 'Quantum gate logic implementation', 'UI/UX design'],
        ja: ['ゲームメカニクス設計', '量子ゲートロジックの実装', 'UI/UXデザイン'],
      },
      period: '2024-XX（XX日）',
      role: { en: ['All'], ja: ['すべて'] },
      members: { en: '1 person', ja: '1人' },
    },
  },
  {
    name: 'ImgToLatex',
    slug: 'img-to-latex',
    en: 'AI tool that converts math formula images to LaTeX code using Gemini.',
    ja: 'Gemini APIで数式画像をLaTeXコードに変換するAIツール。',
    detail: {
      en: 'A web tool that takes a photo or screenshot of a handwritten or printed math formula and returns clean LaTeX code, powered by Google Gemini\'s vision API. Aimed at students and researchers who need to digitize equations quickly.',
      ja: '手書き・印刷された数式の画像をアップロードすると、Gemini Vision API が LaTeX コードに変換するWebツール。式のデジタル化を素早く行いたい学生・研究者向け。',
    },
    tags: ['React', 'Gemini API'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kotta-27/img2tex-app' },
    ],
    image: '/tex_1.png',
    meta: {
      reflection: {
        en: 'Getting Gemini to output clean, well-structured LaTeX consistently required careful prompt engineering. Handling edge cases like complex fraction and matrix notation was trickier than expected.',
        ja: 'Geminiが安定してきれいなLaTeXを出力するようにプロンプトを調整するのが大変でした。分数や行列など複雑な数式のエッジケース対応が予想以上に難しかったです。',
      },
      contributions: {
        en: ['UI design and implementation', 'Gemini API integration', 'LaTeX output formatting'],
        ja: ['UIデザインと実装', 'Gemini API連携', 'LaTeX出力のフォーマット調整'],
      },
      period: '2024-XX（XX日）',
      role: { en: ['All'], ja: ['すべて'] },
      members: { en: '1 person', ja: '1人' },
    },
  },
  {
    name: 'なんJenerator',
    slug: 'nanjenerator',
    en: 'AI-powered 2ch-style thread generator using Amazon Bedrock.',
    ja: 'Amazon Bedrockを使ったAI搭載の2ch風スレ生成ツール。',
    detail: {
      en: 'Enter any topic and get a fully generated 2ch-style thread complete with OP post and replies, all powered by Amazon Bedrock (Claude). Built at a hackathon, it became unexpectedly popular among friends.',
      ja: 'テーマを入力すると、Amazon Bedrock（Claude）が2ch風のスレッドをOP・レス込みで丸ごと生成。ハッカソンで制作し、身内に予想外に好評だったツール。',
    },
    tags: ['React', 'Python', 'AWS Bedrock'],
    links: [],
    image: '/nanj_1.png',
    meta: {
      reflection: {
        en: 'The hardest part was tuning the prompt to consistently capture the tone and rhythm of 2ch-style posts. Seeing it go viral among friends was a great validation of the concept.',
        ja: '2ch特有の文体やテンポをAIに再現させるプロンプト調整が一番難しかったです。身内でバズったときは、コンセプトが通じたと実感しました。',
      },
      contributions: {
        en: ['Prompt engineering', 'Frontend implementation', 'AWS Bedrock integration'],
        ja: ['プロンプトエンジニアリング', 'フロントエンド実装', 'AWS Bedrock連携'],
      },
      period: '2024-XX（1日）',
      role: { en: ['All'], ja: ['すべて'] },
      members: { en: '1 person', ja: '1人' },
      event: 'Hackathon',
    },
  },
  {
    name: 'Quantum Super Techshiba-kun',
    slug: 'quantum-super-techshiba-kun',
    en: 'Side-scrolling game featuring quantum information technology as in-game elements.',
    ja: '量子情報技術をゲーム要素に組み込んだ横スクロールゲーム。',
    detail: {
      en: 'A side-scrolling platformer where quantum mechanics aren\'t just a theme — they\'re core mechanics. Superposition, entanglement, and measurement collapse are used as gameplay elements, built in React and deployed on Vercel.',
      ja: '量子力学をテーマではなくゲームメカニクスそのものに組み込んだ横スクロールアクション。重ね合わせ・もつれ・測定崩壊がプレイ要素として機能する。React + Vercel で構築。',
    },
    tags: ['React', 'Vercel'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kotta-27/q-mario-app' },
    ],
    image: '/qmario_1.png',
    meta: {
      reflection: {
        en: 'Designing game mechanics that genuinely reflect quantum phenomena — not just as a theme but as core gameplay — was the most intellectually stimulating part of this project.',
        ja: '量子力学をテーマとしてだけでなく、ゲームメカニクスそのものとして機能させる設計が、このプロジェクトで最も知的に刺激的な部分でした。',
      },
      contributions: {
        en: ['Game design and mechanics', 'Quantum logic implementation', 'Frontend implementation'],
        ja: ['ゲーム設計とメカニクス', '量子ロジックの実装', 'フロントエンド実装'],
      },
      period: '2024-XX（XX日）',
      role: { en: ['All'], ja: ['すべて'] },
      members: { en: '1 person', ja: '1人' },
    },
  },
]

export const techStrip = [
  'React · Next.js',
  'Vue.js · TypeScript',
  'Python · Ruby on Rails',
  'Qiskit · Quantum',
  'AWS · Docker',
]
