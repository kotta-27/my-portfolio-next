import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

/*
 * テクニック部品の形（歯車・脱進機の車・リフトアーム・軸・ピン・ブッシュ）。寸法は mm で、ブロックの形（geometry.ts）とそろえる。
 * 歯車は歯数 t のときピッチ半径 t/2 mm（モジュール 1）。厚み方向は z。
 */

const TAU = Math.PI * 2

function extrude(shape: THREE.Shape, depth: number, bevel = 0.3, curveSegments = 10) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.85,
    bevelSegments: 2,
    curveSegments,
  })
  geo.translate(0, 0, -depth / 2)
  return geo
}

/** 平歯車（穴は丸い軸穴だけ）。歯の中心は角度 0.31 × ピッチ */
export function gearGeometry(t: number) {
  const rp = t / 2, ra = rp + 0.95, rr = rp - 1.2, p = TAU / t
  const s = new THREE.Shape()
  for (let i = 0; i < t; i++) {
    const a = i * p
    const pts: [number, number][] = [[rr, a], [ra, a + p * 0.2], [ra, a + p * 0.42], [rr, a + p * 0.62]]
    pts.forEach(([r, ang], j) => {
      if (i === 0 && j === 0) s.moveTo(r * Math.cos(ang), r * Math.sin(ang))
      else s.lineTo(r * Math.cos(ang), r * Math.sin(ang))
    })
  }
  s.closePath()
  const h = new THREE.Path()
  h.absarc(0, 0, 2.4, 0, TAU, true)
  s.holes.push(h)
  return extrude(s, 3.4)
}

/** 歯車の歯の中心がある角度（形の中での位置） */
export const toothCenter = (t: number) => 0.31 * (TAU / t)

/** かみ合う 2 枚の初期の回転。a の中心から b の中心への向きが alpha のとき、a の歯と b のすき間を向かい合わせる */
export function meshPhase(ta: number, tb: number, alpha: number): [number, number] {
  return [alpha - toothCenter(ta), alpha + Math.PI - toothCenter(tb) - TAU / tb / 2]
}

/** 脱進機の車（のこぎり歯）。肉抜きの穴 4 つ */
export function escapeWheelGeometry(t: number) {
  const p = TAU / t
  const s = new THREE.Shape()
  for (let i = 0; i < t; i++) {
    const a = i * p
    const pts: [number, number][] = [[9.2, a], [12.6, a + p * 0.12], [11.8, a + p * 0.24], [9.2, a + p * 0.95]]
    pts.forEach(([r, ang], j) => {
      if (i === 0 && j === 0) s.moveTo(r * Math.cos(ang), r * Math.sin(ang))
      else s.lineTo(r * Math.cos(ang), r * Math.sin(ang))
    })
  }
  s.closePath()
  for (let i = 0; i < 4; i++) {
    const h = new THREE.Path()
    const a = (i * TAU) / 4
    h.absarc(5.4 * Math.cos(a), 5.4 * Math.sin(a), 2, 0, TAU, true)
    s.holes.push(h)
  }
  const c = new THREE.Path()
  c.absarc(0, 0, 1.6, 0, TAU, true)
  s.holes.push(c)
  return extrude(s, 2.4, 0.2)
}

/** リフトアーム（両端が丸い板に、8mm 間隔の穴）。1 つ目の穴が原点で、+x へ n 穴 */
export function liftarmGeometry(n: number) {
  const r = 3.6, len = (n - 1) * 8
  const s = new THREE.Shape()
  s.absarc(0, 0, r, Math.PI / 2, (Math.PI * 3) / 2, false)
  s.absarc(len, 0, r, (Math.PI * 3) / 2, Math.PI / 2, false)
  for (let i = 0; i < n; i++) {
    const h = new THREE.Path()
    h.absarc(i * 8, 0, 2.4, 0, TAU, true)
    s.holes.push(h)
  }
  return extrude(s, 3.4, 0.25, 14)
}

/** 十字の軸。z 方向に長さ len、中心が原点 */
export function axleGeometry(len: number) {
  const g = mergeGeometries([new THREE.BoxGeometry(4.6, 1.7, len), new THREE.BoxGeometry(1.7, 4.6, len)], false)
  if (!g) throw new Error('axle')
  return g
}

/** z 向きの円柱（ピン・ブッシュ・おもりなど） */
export function cylinderZ(r: number, len: number, segments = 18) {
  const g = new THREE.CylinderGeometry(r, r, len, segments)
  g.rotateX(Math.PI / 2)
  return g
}

export function roundedBox(w: number, h: number, d: number, radius: number) {
  return new RoundedBoxGeometry(w, h, d, 3, radius)
}

/** テクニックのピン（摩擦あり）。z 方向に長さ len、真ん中につば（2 つの部品の境目に来る） */
export function pinGeometry(len = 8.6) {
  const h = len / 2
  const profile: [number, number][] = [
    [0, -h], [2.0, -h], [2.35, -h + 0.5], [2.35, -0.55], [3.05, -0.55], [3.05, 0.55], [2.35, 0.55], [2.35, h - 0.5], [2.0, h], [0, h],
  ]
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 20)
  g.rotateX(Math.PI / 2)
  return g
}
