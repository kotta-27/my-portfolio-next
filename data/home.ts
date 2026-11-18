import type { Lang } from '@/types'

/*
 * トップページ（リニューアル版）の文言。デザインは Claude Design の「Portfolio Renewal」A 案。
 */

type Fact = { label: string; title: string; sub: string }

type HomeStrings = {
  nav: { projects: string; career: string; output: string; contact: string; menu: string }
  hero: {
    eyebrow: string
    headline: string
    sub: string
    work: string
    sceneLabel: string
    sceneHint: string
    /** 名前のブロックに添える、スクロールで仕掛けが動くことを伝えるひとこと */
    nameHint: string
  }
  facts: Fact[]
  projects: { eyebrow: string; title: string; blurb: (n: number) => string; more: (n: number) => string; problem: string; approach: string; result: string }
  career: { eyebrow: string; title: string; more: string; now: string }
  output: { eyebrow: string; title: string; more: (n: number) => string; read: string }
  contact: { eyebrow: string; title: string; body: string }
  footer: string
  /** 一覧ページ（/works・/output・/career） */
  pages: { back: string; projects: { title: string; blurb: string }; output: { title: string; blurb: string }; career: { title: string; blurb: string } }
}

export const home: Record<Lang, HomeStrings> = {
  ja: {
    nav: { projects: 'Works', career: 'Career', output: 'Output', contact: 'Contact', menu: 'メニュー' },
    hero: {
      eyebrow: 'SOFTWARE ENGINEER · TOKYO',
      headline: '検索と、触ってわかる UI をつくるエンジニア。',
      sub: '数式や3Dを動かして見せるのが好き。',
      work: '作ったものを見る',
      sceneLabel: 'テクニック部品で組んだ骨組みの時計。振り子が脱進機を 1 歯ずつ進め、6 段の歯車で減速して、文字盤の針が今の時刻を指す',
      sceneHint: 'ドラッグで回す',
      nameHint: 'スクロールで仕掛けが動く',
    },
    facts: [
      { label: 'CURRENTLY', title: '株式会社スタディスト', sub: 'ソフトウェアエンジニア · 2026年4月〜' },
      { label: 'INTERESTS', title: '検索技術 · UI/UX · 3D', sub: 'OpenSearch / Vector Search / Three.js' },
    ],
    projects: {
      eyebrow: 'WORKS',
      title: '作ったもの',
      blurb: (n) => `代表作 ${n} 件。何の問題を、どう工夫して、どうなったか。`,
      more: (n) => `ほか ${n} 件を見る`,
      problem: '問題',
      approach: '工夫',
      result: '結果',
    },
    career: { eyebrow: 'CAREER', title: '経歴', more: '詳しく見る', now: 'NOW' },
    output: { eyebrow: 'OUTPUT', title: '書いたもの', more: (n) => `すべて見る（${n}）`, read: '読む' },
    contact: { eyebrow: 'CONTACT', title: "Let's build something.", body: 'お仕事の相談も、技術の話も、気軽にどうぞ。' },
    footer: '© 2026 水野航太',
    pages: {
      back: 'トップへ',
      projects: { title: '作ったもの', blurb: '個人で作ったアプリ、ハッカソンの作品、研究のツール。' },
      output: { title: '書いたもの', blurb: '学習ノート、技術記事、インタビュー、登壇。' },
      career: { title: '経歴', blurb: 'インターンから今の仕事まで。大学院は芝浦工業大学で、量子アルゴリズムと格子暗号を研究（修士・工学）。' },
    },
  },
  en: {
    nav: { projects: 'Works', career: 'Career', output: 'Output', contact: 'Contact', menu: 'Menu' },
    hero: {
      eyebrow: 'SOFTWARE ENGINEER · TOKYO',
      headline: 'I build search, and UI you can understand by touching it.',
      sub: 'I like digging into the internals of OpenSearch as much as showing math and 3D in motion.',
      work: 'See my work',
      sceneLabel: 'A skeleton clock built from Technic parts: a pendulum steps the escape wheel one tooth at a time, six gear stages slow it down, and the hands show the current time',
      sceneHint: 'Drag to rotate',
      nameHint: 'Scroll to run the machine',
    },
    facts: [
      { label: 'CURRENTLY', title: 'Studist Corporation', sub: 'Software Engineer · since Apr 2026' },
      { label: 'INTERESTS', title: 'Search · UI/UX · 3D', sub: 'OpenSearch / Vector Search / Three.js' },
    ],
    projects: {
      eyebrow: 'WORKS',
      title: 'Selected work',
      blurb: (n) => `${n} projects: the problem, the approach, and what came of it.`,
      more: (n) => `See ${n} more`,
      problem: 'Problem',
      approach: 'Approach',
      result: 'Result',
    },
    career: { eyebrow: 'CAREER', title: 'Career', more: 'See details', now: 'NOW' },
    output: { eyebrow: 'OUTPUT', title: 'Writing', more: (n) => `See all (${n})`, read: 'Read' },
    contact: { eyebrow: 'CONTACT', title: "Let's build something.", body: 'Work, collaborations or just a chat about tech — feel free to reach out.' },
    footer: '© 2026 Kota Mizuno',
    pages: {
      back: 'Home',
      projects: { title: 'Work', blurb: 'Personal apps, hackathon builds and research tools.' },
      output: { title: 'Writing', blurb: 'Study notes, articles, interviews and talks.' },
      career: { title: 'Career', blurb: 'From internships to my current role. I did my M.Eng. at Shibaura Institute of Technology, on quantum algorithms and lattice cryptography.' },
    },
  },
}

