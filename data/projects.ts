import type { Lang } from '@/types'

export type ProjectItem = {
  name: string
  href: string
  image: string
  tags: string[]
} & { [K in Lang]: string }

export const projectsData: ProjectItem[] = [
  {
    name: 'Orbit',
    en: 'Task management app with habit, routine, and TODO tracking.',
    ja: '習慣・ルーティン・TODOをまとめて管理するタスク管理アプリ。',
    tags: ['Vue.js', 'Rails', 'PostgreSQL'],
    href: 'https://github.com/kotta-27/orbit-todo-app',
    image: '/orbit_1.png',
  },
  {
    name: 'Lab Purchase System',
    en: 'Purchase request management for research labs with approval workflows.',
    ja: '承認フロー付き、研究室向け購入申請管理システム。',
    tags: ['React', 'Firebase', 'Discord API'],
    href: '#',
    image: '/purchase_1.png',
  },
  {
    name: 'Quantum Pizza',
    en: 'Educational quantum gate game — learn quantum information by making pizza.',
    ja: 'ピザを作りながら量子情報を学ぶ、量子ゲートの教育ゲーム。',
    tags: ['React', 'Quantum Computing'],
    href: '#',
    image: '/qpizza_1.png',
  },
  {
    name: 'ImgToLatex',
    en: 'AI tool that converts math formula images to LaTeX code using Gemini.',
    ja: 'Gemini APIで数式画像をLaTeXコードに変換するAIツール。',
    tags: ['React', 'Gemini API'],
    href: '#',
    image: '/tex_1.png',
  },
  {
    name: 'なんJenerator',
    en: 'AI-powered 2ch-style thread generator using Amazon Bedrock.',
    ja: 'Amazon Bedrockを使ったAI搭載の2ch風スレ生成ツール。',
    tags: ['React', 'Python', 'AWS Bedrock'],
    href: '#',
    image: '/nanj_1.png',
  },
  {
    name: 'Quantum Super Techshiba-kun',
    en: 'Side-scrolling game featuring quantum information technology as in-game elements.',
    ja: '量子情報技術をゲーム要素に組み込んだ横スクロールゲーム。',
    tags: ['React', 'Vercel'],
    href: '#',
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
