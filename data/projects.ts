import type { Lang } from '@/types'

export type ProjectLink = {
  label: string
  url: string
}

export type ProjectItem = {
  name: string
  slug: string
  image: string
  tags: string[]
  links: ProjectLink[]
  detail: Record<Lang, string>
} & Record<Lang, string>

export const projectsData: ProjectItem[] = [
  {
    name: 'Quantum Circuit Simulator',
    slug: 'quantum-circuit-simulator',
    en: 'Browser-based quantum circuit simulator built with Nuxt.js.',
    ja: 'Nuxt.js で構築したブラウザ上で動く量子回路シミュレータ。',
    detail: {
      en: 'A browser-based quantum circuit simulator that lets users place and connect quantum gates visually to explore quantum computation. Built with Nuxt.js, it simulates qubit state evolution in real time, making quantum circuit design accessible without any local setup.',
      ja: '量子ゲートを視覚的に配置・接続し、量子計算を体験できるブラウザ上の量子回路シミュレータ。Nuxt.js で構築し、クビットの状態変化をリアルタイムにシミュレーション。ローカル環境不要で量子回路設計を手軽に試せる。',
    },
    tags: ['Nuxt.js', 'Quantum Computing'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kotta-27/nuxt-qc-app' },
    ],
    image: '/qc_nuxt_1.png',
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
    links: [],
    image: '/purchase_1.png',
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
    links: [],
    image: '/qpizza_1.png',
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
    links: [],
    image: '/tex_1.png',
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
    links: [],
    image: '/qmario_1.png',
  },
]

export const techStrip = [
  'React · Next.js',
  'Vue.js · TypeScript',
  'Python · Ruby on Rails',
  'Qiskit · Quantum',
  'AWS · Docker',
]
