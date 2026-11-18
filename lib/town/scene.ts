import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { createBrickMaterial } from '@/lib/bricks/geometry'
import { gearGeometry } from '@/lib/bricks/technic'
import type { Section } from '@/lib/town/sections'
import { Sfx } from '@/lib/town/sfx'
import { propStore } from '@/lib/town/store'

/*
 * トップの「レゴの街」。プロムナード沿いに建物が 5 つ並び、それぞれがサイトのセクション。
 * 人形が歩いて建物の前に着くと onArrive が呼ばれ、画面の側（components/town/TownView.tsx）がその中身を開く。
 * 寸法は mm（1 スタッド 8mm、ブロック 1 段 9.6mm）。人形は高さ約 40mm で、オリジナルの形。
 * 手前の歩道のベンチは、長押しで持ち上げて、スタッドに合わせて置き直せる（Clutch と同じ手触り。置ける範囲は道の手前の歩道だけ）。
 * three は大きいので、このファイルは TownView が動的に読み込む。
 */

const P = 8
const PLATE = 3.2
const BR = PLATE * 3

const COL = {
  plate: '#C9D0D8',
  path: '#EEF0F2',
  white: '#F4F4F2',
  light: '#DCE1E6',
  gray: '#A0A5A9',
  dark: '#5B6064',
  navy: '#1B2B3D',
  teal: '#0C7A7C',
  coral: '#C84A2C',
  mustard: '#F4B01C',
  leaf: '#3F7F68',
  trunk: '#6B4A35',
  skin: '#F0D2A8',
  black: '#26292C',
}
type Col = keyof typeof COL

export type TownInput = {
  /** 建物の看板。看板には title（英字）だけを書く。sub は WebGL が使えないときのリンクの文字に使う */
  labels: Record<Section, { title: string; sub: string }>
  /** 工房の窓に飾る作品の画像（3 枚） */
  workImages: string[]
  /** 4 階建ての各階のロゴ。下の階（古い会社）から順に */
  careerLogos: string[]
  /** 手前の歩道に立てる、外へのリンクの看板。icon は SVG のマークアップ（色は fg で塗る） */
  links: { href: string; label: string; icon: string; bg: string; fg: string }[]
  onLink: (href: string) => void
  /** パネルを開いているあいだ、今いる建物と人形のほかを、背景の色へ褪せさせる（後ろの街がうるさくならないように） */
  focusDim?: boolean
  reducedMotion: boolean
  onArrive: (id: Section) => void
  /** 人形が歩き出した（パネルを閉じる合図）。toStreet は、どの建物にも向かわず通りに出たとき（← → ↓ キー） */
  onLeave: (toStreet: boolean) => void
  onReady: () => void
}

export type TownBench = {
  goTo: (id: Section) => void
  /** パネルが開いているか（と、その幅 px）。開いているあいだは、人形がパネルに隠れないよう絵をずらす */
  setPanelOpen: (open: boolean, width?: number) => void
  dispose: () => void
}

