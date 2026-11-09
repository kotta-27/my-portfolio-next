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
  }
  facts: Fact[]
  projects: { eyebrow: string; title: string; blurb: string; more: (n: number) => string; problem: string; approach: string; result: string }
  career: { eyebrow: string; title: string; more: string; now: string }
  output: { eyebrow: string; title: string; more: (n: number) => string; read: string }
  contact: { eyebrow: string; title: string; body: string }
  footer: string
  /** 一覧ページ（/projects・/output・/career） */
  pages: { back: string; projects: { title: string; blurb: string }; output: { title: string; blurb: string }; career: { title: string; blurb: string } }
}

export const home: Record<Lang, HomeStrings> = {
  ja: {
    nav: { projects: 'Projects', career: 'Career', output: 'Output', contact: 'Contact', menu: 'メニュー' },
    hero: {
      eyebrow: 'SOFTWARE ENGINEER · TOKYO',
      headline: '検索と、触ってわかる UI をつくるエンジニア。',
      sub: 'OpenSearch の中身まで追いかけるのも、数式や 3D を動かして見せるのも好きです。',
      work: '作ったものを見る',
      sceneLabel: '灰色のプレートの上に、緑・オレンジ・白・紺・黄のブロックで組んだ小さな作品',
      sceneHint: 'ドラッグで回す',
    },
    facts: [
      { label: 'CURRENTLY', title: '株式会社スタディスト', sub: 'ソフトウェアエンジニア · 2026年4月〜' },
      { label: 'EDUCATION', title: '芝浦工業大学大学院', sub: '修士（工学）· 量子アルゴリズム・格子暗号' },
      { label: 'INTERESTS', title: '検索技術 · UI/UX · 3D', sub: 'OpenSearch / Vector Search / Three.js' },
    ],
    projects: {
      eyebrow: 'PROJECTS',
      title: '作ったもの',
      blurb: '代表作 4 件。何の問題を、どう工夫して、どうなったか。',
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
      career: { title: '経歴', blurb: 'インターンから今の仕事まで。' },
    },
  },
  en: {
    nav: { projects: 'Projects', career: 'Career', output: 'Output', contact: 'Contact', menu: 'Menu' },
    hero: {
      eyebrow: 'SOFTWARE ENGINEER · TOKYO',
      headline: 'I build search, and UI you can understand by touching it.',
      sub: 'I like digging into the internals of OpenSearch as much as showing math and 3D in motion.',
      work: 'See my work',
      sceneLabel: 'A small build of teal, orange, white, navy and yellow bricks on a gray baseplate',
      sceneHint: 'Drag to rotate',
    },
    facts: [
      { label: 'CURRENTLY', title: 'Studist Corporation', sub: 'Software Engineer · since Apr 2026' },
      { label: 'EDUCATION', title: 'Shibaura Institute of Technology', sub: 'M.Eng. · quantum algorithms, lattice cryptography' },
      { label: 'INTERESTS', title: 'Search · UI/UX · 3D', sub: 'OpenSearch / Vector Search / Three.js' },
    ],
    projects: {
      eyebrow: 'PROJECTS',
      title: 'Selected work',
      blurb: 'Four projects: the problem, the approach, and what came of it.',
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
      career: { title: 'Career', blurb: 'From internships to my current role.' },
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
    slug: 'mathscope',
    problem: { ja: '式とグラフの関係は、紙の上では動かして確かめられない。', en: 'On paper you cannot move a formula and watch its graph change.' },
    approach: {
      ja: 'x² や sin 2x のように書いても解析できる正規化の層をテスト付きで作り、展開は 1 手ずつ色で示す。',
      en: 'A tested normalization layer accepts input written the way you would on paper, and expansions play one colored step at a time.',
    },
    result: { ja: '定理 77 個、動かせる図 41 個。', en: '77 theorems, 41 of them with interactive figures.' },
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
