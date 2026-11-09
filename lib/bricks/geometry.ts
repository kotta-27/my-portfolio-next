import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

/*
 * レゴの部品の形と材質。Clutch（3D のレゴ組み立てアプリ）の engine/geometry.ts と parts.ts から、ヒーローに要る分だけを移したもの。
 * 寸法は実物と同じ mm: 1 スタッドの間隔 8、プレート 1 枚の高さ 3.2、ブロックはプレート 3 枚分。
 */
export const PITCH = 8
export const PLATE = 3.2
const GAP = 0.1 // 部品の左右の余白。隣どうしの継ぎ目が見える
const STUD_R = 2.4
const STUD_H = 1.7

export type PartKind = 'brick' | 'plate' | 'tile'
export type Part = { w: number; d: number; h: number; kind: PartKind }

/** 部品の ID → 大きさ。w: x 方向のスタッド数 / d: z 方向 / h: プレート何枚分の高さ */
export const PARTS = {
  b1x1: { w: 1, d: 1, h: 3, kind: 'brick' },
  b1x2: { w: 2, d: 1, h: 3, kind: 'brick' },
  b1x4: { w: 4, d: 1, h: 3, kind: 'brick' },
  b2x2: { w: 2, d: 2, h: 3, kind: 'brick' },
  b2x3: { w: 3, d: 2, h: 3, kind: 'brick' },
  b2x4: { w: 4, d: 2, h: 3, kind: 'brick' },
  p1x2: { w: 2, d: 1, h: 1, kind: 'plate' },
  p2x4: { w: 4, d: 2, h: 1, kind: 'plate' },
  p6x6: { w: 6, d: 6, h: 1, kind: 'plate' },
} as const satisfies Record<string, Part>

export type PartId = keyof typeof PARTS

/** 90° 単位の回転後の足元の大きさ。rot が 1 / 3 なら縦横が入れ替わる */
export function footprint(part: Part, rot: number) {
  return rot % 2 === 0 ? { w: part.w, d: part.d } : { w: part.d, d: part.w }
}

// スタッドの断面。肩をわずかに丸めると、その縁のハイライトでプラスチックらしく見える
function studGeometry(segments: number) {
  const pts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(STUD_R, 0),
    new THREE.Vector2(STUD_R, STUD_H - 0.28),
    new THREE.Vector2(STUD_R - 0.08, STUD_H - 0.1),
    new THREE.Vector2(STUD_R - 0.28, STUD_H),
    new THREE.Vector2(0, STUD_H),
  ]
  return new THREE.LatheGeometry(pts, segments)
}

/** 裏側が空洞の箱（ヒーローでは裏は見えないので、壁と天板だけ） */
function shell(w: number, d: number, h: number) {
  const W = w * PITCH - GAP * 2
  const D = d * PITCH - GAP * 2
  const H = h * PLATE
  const g = new RoundedBoxGeometry(W, H, D, 3, 0.45)
  g.translate(0, H / 2, 0)
  return g
}

// mergeGeometries は属性の組がそろっている必要がある（index の有無も）
function normalise(g: THREE.BufferGeometry) {
  const n = g.index ? g.toNonIndexed() : g
  for (const name of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(name)) n.deleteAttribute(name)
  return n
}

const cache = new Map<PartId, THREE.BufferGeometry>()

/** 部品の形。足元の中心が原点、底面が y = 0 */
export function partGeometry(id: PartId) {
  const hit = cache.get(id)
  if (hit) return hit
  const p: Part = PARTS[id]
  const parts: THREE.BufferGeometry[] = [shell(p.w, p.d, p.h)]
  if (p.kind !== 'tile') {
    for (let i = 0; i < p.w; i++) {
      for (let j = 0; j < p.d; j++) {
        const s = studGeometry(28)
        s.translate((i + 0.5 - p.w / 2) * PITCH, p.h * PLATE, (j + 0.5 - p.d / 2) * PITCH)
        parts.push(s)
      }
    }
  }
  const merged = mergeGeometries(parts.map(normalise), false)
  if (!merged) throw new Error(`could not build ${id}`)
  merged.computeBoundingBox()
  cache.set(id, merged)
  return merged
}

// 粗さに細かいむらを入れて、成形した ABS のように反射を少し崩す
let grain: THREE.Texture | undefined
function grainTexture() {
  if (grain) return grain
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const v = 200 + Math.random() * 55
    img.data.set([v, v, v, 255], i * 4)
  }
  ctx.putImageData(img, 0, 0)
  grain = new THREE.CanvasTexture(c)
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping
  grain.repeat.set(0.08, 0.08)
  return grain
}

/** 樹脂の材質。色はあとから color.set で変えられる（テーマの切り替え用） */
export function createBrickMaterial(hex: string) {
  return new THREE.MeshPhysicalMaterial({
    color: hex,
    roughness: 0.26,
    roughnessMap: grainTexture(),
    clearcoat: 0.5,
    clearcoatRoughness: 0.12,
    sheen: 0.15,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(hex).lerp(new THREE.Color('#ffffff'), 0.5),
  })
}

/** 色を変える。艶（sheen）の色も合わせる */
export function setBrickColor(m: THREE.MeshPhysicalMaterial, hex: string) {
  m.color.set(hex)
  m.sheenColor.set(hex).lerp(new THREE.Color('#ffffff'), 0.5)
}