export function mountTown(host: HTMLElement, input: TownInput): TownBench {
  const disposers: (() => void)[] = []
  let needsRender = true

  // ───────── 部品 ─────────
  const mats = new Map<string, THREE.MeshPhysicalMaterial>()
  const mat = (c: Col) => {
    let m = mats.get(c)
    if (!m) {
      m = createBrickMaterial(COL[c])
      mats.set(c, m)
    }
    return m
  }
  const glass = new THREE.MeshPhysicalMaterial({ color: '#2A4560', roughness: 0.08, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 })

  const normalise = (g: THREE.BufferGeometry) => {
    const n = g.index ? g.toNonIndexed() : g
    for (const name of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(name)) n.deleteAttribute(name)
    return n
  }
  const studProfile = [[0, 0], [2.4, 0], [2.4, 1.42], [2.32, 1.6], [2.12, 1.7], [0, 1.7]].map(([a, b]) => new THREE.Vector2(a, b))
  const geoCache = new Map<string, THREE.BufferGeometry>()
  /** w × d スタッド、高さ h プレート分のブロック。足元の中心が原点 */
  const blockGeo = (w: number, d: number, h: number, studs = true) => {
    const key = `${w}|${d}|${h}|${studs}`
    const hit = geoCache.get(key)
    if (hit) return hit
    const H = h * PLATE
    const body = new RoundedBoxGeometry(w * P - 0.2, H, d * P - 0.2, 2, 0.35)
    body.translate(0, H / 2, 0)
    const parts: THREE.BufferGeometry[] = [normalise(body)]
    if (studs) {
      for (let i = 0; i < w; i++)
        for (let j = 0; j < d; j++) {
          const s = new THREE.LatheGeometry(studProfile, 14)
          s.translate((i + 0.5 - w / 2) * P, H, (j + 0.5 - d / 2) * P)
          parts.push(normalise(s))
        }
    }
    const g = mergeGeometries(parts, false)
    if (!g) throw new Error('block geometry')
    geoCache.set(key, g)
    return g
  }
  const put = (parent: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geo, m)
    mesh.position.set(x, y, z)
    mesh.castShadow = mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  /** ブロックを n 段積む（一番上だけスタッド付き）。x, z は足元の中心。積んだ上面の高さを返す */
  const stack = (parent: THREE.Object3D, w: number, d: number, n: number, c: Col | THREE.Material, x: number, z: number, y0 = 0, studsOnTop = true) => {
    const m = typeof c === 'string' ? mat(c) : c
    for (let i = 0; i < n; i++) put(parent, blockGeo(w, d, 3, studsOnTop && i === n - 1), m, x, y0 + i * BR, z)
    return y0 + n * BR
  }
  const box = (w: number, h: number, d: number, r = 0.4) => {
    const g = new RoundedBoxGeometry(w, h, d, 2, r)
    g.translate(0, h / 2, 0)
    return g
  }
  const fontFamily = getComputedStyle(document.body).fontFamily

  /** 文字の看板。キャンバスに書いて、前の面にだけ貼る */
  const sign = (text: string, sub: string, w: number, h: number, bg: string, fg: string) => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = Math.round((512 * h) / w)
    const ctx = c.getContext('2d')
    if (!ctx) throw new Error('2d context unavailable')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.fillStyle = fg
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `800 ${sub ? c.height * 0.46 : c.height * 0.58}px ${fontFamily}`
    ctx.fillText(text, c.width / 2, sub ? c.height * 0.4 : c.height * 0.52)
    if (sub) {
      ctx.globalAlpha = 0.7
      ctx.font = `700 ${c.height * 0.2}px ${fontFamily}`
      ctx.fillText(sub, c.width / 2, c.height * 0.78)
    }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 })
    const side = new THREE.MeshStandardMaterial({ color: bg, roughness: 0.5 })
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1.6), [side, side, side, side, face, side])
    m.castShadow = true
    return m
  }

  /** 画像を貼った板（工房の窓の作品、会社のロゴ）。cover は枠いっぱいに切り抜き、contain は白い地に収める */
  const picture = (src: string, w: number, h: number, fit: 'cover' | 'contain') => {
    const g = new THREE.Group()
    put(g, box(w + 2.4, h + 2.4, 1.6, 0.5), mat('white'), 0, -1.2, 0)
    const c = document.createElement('canvas')
    c.width = fit === 'cover' ? 512 : 256
    c.height = Math.round((c.width * h) / w)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    const img = new Image()
    img.onload = () => {
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, c.width, c.height)
      // SVG は大きさを持たないことがあるので、0 のときは正方形とみなす
      const iw = img.naturalWidth || 256
      const ih = img.naturalHeight || 256
      if (fit === 'cover') {
        const s = Math.max(c.width / iw, c.height / ih)
        ctx.drawImage(img, (c.width - iw * s) / 2, 0, iw * s, ih * s)
      } else {
        const s = Math.min((c.width * 0.8) / iw, (c.height * 0.8) / ih)
        ctx.drawImage(img, (c.width - iw * s) / 2, (c.height - ih * s) / 2, iw * s, ih * s)
      }
      tex.needsUpdate = true
      needsRender = true
      loop()
    }
    img.src = src
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
    face.position.set(0, h / 2, 0.85)
    g.add(face)
    return g
  }

  // ───────── 舞台 ─────────
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.classList.add('absolute', 'inset-0', 'block', 'h-full', 'w-full', 'cursor-grab', 'touch-none')
  host.prepend(renderer.domElement)
  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.6
  const key = new THREE.DirectionalLight('#fff3e2', 2.3)
  key.position.set(-160, 320, 220)
  key.castShadow = true
  key.shadow.mapSize.set(4096, 4096)
  Object.assign(key.shadow.camera, { left: -300, right: 300, top: 220, bottom: -220, near: 10, far: 1200 })
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.04
  scene.add(key, new THREE.HemisphereLight('#ffffff', '#8a7a68', 0.5))

  const town = new THREE.Group()
  scene.add(town)

  // ベースプレート 60 × 34。真ん中を東西に、スタッドのないタイルのプロムナードが通る
  const PW = 60
  const PD = 34
  {
    put(town, box(PW * P - 0.2, PLATE, PD * P - 0.2, 0.6), mat('plate'), 0, -PLATE, 0)
    const m4 = new THREE.Matrix4()
    const studs = new THREE.InstancedMesh(new THREE.LatheGeometry(studProfile, 12), mat('plate'), PW * PD)
    let k = 0
    for (let i = 0; i < PW; i++)
      for (let j = 0; j < PD; j++) {
        const z = (j + 0.5 - PD / 2) * P
        if (Math.abs(z) < 24) continue // タイルの下は見えない
        studs.setMatrixAt(k++, m4.makeTranslation((i + 0.5 - PW / 2) * P, 0, z))
      }
    studs.count = k
    studs.receiveShadow = true
    town.add(studs)
    const tileGeo = box(2 * P - 0.3, 1.2, 2 * P - 0.3, 0.3)
    const tile = new THREE.InstancedMesh(tileGeo, mat('path'), (PW / 2) * 3)
    const mid = new THREE.InstancedMesh(tileGeo, mat('light'), PW / 2)
    let a = 0
    let b = 0
    for (let i = 0; i < PW / 2; i++)
      for (let j = 0; j < 3; j++) {
        const x = (i * 2 + 1 - PW / 2) * P
        const z = (j - 1) * 2 * P
        if (j === 1 && i % 2 === 0) mid.setMatrixAt(b++, m4.makeTranslation(x, 0, z))
        else tile.setMatrixAt(a++, m4.makeTranslation(x, 0, z))
      }
    tile.count = a
    mid.count = b
    tile.receiveShadow = mid.receiveShadow = true
    town.add(tile, mid)
  }
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.14 })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000).rotateX(-Math.PI / 2), shadowMat)
  floor.position.y = -PLATE - 0.1
  floor.receiveShadow = true
  scene.add(floor)

  // ───────── 建物 ─────────
  type Building = { id: Section; group: THREE.Group; door: THREE.Vector3; x: number; pop: number }
  const buildings: Building[] = []
  // 動かした小物がぶつかってはいけないもの（建物・木・街灯・看板）
  const solids: THREE.Object3D[] = []
  const FRONT = -32 // 建物の正面の z（プロムナードの北の縁）
  const L = input.labels

  const building = (id: Section, x: number, make: (g: THREE.Group) => void) => {
    const group = new THREE.Group()
    group.position.set(x, 0, FRONT)
    group.userData.id = id
    make(group)
    town.add(group)
    solids.push(group)
    buildings.push({ id, group, door: new THREE.Vector3(x, 0, FRONT + 14), x, pop: 0 })
  }
  const windowPane = (g: THREE.Group, x: number, y: number, w: number, h: number, z = 0.6) => {
    put(g, box(w + 2, h + 2, 1.4, 0.4), mat('white'), x, y - 1, z)
    put(g, box(w, h, 1.6, 0.2), glass, x, y, z + 0.2)
  }

  // ABOUT: 小さな家
  building('about', -170, (g) => {
    const w = 7
    const d = 6
    const top = stack(g, w, d, 4, 'white', 0, (-d * P) / 2)
    for (let k = 0; k < 3; k++) put(g, blockGeo(w + 1, d - 2 * k, 3, k === 2), mat('navy'), 0, top + k * BR, (-d * P) / 2)
    stack(g, 1, 1, 2, 'dark', 16, -16, top + BR)
    put(g, box(13, 28, 1.6, 0.4), mat('coral'), -8, 0, 0.6)
    put(g, new THREE.SphereGeometry(1, 10, 8), mat('mustard'), -4, 14, 1.8)
    windowPane(g, 14, 15, 14, 13)
    const s = sign(L.about.title, '', 30, 10, COL.navy, '#ffffff')
    s.position.set(0, top - 6, 2)
    g.add(s)
  })

  // WORKS: 工房。正面の窓に作品が並び、横の壁で歯車が回る
  const gears: THREE.Mesh[] = []
  building('works', -78, (g) => {
    const w = 14
    const d = 8
    stack(g, w, d, 1, 'dark', 0, (-d * P) / 2, 0, false)
    const top = stack(g, w, d, 4, 'light', 0, (-d * P) / 2, BR)
    put(g, blockGeo(w + 2, d + 2, 1), mat('teal'), 0, top, (-d * P) / 2)
    put(g, box(w * P, 3.2, 10, 0.5), mat('teal'), 0, BR * 4.1, 4)
    input.workImages.slice(0, 3).forEach((src, i) => {
      const pic = picture(src, 30, 19, 'cover')
      pic.position.set((i - 1) * 36, BR * 1.6, 0.6)
      g.add(pic)
    })
    // 看板は屋根のスタッド（高さ 1.7）より上に浮かせ、後ろの 2 本の柱で支える
    const s = sign(L.works.title, '', 46, 14, COL.teal, '#ffffff')
    s.position.set(0, top + PLATE + 1.7 + 7 + 1.5, -6)
    s.rotation.x = -0.08
    g.add(s)
    put(g, box(4, 19, 4, 0.5), mat('dark'), -18, top + PLATE, -8.6)
    put(g, box(4, 19, 4, 0.5), mat('dark'), 18, top + PLATE, -8.6)
    for (const [gy, t, c] of [[BR * 3.2, 24, 'mustard'], [BR * 1.55, 8, 'coral']] as const) {
      const gear = put(g, gearGeometry(t), mat(c), (w * P) / 2 + 2, gy, -24)
      gear.rotation.order = 'YXZ'
      gear.rotation.y = Math.PI / 2
      gear.userData.t = t
      gears.push(gear)
    }
  })

  // CAREER: 階ごとに会社。下の階から古い会社、一番上が今の会社
  building('career', 22, (g) => {
    const w = 8
    const d = 7
    const tones: Col[] = ['mustard', 'coral', 'gray', 'teal', 'navy', 'white']
    let y = 0
    input.careerLogos.forEach((logo, i) => {
      put(g, blockGeo(w + 1, d + 1, 1, false), mat(tones[i % tones.length]), 0, y, (-d * P) / 2)
      y += PLATE
      y = stack(g, w, d, 3, 'white', 0, (-d * P) / 2, y, false)
      put(g, box(w * P - 22, BR * 1.4, 1.6, 0.2), glass, 10, y - BR * 2.3, 0.4)
      const pic = picture(logo, 14, 14, 'contain')
      pic.position.set(-21, y - BR * 2.5, 0.8)
      g.add(pic)
    })
    put(g, blockGeo(w + 1, d + 1, 1), mat('navy'), 0, y, (-d * P) / 2)
    stack(g, 2, 2, 1, 'dark', 12, -36, y + PLATE)
    put(g, new THREE.CylinderGeometry(0.6, 0.6, 26, 8), mat('black'), -14, y + PLATE + 13, -40)
    put(g, new THREE.SphereGeometry(1.6, 12, 10), mat('coral'), -14, y + PLATE + 26, -40)
    const s = sign(L.career.title, '', 40, 12, '#ffffff', COL.navy)
    s.position.set(0, y + PLATE + 8, -4)
    g.add(s)
  })

  // OUTPUT: 図書館。白い柱の列と、マスタードの壁。柱の奥に本の山
  building('output', 112, (g) => {
    const w = 13
    const d = 7
    put(g, blockGeo(w + 1, d + 1, 1, false), mat('navy'), 0, 0, (-d * P) / 2)
    put(g, blockGeo(w, 2, 1, false), mat('navy'), 0, PLATE, -P)
    stack(g, w, 4, 4, 'mustard', 0, -5 * P, PLATE * 2, false)
    for (let i = 0; i < 5; i++) stack(g, 1, 1, 4, 'white', (i * 3 - 6) * P, -P * 0.5, PLATE * 2, false)
    const top = PLATE * 2 + BR * 4
    put(g, blockGeo(w + 1, d, 1, false), mat('white'), 0, top, (-d * P) / 2 + 2)
    for (let k = 0; k < 3; k++) put(g, blockGeo(w - 1 - k * 4, 2, 3, k === 2), mat('teal'), 0, top + PLATE + k * BR, -P * 1.2)
    const books: Col[] = ['coral', 'navy', 'teal', 'white', 'coral', 'dark']
    books.forEach((c, i) => put(g, blockGeo(2, 1, 1, i === books.length - 1), mat(c), -20 + (i % 2) * 2, PLATE * 2 + i * PLATE, -20))
    books.slice(0, 4).forEach((c, i) => put(g, blockGeo(2, 1, 1, i === 3), mat(c), 22, PLATE * 2 + i * PLATE, -22))
    const s = sign(L.output.title, '', 40, 11, '#ffffff', COL.navy)
    s.position.set(0, top - 9, 1.2)
    g.add(s)
  })

  // CONTACT: 郵便局と、通りのポスト
  building('contact', 186, (g) => {
    const w = 6
    const d = 5
    // 人形（約 42mm）より背を高くして、着いたときに人形の頭が看板に重ならないようにする
    const top = stack(g, w, d, 5, 'coral', 0, (-d * P) / 2)
    put(g, blockGeo(w + 1, d + 1, 1), mat('white'), 0, top, (-d * P) / 2)
    put(g, box(12, 24, 1.6, 0.4), mat('white'), -8, 0, 0.6)
    windowPane(g, 12, 12, 10, 12)
    windowPane(g, 0, 32, 30, 8)
    // 看板は屋根の前の縁より手前に立てる（屋根のスタッドに隠れないように）
    const s = sign(L.contact.title, '', 40, 11, '#ffffff', COL.coral)
    s.position.set(0, top + PLATE + 7.5, 6)
    g.add(s)
    // ポストは通りの向かい側（南の歩道）に置く。プロムナードに置くと、人形が歩く道とぶつかる
    const post = stack(g, 2, 2, 3, 'coral', -16, 66, 0)
    put(g, box(10, 1.2, 1, 0.3), mat('navy'), -16, post - 7, 66 + P + 0.2)
  })

  // 公園（木・ベンチ・街灯）。背の低いものだけにして、建物を隠さない
  const tree = (x: number, z: number, s: number) => {
    const g = new THREE.Group()
    put(g, new THREE.CylinderGeometry(2.2, 2.6, 16 * s, 10), mat('trunk'), 0, 8 * s, 0)
    for (let k = 0; k < 3; k++) put(g, new THREE.CylinderGeometry((9 - k * 2.6) * s, (11 - k * 2.6) * s, 8 * s, 18), mat('leaf'), 0, (16 + k * 7) * s, 0)
    g.position.set(x, 0, z)
    town.add(g)
    solids.push(g)
  }
  const trees: [number, number, number][] = [[-210, 60, 1.1], [-150, 80, 0.9], [-110, 96, 1], [86, 98, 1.2], [150, 64, 0.95], [210, 86, 1.05], [-110, -100, 1.2], [70, -100, 1], [150, -96, 0.9], [-225, -90, 1]]
  for (const [x, z, s] of trees) tree(x, z, s)
  for (let x = -200; x <= 200; x += 80) {
    solids.push(put(town, new THREE.CylinderGeometry(0.9, 1.2, 44, 8), mat('black'), x, 22, 30))
    put(town, new THREE.CylinderGeometry(3, 2, 4, 12), mat('white'), x, 46, 30)
  }
  // ベンチ（動かせる）。4 × 1 スタッド。group の原点が足元の中心
  type Prop = { id: string; group: THREE.Group; w: number; d: number; h: number; place: { x: number; z: number; rot: number } }
  const props: Prop[] = []
  const bench = (id: string, x: number, z: number) => {
    const group = new THREE.Group()
    put(group, blockGeo(4, 1, 1), mat('dark'), 0, 4, 0)
    stack(group, 1, 1, 1, 'dark', -12, 0, 0, false)
    stack(group, 1, 1, 1, 'dark', 12, 0, 0, false)
    group.userData.prop = id
    town.add(group)
    const prop: Prop = { id, group, w: 4, d: 1, h: 4 + PLATE + 1.7, place: { x, z, rot: 0 } }
    props.push(prop)
    return prop
  }
  bench('bench-west', -120, 52)
  bench('bench-east', 112, 52)

  // ───────── 手前の歩道の看板（X・GitHub などへのリンク） ─────────
  // 2 × 4 の台に、4 × 4 の板を少し後ろへ倒して立てる。板の前の面にアイコンと名前を描く
  type Signpost = { group: THREE.Group; href: string; lift: number }
  const signposts: Signpost[] = []
  const drawSign = (link: TownInput['links'][number]) => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    if (!ctx) return tex
    const paint = (img?: HTMLImageElement) => {
      ctx.fillStyle = link.bg
      ctx.fillRect(0, 0, 256, 256)
      if (img) ctx.drawImage(img, 68, 34, 120, 120)
      ctx.fillStyle = link.fg
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `800 30px ${fontFamily}`
      ctx.fillText(link.label, 128, 200, 228)
      tex.needsUpdate = true
      needsRender = true
    }
    paint()
    const img = new Image()
    // 読み込みは組み立てのあと（描画のループができてから）に終わるので、ここで描き直しを頼める
    img.onload = () => {
      paint(img)
      loop()
    }
    // 画像として読むには xmlns が要る（DOM から取った SVG には付いていないことがある）
    let svg = link.icon.replace(/currentColor/g, link.fg).replace(/\s(width|height)="[^"]*"/g, '')
    svg = svg.replace('<svg', `<svg width="120" height="120"${svg.includes('xmlns=') ? '' : ' xmlns="http://www.w3.org/2000/svg"'}`)
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    return tex
  }
  input.links.forEach((link, i) => {
    const group = new THREE.Group()
    // ベースプレートのスタッドに合わせて置く。スタッドの中心は 8mm おきの 4mm 目なので、
    // 4 × 2 の台の中心は x・z とも 8 の倍数にする。間は 5 スタッド（40mm）
    group.position.set(-80 + i * 40, 0, 80)
    put(group, blockGeo(4, 2, 1), mat('dark'), 0, 0, 0)
    const board = new THREE.Group()
    board.position.set(0, PLATE, 0)
    board.rotation.x = -0.18
    group.add(board)
    put(board, box(4 * P - 0.4, 4 * P - 0.4, 3.2, 0.6), mat('white'), 0, 0, 0)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(4 * P - 3, 4 * P - 3), new THREE.MeshBasicMaterial({ map: drawSign(link), toneMapped: false }))
    face.position.set(0, (4 * P - 0.4) / 2, 1.65)
    board.add(face)
    group.userData.href = link.href
    town.add(group)
    solids.push(group)
    signposts.push({ group, href: link.href, lift: 0 })
  })

  // ───────── 人形 ─────────
  const fig = new THREE.Group()
  const legL = new THREE.Group()
  const legR = new THREE.Group()
  const armL = new THREE.Group()
  const armR = new THREE.Group()
  {
    for (const [leg, side] of [[legL, -1], [legR, 1]] as const) {
      leg.position.set(side * 3.8, 13, 0)
      put(leg, box(7.2, 12, 6.4, 0.8), mat('navy'), 0, -12, 0.3)
      put(leg, box(7.2, 2.4, 8.4, 0.6), mat('navy'), 0, -12, 1.1)
      fig.add(leg)
    }
    put(fig, box(15.4, 2.6, 6.6, 0.5), mat('navy'), 0, 12.4, 0)
    const torso = new THREE.CylinderGeometry(6.4 / Math.SQRT2, 8.2 / Math.SQRT2, 12.6, 4, 1)
    torso.rotateY(Math.PI / 4)
    torso.scale(1.55, 1, 0.9)
    torso.translate(0, 21.3, 0)
    put(fig, torso, mat('teal'))
    put(fig, box(4.2, 2, 0.6, 0.2), mat('white'), 0, 24.6, 4.4)
    for (const [arm, side] of [[armL, -1], [armR, 1]] as const) {
      arm.position.set(side * 7.4, 26.2, 0)
      const a = put(arm, box(4.2, 11, 4.6, 1.2), mat('teal'), side * 1.2, -11, 0)
      a.rotation.z = side * 0.12
      put(arm, new THREE.CylinderGeometry(1.7, 1.7, 3.2, 12), mat('skin'), side * 2.2, -13.4, 0.6)
      fig.add(arm)
    }
    put(fig, new THREE.CylinderGeometry(2.6, 2.6, 1.6, 14), mat('skin'), 0, 27.6, 0)
    const head = new THREE.Group()
    head.position.y = 28.4
    fig.add(head)
    put(head, new THREE.CylinderGeometry(4.9, 4.9, 8.6, 28), mat('skin'), 0, 4.6, 0)
    for (const ex of [-1.8, 1.8]) put(head, new THREE.SphereGeometry(0.62, 10, 8), mat('black'), ex, 5.6, 4.7)
    const smile = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.28, 6, 14, Math.PI * 0.8), mat('black'))
    smile.rotation.z = Math.PI * 1.1
    smile.position.set(0, 3.7, 4.75)
    head.add(smile)
    put(head, new THREE.CylinderGeometry(5.3, 5.4, 3.2, 28), mat('coral'), 0, 9.3, 0)
    put(head, new THREE.SphereGeometry(5.3, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat('coral'), 0, 10.8, 0).scale.y = 0.45
    put(head, box(9, 0.9, 5, 0.3), mat('coral'), 0, 9.3, 5.2)
  }
  fig.position.set(input.reducedMotion ? -170 : -250, 0, input.reducedMotion ? 0 : 0)
  town.add(fig)

  // ───────── パネルを開いているあいだ、今いる建物と人形のほかを褪せさせる ─────────
  // 部品の材質は建物どうしで共有しているので、褪せさせるものだけ材質の写しに差し替え、その色を背景の色へ寄せる
  let focus: { group: THREE.Group } | null = null
  let dim = 0
  let dimGoal = 0
  const faded = new Map<THREE.Material, THREE.Material>()
  const bg = new THREE.Color()
  const fadedOf = (m: THREE.Material) => {
    let f = faded.get(m)
    if (!f) {
      f = m.clone()
      f.userData.orig = m
      faded.set(m, f)
    }
    return f
  }
  const inside = (o: THREE.Object3D, root: THREE.Object3D) => {
    for (let p: THREE.Object3D | null = o; p; p = p.parent) if (p === root) return true
    return false
  }
  const applyDim = () => {
    const keep = (o: THREE.Object3D) => inside(o, fig) || (focus !== null && inside(o, focus.group))
    town.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh || inside(o, ghost)) return
      const swap = (m: THREE.Material) => {
        const orig = (m.userData.orig as THREE.Material | undefined) ?? m
        return dim > 0.001 && !keep(o) ? fadedOf(orig) : orig
      }
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material)
    })
    const k = 0.62 * dim
    for (const [orig, f] of faded) {
      const o = orig as THREE.MeshStandardMaterial
      const c = f as THREE.MeshStandardMaterial
      if (o.map) {
        // 画像は色を掛けても明るくできないので、透かして背景に溶かす
        c.transparent = true
        c.opacity = 1 - k
      } else if (o.color) c.color.copy(o.color).lerp(bg, k)
    }
    shadowMat.opacity = 0.14 * (1 - k)
  }

  // ───────── カメラ ─────────
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 3000)
  const view = { yaw: 0.42, pitch: 0.6, target: new THREE.Vector3(-90, 18, -24) }
  let vw = 1
  let vh = 1
  let panelOpen = false
  let panelWidth = 420
  const resize = () => {
    vw = host.clientWidth
    vh = host.clientHeight
    renderer.setSize(vw, vh, false)
    needsRender = true
    loop()
  }
  const narrow = () => vw < 700
  const placeCamera = () => {
    const size = narrow() ? 230 : 230
    const aspect = vw / vh
    camera.left = (-size * aspect) / 2
    camera.right = (size * aspect) / 2
    camera.top = size / 2
    camera.bottom = -size / 2
    const dir = new THREE.Vector3(Math.sin(view.yaw) * Math.cos(view.pitch), Math.sin(view.pitch), Math.cos(view.yaw) * Math.cos(view.pitch))
    const right = new THREE.Vector3(Math.cos(view.yaw), 0, -Math.sin(view.yaw))
    const t = view.target.clone()
    // パネルが開いているあいだは、人形がパネルに隠れないよう絵をずらす（広い画面は右に、スマホは下に出る）
    if (panelOpen && !narrow()) t.addScaledVector(right, (Math.min(panelWidth + 16, vw * 0.6) / vw) * size * aspect * 0.5)
    if (panelOpen && narrow()) t.y -= (size * 0.26) / Math.cos(view.pitch)
    camera.position.copy(t).addScaledVector(dir, 1000)
    camera.lookAt(t)
    camera.updateProjectionMatrix()
  }

  // ───────── 歩く ─────────
  const SPEED = 78
  let path: THREE.Vector3[] = []
  let goal: Building | null = null
  let walkT = 0
  let facing = 0
  const goTo = (id: Section) => {
    const b = buildings.find((x) => x.id === id)
    if (!b) return
    input.onLeave(false)
    goal = b
    if (input.reducedMotion) {
      fig.position.copy(b.door)
      path = []
      goal = null
      facing = Math.PI
      focus = b
      input.onArrive(b.id)
    } else {
      const from = fig.position
      const pts: THREE.Vector3[] = []
      // プロムナードの真ん中（z = 0）まで出て、横に歩き、建物の前へ
      if (Math.abs(from.z) > 2) pts.push(new THREE.Vector3(from.x, 0, 0))
      if (Math.abs(b.door.x - from.x) > 1) pts.push(new THREE.Vector3(b.door.x, 0, 0))
      pts.push(b.door.clone())
      path = pts
    }
    loop()
  }

  // ───────── 操作: 建物をクリックで向かう、ドラッグで回す。← → / A D で歩き、↑ / W / Enter で入り、↓ / S で道に戻る ─────────
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  type Target = Building | Signpost | Prop
  let hover: Target | null = null
  const aim = (e: PointerEvent) => {
    const r = renderer.domElement.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
  }
  const pick = (e: PointerEvent): Target | null => {
    aim(e)
    const hit = ray.intersectObjects([...buildings.map((b) => b.group), ...signposts.map((s) => s.group), ...props.map((p) => p.group)], true)[0]
    if (!hit) return null
    let o: THREE.Object3D | null = hit.object
    while (o && !o.userData.id && !o.userData.href && !o.userData.prop) o = o.parent
    return buildings.find((b) => b.group === o) ?? signposts.find((s) => s.group === o) ?? props.find((p) => p.group === o) ?? null
  }

  // ───────── 小物を動かす: 長押しで持ち上げ、スタッドに合わせた置き場所を白い枠で見せ、離すとカチッとはまる ─────────
  const sfx = new Sfx()
  const LIFT = 14 // 持ち上げたときの高さ
  const HOLD_MS = 380 // 長押しとみなす時間
  // 置ける範囲: 道（プロムナード）の手前の歩道。プロムナードの南の縁から、ベースプレートの手前の縁まで
  const AREA = { x0: (-PW / 2) * P, x1: (PW / 2) * P, z0: 24, z1: (PD / 2) * P }
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const ghost = new THREE.Group()
  ghost.name = 'ghost'
  const ghostLine = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.95, depthTest: false })
  const ghostFill = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.18, depthWrite: false })
  ghost.renderOrder = 10
  ghost.visible = false
  town.add(ghost)
  let ghostKey = ''
  const footprintOf = (p: Prop, rot: number) => (rot % 2 === 0 ? { fw: p.w, fd: p.d } : { fw: p.d, fd: p.w })
  /** 足元の中心を、スタッドの格子に合わせる。スタッドは 8mm おきの 4mm 目なので、足元の左端（手前の端）は 8 の倍数 */
  const snap = (v: number, n: number) => Math.round((v - (n * P) / 2) / P) * P + (n * P) / 2
  type Rect = { x0: number; x1: number; z0: number; z1: number }
  let obstacles: Rect[] = []
  const rectOf = (p: Prop, place: { x: number; z: number; rot: number }): Rect => {
    const { fw, fd } = footprintOf(p, place.rot)
    return { x0: place.x - (fw * P) / 2, x1: place.x + (fw * P) / 2, z0: place.z - (fd * P) / 2, z1: place.z + (fd * P) / 2 }
  }
  const overlaps = (a: Rect, b: Rect) => a.x0 < b.x1 && b.x0 < a.x1 && a.z0 < b.z1 && b.z0 < a.z1
  const canPlace = (p: Prop, place: { x: number; z: number; rot: number }) => {
    const r = rectOf(p, place)
    if (r.x0 < AREA.x0 || r.x1 > AREA.x1 || r.z0 < AREA.z0 || r.z1 > AREA.z1) return false
    return !obstacles.some((o) => overlaps(r, o))
  }
  const collectObstacles = (except: Prop) => {
    obstacles = [
      ...solids.map((o) => new THREE.Box3().setFromObject(o)).map((b) => ({ x0: b.min.x + 0.5, x1: b.max.x - 0.5, z0: b.min.z + 0.5, z1: b.max.z - 0.5 })),
      ...props.filter((p) => p !== except).map((p) => rectOf(p, p.place)),
    ]
  }
  const showGhost = (p: Prop, place: { x: number; z: number; rot: number }, ok: boolean) => {
    const { fw, fd } = footprintOf(p, place.rot)
    const key = `${fw}x${fd}`
    if (key !== ghostKey) {
      ghost.clear()
      const geo = new THREE.BoxGeometry(fw * P - 0.2, p.h, fd * P - 0.2)
      geo.translate(0, p.h / 2, 0)
      const line = new THREE.LineSegments(new THREE.EdgesGeometry(geo), ghostLine)
      const fill = new THREE.Mesh(geo, ghostFill)
      line.renderOrder = fill.renderOrder = 10
      ghost.add(fill, line)
      ghostKey = key
    }
    ghost.position.set(place.x, 0, place.z)
    const c = ok ? '#ffffff' : '#ff4a3d'
    ghostLine.color.set(c)
    ghostFill.color.set(c)
    ghost.visible = true
  }
  // 長押しの待ち（押しているあいだ、ベンチがわずかに震える）・持っている小物・置く動き
  let pressing: { prop: Prop; timer: number; t: number } | null = null
  let held: { prop: Prop; target: { x: number; z: number; rot: number }; ok: boolean; from: { x: number; z: number; rot: number } } | null = null
  type Seat = { prop: Prop; from: THREE.Vector3; to: { x: number; z: number; rot: number }; t: number; move: number }
  let seating: Seat | null = null
  let jiggle = 0 // はまったときに街全体が小さく沈む
  const pan = (x: number) => Math.max(-1, Math.min(1, x / 240))

  const pickUp = (prop: Prop) => {
    pressing = null
    collectObstacles(prop)
    held = { prop, target: { ...prop.place }, ok: true, from: { ...prop.place } }
    sfx.pop(pan(prop.place.x))
    navigator.vibrate?.(10)
    hover = null
    el.style.cursor = 'grabbing'
    showGhost(prop, prop.place, true)
    loop()
  }
  const moveHeld = (e: PointerEvent) => {
    if (!held) return
    aim(e)
    const at = ray.ray.intersectPlane(ground, new THREE.Vector3())
    if (!at) return
    const { fw, fd } = footprintOf(held.prop, held.target.rot)
    const place = { x: snap(at.x, fw), z: snap(at.z, fd), rot: held.target.rot }
    if (place.x !== held.target.x || place.z !== held.target.z) {
      held.target = place
      held.ok = canPlace(held.prop, place)
    }
    showGhost(held.prop, held.target, held.ok)
    loop()
  }
  const turnHeld = () => {
    if (!held) return
    const rot = (held.target.rot + 1) % 2
    const { fw, fd } = footprintOf(held.prop, rot)
    held.target = { x: snap(held.target.x, fw), z: snap(held.target.z, fd), rot }
    held.ok = canPlace(held.prop, held.target)
    showGhost(held.prop, held.target, held.ok)
    sfx.turn(pan(held.target.x))
    loop()
  }
  const drop = () => {
    if (!held) return
    const { prop } = held
    // 置けない場所なら、ゴツンと鳴らして元の場所へ戻す
    const to = held.ok ? held.target : held.from
    if (!held.ok) sfx.bonk(pan(held.target.x))
    seating = { prop, from: prop.group.position.clone(), to, t: 0, move: held.ok ? 0.06 : 0.24 }
    held = null
    ghost.visible = false
    el.style.cursor = ''
    loop()
  }
  const stepProps = (dt: number) => {
    let moving = false
    if (pressing) {
      pressing.t += dt
      const g = pressing.prop.group
      g.rotation.z = Math.sin(pressing.t * 70) * 0.012 * Math.min(1, pressing.t * 6)
      moving = true
    }
    if (held) {
      const g = held.prop.group
      const goal = new THREE.Vector3(held.target.x, LIFT + Math.sin(clock * 3) * 0.6, held.target.z)
      g.position.lerp(goal, Math.min(1, dt * 18))
      let dr = (held.target.rot * Math.PI) / 2 - g.rotation.y
      dr = Math.atan2(Math.sin(dr), Math.cos(dr))
      g.rotation.y += dr * Math.min(1, dt * 16)
      g.rotation.z = 0
      g.rotation.x = 0.06
      moving = true
    }
    if (seating) {
      const s = seating
      s.t += dt
      const g = s.prop.group
      const u = Math.min(1, s.t / s.move)
      const ex = 1 - Math.pow(1 - u, 3)
      g.position.x = s.from.x + (s.to.x - s.from.x) * ex
      g.position.z = s.from.z + (s.to.z - s.from.z) * ex
      g.rotation.y = (s.to.rot * Math.PI) / 2
      g.rotation.x = 0.06 * (1 - u)
      const down = Math.min(1, Math.max(0, (s.t - s.move) / 0.12))
      g.position.y = (s.move > 0.1 ? LIFT : s.from.y) * (1 - down * down)
      if (down >= 1) {
        g.position.set(s.to.x, 0, s.to.z)
        g.rotation.set(0, (s.to.rot * Math.PI) / 2, 0)
        s.prop.place = { ...s.to }
        propStore.set(s.prop.id, s.prop.place)
        sfx.click(4, pan(s.to.x))
        navigator.vibrate?.(8)
        jiggle = 1
        seating = null
      }
      moving = true
    }
    if (jiggle > 0) {
      jiggle = Math.max(0, jiggle - dt / 0.22)
      town.position.y = -0.5 * Math.sin((1 - jiggle) * Math.PI) * jiggle
      moving = true
    }
    return moving
  }
  let drag: { x: number; y: number; moved: number } | null = null
  const el = renderer.domElement
  const onDown = (e: PointerEvent) => {
    sfx.unlock()
    drag = { x: e.clientX, y: e.clientY, moved: 0 }
    el.setPointerCapture(e.pointerId)
    // 小物の上で押したら、長押しを待つ（動かす前に指を動かしたら、いつもどおり街を回す）
    const t = pick(e)
    if (t && 'place' in t && !seating && !input.reducedMotion) {
      pressing = { prop: t, timer: window.setTimeout(() => pickUp(t), HOLD_MS), t: 0 }
      loop()
    }
  }
  const cancelPress = () => {
    if (!pressing) return
    window.clearTimeout(pressing.timer)
    pressing.prop.group.rotation.z = 0
    pressing = null
  }
  const onMove = (e: PointerEvent) => {
    if (held) {
      moveHeld(e)
      return
    }
    if (drag) {
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      drag.moved += Math.abs(dx) + Math.abs(dy)
      drag.x = e.clientX
      drag.y = e.clientY
      if (drag.moved > 6) {
        cancelPress()
        view.yaw = Math.min(1.25, Math.max(-1.25, view.yaw - dx * 0.006))
        view.pitch = Math.min(1.2, Math.max(0.3, view.pitch + dy * 0.004))
        el.classList.replace('cursor-grab', 'cursor-grabbing')
        loop()
      }
      return
    }
    const b = pick(e)
    if (b !== hover) {
      hover = b
      el.style.cursor = b ? ('place' in b ? 'grab' : 'pointer') : ''
      loop()
    }
  }
  const onUp = (e: PointerEvent) => {
    const click = drag && drag.moved <= 6
    drag = null
    cancelPress()
    if (held) {
      drop()
      return
    }
    el.classList.replace('cursor-grabbing', 'cursor-grab')
    if (!click) return
    const b = pick(e)
    // パネルを開いているとき、ほかの建物と看板以外（地面・今いる建物・ベンチ）を押したら、パネルを閉じて道に戻る
    if (panelOpen && (!b || 'place' in b || (!('href' in b) && b === focus))) {
      toStreet()
      return
    }
    if (!b || 'place' in b) return
    if ('href' in b) input.onLink(b.href)
    else goTo(b.id)
  }
  /** 建物の前から、プロムナードの真ん中へ戻る（パネルは閉じる） */
  function toStreet() {
    goal = null
    input.onLeave(true)
    path = Math.abs(fig.position.z) > 0.5 ? [new THREE.Vector3(fig.position.x, 0, 0)] : []
    if (input.reducedMotion && path.length) {
      fig.position.z = 0
      path = []
    }
    facing = 0
    loop()
  }
  const onLeaveCanvas = () => {
    hover = null
    loop()
  }
  el.addEventListener('pointerdown', onDown)
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
  el.addEventListener('pointerleave', onLeaveCanvas)
  el.addEventListener('pointercancel', onUp)
  // 持っているあいだ、右クリックで 90° 回す
  const onContext = (e: MouseEvent) => {
    if (!held) return
    e.preventDefault()
    turnHeld()
  }
  el.addEventListener('contextmenu', onContext)
  disposers.push(() => {
    el.removeEventListener('pointerdown', onDown)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
    el.removeEventListener('pointerleave', onLeaveCanvas)
    el.removeEventListener('pointercancel', onUp)
    el.removeEventListener('contextmenu', onContext)
    cancelPress()
  })
  const keys = new Set<string>()
  /** W A S D を矢印キーにそろえる（キーの位置で見るので、配列や IME に左右されない） */
  const WASD: Record<string, string> = { KeyW: 'ArrowUp', KeyA: 'ArrowLeft', KeyS: 'ArrowDown', KeyD: 'ArrowRight' }
  const keyOf = (e: KeyboardEvent) => (e.isComposing ? '' : (WASD[e.code] ?? e.key))
  const onKeyDown = (e: KeyboardEvent) => {
    // キーはページ全体で受ける（パネルの ✕ や上のボタンを押した直後も歩けるように）。
    // ただしパネルの中（スクロールに矢印を使う）と、文字を打つ場所では受けない
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const at = e.target instanceof Element ? e.target : null
    if (at?.closest('aside, input, textarea, select, [contenteditable="true"]')) return
    // ボタンやリンクの上の Enter は、そのボタンを押すほうを優先する
    if (e.key === 'Enter' && at?.closest('button, a')) return
    // 小物を持っているあいだ: R で回す、Esc で元の場所へ戻す
    if (held) {
      if (e.key === 'r' || e.key === 'R') turnHeld()
      if (e.key === 'Escape') {
        held.ok = false
        drop()
      }
      e.preventDefault()
      return
    }
    const key = keyOf(e)
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      keys.add(key)
      path = []
      goal = null
      input.onLeave(true)
      e.preventDefault()
      loop()
    } else if (key === 'ArrowDown') {
      e.preventDefault()
      toStreet()
    } else if (key === 'Enter' || key === 'ArrowUp') {
      const near = buildings.reduce((a, b) => (Math.abs(b.x - fig.position.x) < Math.abs(a.x - fig.position.x) ? b : a))
      if (Math.abs(near.x - fig.position.x) < 50) {
        e.preventDefault()
        goTo(near.id)
      }
    }
  }
  const onKeyUp = (e: KeyboardEvent) => keys.delete(keyOf(e))
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  disposers.push(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  })

  // ───────── 描画: 画面に見えているあいだだけ（工房の歯車がいつも回っている） ─────────
  let raf = 0
  let last = 0
  let clock = 0
  let visible = true
  let readySent = false
  function loop() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(frame)
  }
  function frame(now: number) {
    if (document.hidden) {
      last = 0
      return
    }
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
    last = now
    clock += dt
    let moving = false

    let vx = 0
    let vz = 0
    if (keys.size) {
      fig.position.z += (0 - fig.position.z) * Math.min(1, dt * 8)
      vx = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0)
      fig.position.x = Math.min(220, Math.max(-230, fig.position.x + vx * SPEED * dt))
    } else if (path.length) {
      const to = path[0]
      const d = to.clone().sub(fig.position)
      const len = d.length()
      const stepLen = SPEED * dt
      if (len <= stepLen) {
        fig.position.copy(to)
        path.shift()
        if (!path.length && goal) {
          goal.pop = 1
          focus = goal
          input.onArrive(goal.id)
          goal = null
        }
      } else {
        fig.position.addScaledVector(d, stepLen / len)
        vx = d.x / len
        vz = d.z / len
      }
    }
    if (vx !== 0 || vz !== 0) {
      facing = Math.atan2(vx, vz)
      walkT += dt * 11
      moving = true
    } else {
      walkT += (Math.round(walkT / Math.PI) * Math.PI - walkT) * Math.min(1, dt * 12)
      // 着いたら建物のほうを向く
      if (panelOpen) facing = Math.PI
    }
    let dy = facing - fig.rotation.y
    dy = Math.atan2(Math.sin(dy), Math.cos(dy))
    fig.rotation.y += dy * Math.min(1, dt * 12)
    const swing = Math.sin(walkT) * 0.65
    legL.rotation.x = swing
    legR.rotation.x = -swing
    armL.rotation.x = -swing * 0.8
    armR.rotation.x = swing * 0.8
    fig.position.y = Math.abs(Math.sin(walkT)) * 1.2
    if (Math.abs(dy) > 0.002 || Math.abs(Math.sin(walkT)) > 0.01) moving = true

    // 建物: 着いたときの弾みと、カーソルを乗せたときの持ち上がり
    for (const b of buildings) {
      b.pop = Math.max(0, b.pop - dt * 2.2)
      const y = (b === hover ? 1.6 : 0) + Math.sin((1 - b.pop) * Math.PI) * b.pop * 4
      b.group.position.y += (y - b.group.position.y) * Math.min(1, dt * 14)
      if (Math.abs(y - b.group.position.y) > 0.01 || b.pop > 0) moving = true
    }
    if (stepProps(dt)) moving = true
    if (Math.abs(dimGoal - dim) > 0.001) {
      dim += (dimGoal - dim) * Math.min(1, dt * (input.reducedMotion ? 60 : 6))
      if (Math.abs(dimGoal - dim) <= 0.001) dim = dimGoal
      applyDim()
      moving = true
    }
    // 看板: カーソルを乗せると少し持ち上がる
    for (const sp of signposts) {
      const goal = sp === hover ? 3 : 0
      sp.lift += (goal - sp.lift) * Math.min(1, dt * 14)
      sp.group.position.y = sp.lift
      if (Math.abs(goal - sp.lift) > 0.01) moving = true
    }
    if (!input.reducedMotion) for (const g of gears) g.rotation.z = ((clock * 6) / (g.userData.t as number)) * (g.userData.t === 8 ? -1 : 1)

    // カメラは人形を追いかける（広い画面では、街の真ん中との間。パネルが開いたら人形と建物を真ん中に）
    const want = new THREE.Vector3(narrow() || panelOpen ? fig.position.x : fig.position.x * 0.55, 18, narrow() ? -10 : -24)
    view.target.lerp(want, input.reducedMotion ? 1 : Math.min(1, dt * 3))
    if (view.target.distanceTo(want) > 0.2) moving = true
    placeCamera()
    renderer.render(scene, camera)
    needsRender = false
    if (!readySent) {
      readySent = true
      input.onReady()
    }
    if (moving || (visible && !input.reducedMotion) || needsRender) raf = requestAnimationFrame(frame)
    else last = 0
  }
  // 前に動かした小物は、その場所から（ページの中だけで覚えている）
  for (const p of props) {
    const saved = propStore.get(p.id)
    if (!saved) continue
    collectObstacles(p)
    if (!canPlace(p, saved)) continue
    p.place = { ...saved }
    p.group.position.set(saved.x, 0, saved.z)
    p.group.rotation.y = (saved.rot * Math.PI) / 2
  }
  for (const p of props) p.group.position.set(p.place.x, 0, p.place.z)

  const ro = new ResizeObserver(resize)
  ro.observe(host)
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) loop()
  })
  io.observe(host)
  document.addEventListener('visibilitychange', loop)
  disposers.push(() => {
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', loop)
  })
  resize()

  return {
    goTo,
    setPanelOpen(open, width) {
      panelOpen = open
      if (input.focusDim) {
        const g = getComputedStyle(document.documentElement).getPropertyValue('--ground').trim().split(/\s+/).map(Number)
        if (g.length === 3) bg.setRGB(g[0] / 255, g[1] / 255, g[2] / 255, THREE.SRGBColorSpace)
        dimGoal = open ? 1 : 0
      }
      if (width) panelWidth = width
      loop()
    },
    dispose() {
      cancelAnimationFrame(raf)
      for (const d of disposers) d()
      for (const m of mats.values()) m.dispose()
      for (const g of geoCache.values()) g.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
