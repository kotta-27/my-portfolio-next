import type { Lang } from '@/types'

/** 好きな技術。icon は components/tiles/FavoriteTechTile.tsx の ICONS のキー */
export type FavoriteTech = {
  icon: 'vue' | 'three' | 'search'
  /** 製品名は言語で変えない。分野名だけ言語ごとに書く */
  name: string | Record<Lang, string>
  note: Record<Lang, string>
  tags: string[]
}

export const favoriteTech: FavoriteTech[] = [
  {
    icon: 'vue',
    name: 'Vue.js',
    note: {
      en: 'Single-file components and reactivity that stay out of the way.',
      ja: '単一ファイルコンポーネントと素直なリアクティビティが好き。',
    },
    tags: ['Vue 3', 'Nuxt'],
  },
  {
    icon: 'three',
    name: 'Three.js',
    note: {
      en: '3D scenes and interactive visuals right in the browser.',
      ja: 'ブラウザだけで 3D と動きのある表現が作れる。',
    },
    tags: ['WebGL', '3D'],
  },
  {
    icon: 'search',
    name: { en: 'Search Engineering', ja: '検索技術' },
    note: {
      en: 'Ranking, analyzers and vector search — how the right result comes first.',
      ja: 'ランキング、形態素解析、ベクトル検索。欲しい結果が上に来る仕組み。',
    },
    tags: ['OpenSearch', 'Vector Search'],
  },
]
