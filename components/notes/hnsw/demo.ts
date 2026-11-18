import { build, bruteForce, randomPoints, search, searchLayer, type Expand, type Vec } from '@/components/notes/hnsw/hnsw'

/*
 * 図で使う共通のデータ。2 次元に 140 点、M = 4、efConstruction = 24 で作ったグラフ。
 * 乱数の種を固定しているので、サーバーとブラウザで同じグラフになる。
 */

export const DEMO_M = 4
export const DEMO_EFC = 24
export const POINTS: Vec[] = randomPoints(140, 2, 6, 0.05)
export const GRAPH = build(POINTS, { M: DEMO_M, efConstruction: DEMO_EFC, seed: 106 }).graph

/** 探す点。左端の低いところ。入口の点から遠い */
export const QUERY: Vec = [0.08, 0.252]
export const TRUTH = bruteForce(POINTS, QUERY, 1)[0]

/** HNSW（ef = 1）の探索 */
export const HNSW_RUN = search(GRAPH, QUERY, 1, 1)

/** 層を使わず、最下層だけを入口から貪欲にたどった場合 */
const greedyExpands: Expand[] = []
const greedyCounter = { n: 0 }
const greedyResult = searchLayer(GRAPH, QUERY, [GRAPH.entry], 1, 0, greedyCounter, greedyExpands)
export const GREEDY_RUN = { expands: greedyExpands, result: greedyResult[0], distanceCount: greedyCounter.n }

/** 層 l に載っている点 */
export const inLayer = (l: number) => GRAPH.levels.flatMap((lv, i) => (lv >= l ? [i] : []))

/** 層 l の辺（重複なし） */
export function layerEdges(l: number): [number, number][] {
  const out: [number, number][] = []
  GRAPH.layers[l].forEach((ns, a) => ns.forEach((b) => a < b && out.push([a, b])))
  // 片方向だけのつながり（上限で切られた側）も線としては 1 本で描く
  GRAPH.layers[l].forEach((ns, a) => ns.forEach((b) => a > b && !GRAPH.layers[l][b].includes(a) && out.push([b, a])))
  return out
}

/** 挿入の図: 同じ 140 点に 1 点足し、層 1 に載ったとして入れる */
export const NEW_POINT: Vec = [0.5, 0.46]
export const INSERT = build([...POINTS, NEW_POINT], { M: DEMO_M, efConstruction: DEMO_EFC, seed: 106, lastLevel: 1 }, true)