/** トップで厚く見せる代表作。slug は data/projects.ts と同じ。まだ分からないところは ［ ］ のまま */
export type Featured = {
  slug: string
  problem: Record<Lang, string>
  approach: Record<Lang, string>
  result: Record<Lang, string>
}

export const featured: Featured[] = [
  {
    slug: 'yagura',
    problem: {
      ja: 'エージェントを何体も走らせると、どれが承認待ちで、どれが終わったのかを見失う。',
      en: 'Run several agents at once and you lose track of which one is waiting for you and which has finished.',
    },
    approach: {
      ja: 'エージェント・ターミナル・プレビュー・差分をペインで並べ、サイドバーに全員の今の作業と承認待ちを出す。',
      en: 'Agents, terminals, a live preview and the diff sit side by side in panes, and one sidebar shows what every agent is doing and who needs approval.',
    },
    result: {
      ja: 'Electron のデスクトップ版と Rust のターミナル版。同じエージェントの橋渡し部分で動く。',
      en: 'An Electron desktop app and a Rust terminal version, both running on the same agent bridge.',
    },
  },
  {
    slug: 'fude',
    problem: {
      ja: 'ノートを書きながら AI に聞くと、別のアプリへ文章をコピーして行き来することになる。',
      en: 'Asking an AI about your notes means copying text into another app and switching back and forth.',
    },
    approach: {
      ja: 'ノート上で選んだ文章を AI パネルに送ると、Gemini の回答が入力を止めずにストリーミングで届く。',
      en: 'Select text in a note and send it to the AI panel; Gemini streams its answer back without blocking your typing.',
    },
    result: {
      ja: 'Next.js を Electron に詰め、electron-builder で macOS アプリとして配布。',
      en: 'Next.js packaged inside Electron and shipped as a macOS app with electron-builder.',
    },
  },
  {
    slug: 'nanjenerator',
    problem: { ja: '［ハッカソンのテーマ、何を作ろうとしたか］', en: '[The hackathon theme and what we set out to build]' },
    approach: {
      ja: 'Amazon Bedrock で、2ch 特有の文体とテンポを再現するまでプロンプトを詰めた。',
      en: 'Tuned prompts on Amazon Bedrock until they reproduced the distinctive tone and rhythm of 2ch threads.',
    },
    result: { ja: 'Progate Hackathon powered by AWS で最優秀賞。', en: 'Best Prize at Progate Hackathon powered by AWS.' },
  },
  {
    slug: 'pachi',
    problem: { ja: 'タイマーアプリは数字ばかりで、作業中についスマホを触ってしまう。', en: 'Timer apps are all numbers, and you end up picking up your phone anyway.' },
    approach: {
      ja: '数字は隅に追いやり、目だけで気持ちを伝える。まばたき・視線・しぐさを動かす小さなエンジンを作った。',
      en: 'Numbers stay in a corner; two eyes carry the mood, driven by a small engine for blinking, gaze and gestures.',
    },
    result: { ja: '［自分で毎日使っている、など］', en: '[e.g. I use it every day]' },
  },
  {
    slug: 'quantum-pizza',
    problem: { ja: '量子ゲートの働きは抽象的で、初めての人には伝わりにくい。', en: 'Quantum gates are abstract and hard to grasp the first time.' },
    approach: { ja: 'ピザ作りの手順に置き換えて、ゲームとして体験させる。', en: 'Turn them into the steps of making a pizza and let people play it.' },
    result: { ja: '［展示や授業で使われたか］', en: '[Where it was shown or used]' },
  },
]
