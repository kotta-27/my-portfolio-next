import type { Lang } from '@/types'

export type AwardItem = {
  name: string
  award: { [K in Lang]: string }
  date: string
}

export type QiitaArticle = {
  href: string
} & { [K in Lang]: string }

export const awardsData: AwardItem[] = [
  {
    name: 'Progate Hackathon powered by AWS',
    award: { en: 'Best Prize', ja: '最優秀賞' },
    date: 'Jun 2024',
  },
  {
    name: 'Quantum Innovation 2024',
    award: { en: 'Poster Presentation Award for Young Researcher', ja: '若手研究者ポスター発表賞' },
    date: 'Oct 2024',
  },
  {
    name: 'Quantum Annealing Ideathon',
    award: { en: '2nd Place', ja: '2位' },
    date: 'May 2024',
  },
]

export const qiitaArticles: QiitaArticle[] = [
  {
    en: '[QuTiP] Imaginary-time evolution of quantum states in Python',
    ja: '[QuTiP] pythonで量子状態の虚時間発展をシミュレートする',
    href: 'https://qiita.com/Mel_14/items/91465234a64d9a6eec99',
  },
  {
    en: '[Qiskit] QuantumCircuit.draw() usage guide',
    ja: '[Qiskit] QuantumCircuit.draw() の使い方ガイド',
    href: 'https://qiita.com/Mel_14/items/fe9d66c4ef41bc39f224',
  },
  {
    en: 'QURI-Parts installation troubleshooting',
    ja: 'QURI-Parts インストールトラブルシューティング',
    href: 'https://qiita.com/Mel_14/items/02bc1b4e44961bdb2947',
  },
]
