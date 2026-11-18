/*
 * 図のための小さな HNSW。Malkov & Yashunin (2016) の手順どおりに、層の割り当て・挿入・探索を行う。
 * 近傍の選び方だけは論文の「単純な選択」（近い順に M 個）を使う。図に出す経路や数字はすべてこの実装で実際に計算したもの。
 */

export type Vec = number[]

/** 再現できる乱数（mulberry32） */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomPoints(n: number, dim: number, seed: number, margin = 0): Vec[] {
  const r = rng(seed)
  return Array.from({ length: n }, () => Array.from({ length: dim }, () => margin + r() * (1 - margin * 2)))
}

export function dist(a: Vec, b: Vec) {
  let s = 0
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i]
    s += d * d
  }
  return s
}

export type Graph = {
  points: Vec[]
  /** 各点が載っている一番上の層 */
  levels: number[]
  /** layers[l][node] = 層 l での隣接点（その層にいない点は空） */
  layers: number[][][]
  entry: number
  maxLevel: number
  M: number
}

/** 探索の 1 手。どの点を広げ、どの隣を測ったか */
export type Expand = { node: number; checked: number[]; nearest: number }

export type LayerTrace = { layer: number; expands: Expand[]; result: number[] }

type Counter = { n: number }

/**
 * 層 l の上で、q に近い点を ef 個まで探す（論文の SEARCH-LAYER）。ef = 1 なら貪欲探索になる。
 * 戻り値は近い順。
 */
export function searchLayer(g: Graph, q: Vec, entries: number[], ef: number, layer: number, counter: Counter, trace?: Expand[]) {
  const d = (i: number) => dist(q, g.points[i])
  const visited = new Set(entries)
  counter.n += entries.length
  let candidates = [...entries].sort((a, b) => d(a) - d(b))
  let found = [...candidates]

  while (candidates.length > 0) {
    const c = candidates.shift() as number
    const furthest = found[found.length - 1]
    if (d(c) > d(furthest)) break
    const checked: number[] = []
    for (const e of g.layers[layer][c]) {
      if (visited.has(e)) continue
      visited.add(e)
      counter.n++
      checked.push(e)
      const f = found[found.length - 1]
      if (found.length < ef || d(e) < d(f)) {
        candidates = [...candidates, e].sort((a, b) => d(a) - d(b))
        found = [...found, e].sort((a, b) => d(a) - d(b))
        if (found.length > ef) found.pop()
      }
    }
    trace?.push({ node: c, checked, nearest: found[0] })
  }
  return found
}

export type InsertTrace = {
  node: number
  level: number
  /** 上の層を貪欲に降りてきた道筋 */
  descent: LayerTrace[]
  /** 自分が載る各層で、候補と実際につないだ相手 */
  links: { layer: number; candidates: number[]; chosen: number[]; pruned: { node: number; dropped: number }[] }[]
}

export type BuildOptions = {
  M: number
  efConstruction: number
  seed: number
  /** 図のために、最後に入れる点の層を指定する（それ以外の点は乱数で決まる） */
  lastLevel?: number
}

export function build(points: Vec[], { M, efConstruction, seed, lastLevel }: BuildOptions, traceLast = false) {
  const r = rng(seed)
  const mL = 1 / Math.log(M)
  const g: Graph = { points, levels: [], layers: [], entry: 0, maxLevel: -1, M }
  let lastTrace: InsertTrace | null = null

  points.forEach((q, i) => {
    // 層は「指数的に減る」確率で決める: floor(-ln(U) * mL)
    const drawn = Math.floor(-Math.log(1 - r()) * mL)
    const level = lastLevel !== undefined && i === points.length - 1 ? lastLevel : drawn
    g.levels[i] = level
    while (g.layers.length <= level) g.layers.push(points.map(() => []))

    if (g.maxLevel < 0) {
      g.entry = i
      g.maxLevel = level
      return
    }

    const counter = { n: 0 }
    const trace: InsertTrace | null = traceLast && i === points.length - 1 ? { node: i, level, descent: [], links: [] } : null
    let ep = [g.entry]
    for (let l = g.maxLevel; l > level; l--) {
      const expands: Expand[] = []
      const res = searchLayer(g, q, ep, 1, l, counter, expands)
      trace?.descent.push({ layer: l, expands, result: res })
      ep = [res[0]]
    }
    for (let l = Math.min(g.maxLevel, level); l >= 0; l--) {
      const W = searchLayer(g, q, ep, efConstruction, l, counter)
      const chosen = W.slice(0, M)
      const maxConn = l === 0 ? M * 2 : M
      const pruned: { node: number; dropped: number }[] = []
      g.layers[l][i] = [...chosen]
      for (const n of chosen) {
        const list = [...g.layers[l][n], i]
        if (list.length > maxConn) {
          // つながりすぎた相手は、遠い順に切って上限に収める
          list.sort((a, b) => dist(points[n], points[a]) - dist(points[n], points[b]))
          const dropped = list.pop() as number
          pruned.push({ node: n, dropped })
        }
        g.layers[l][n] = list
      }
      trace?.links.push({ layer: l, candidates: W, chosen, pruned })
      ep = W
    }
    if (level > g.maxLevel) {
      g.entry = i
      g.maxLevel = level
    }
    if (trace) lastTrace = trace
  })

  return { graph: g, insertTrace: lastTrace as InsertTrace | null }
}

/** 上の層から順に降りて、最下層で ef 個の候補から近い k 個を返す */
export function search(g: Graph, q: Vec, k: number, ef: number) {
  const counter = { n: 0 }
  const layers: LayerTrace[] = []
  let ep = [g.entry]
  for (let l = g.maxLevel; l > 0; l--) {
    const expands: Expand[] = []
    const res = searchLayer(g, q, ep, 1, l, counter, expands)
    layers.push({ layer: l, expands, result: res })
    ep = [res[0]]
  }
  const expands: Expand[] = []
  const res = searchLayer(g, q, ep, Math.max(ef, k), 0, counter, expands)
  layers.push({ layer: 0, expands, result: res })
  return { result: res.slice(0, k), layers, distanceCount: counter.n }
}

/** 総当たりの正解 */
export function bruteForce(points: Vec[], q: Vec, k: number) {
  return points
    .map((p, i) => [i, dist(q, p)] as const)
    .sort((a, b) => a[1] - b[1])
    .slice(0, k)
    .map(([i]) => i)
}
