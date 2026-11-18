import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { createBrickMaterial } from '@/lib/bricks/geometry'
import { gearGeometry } from '@/lib/bricks/technic'
import type { Section } from '@/lib/town/sections'

/*
 * トップの「レゴの街」。プロムナード沿いに建物が 5 つ並び、それぞれがサイトのセクション。
 * 人形が歩いて建物の前に着くと onArrive が呼ばれ、画面の側（components/town/TownView.tsx）がその中身を開く。
 * 寸法は mm（1 スタッド 8mm、ブロック 1 段 9.6mm）。人形は高さ約 40mm で、オリジナルの形。
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
  /** 建物の看板。title は英字、sub は小さく添える言葉 */
  labels: Record<Section, { title: string; sub: string }>
  /** 工房の窓に飾る作品の画像（3 枚） */
  workImages: string[]
  /** 4 階建ての各階のロゴ。下の階（古い会社）から順に */
  careerLogos: string[]
  reducedMotion: boolean
  onArrive: (id: Section) => void
  /** 人形が歩き出した（パネルを閉じる合図） */
  onLeave: () => void
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
  renderer.domElement.classList.add('absolute', 'inset-0', 'block', 'h-full', 'w-full', 'cursor-grab', 'touch-pan-y')
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
  const FRONT = -32 // 建物の正面の z（プロムナードの北の縁）
  const L = input.labels

  const building = (id: Section, x: number, make: (g: THREE.Group) => void) => {
    const group = new THREE.Group()
    group.position.set(x, 0, FRONT)
    group.userData.id = id
    make(group)
    town.add(group)
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
    const s = sign(L.about.title, L.about.sub, 30, 10, COL.navy, '#ffffff')
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
    const s = sign(L.works.title, L.works.sub, 46, 14, COL.teal, '#ffffff')
    s.position.set(0, top + PLATE + 2, -6)
    s.rotation.x = -0.12
    g.add(s)
    put(g, box(4, 12, 4, 0.5), mat('dark'), -18, top + PLATE, -8)
    put(g, box(4, 12, 4, 0.5), mat('dark'), 18, top + PLATE, -8)
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
    const s = sign(L.career.title, L.career.sub, 40, 12, '#ffffff', COL.navy)
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
    const s = sign(L.output.title, L.output.sub, 40, 11, '#ffffff', COL.navy)
    s.position.set(0, top - 9, 1.2)
    g.add(s)
  })

  // CONTACT: 郵便局と、通りのポスト
  building('contact', 186, (g) => {
    const w = 6
    const d = 5
    const top = stack(g, w, d, 3, 'coral', 0, (-d * P) / 2)
    put(g, blockGeo(w + 1, d + 1, 1), mat('white'), 0, top, (-d * P) / 2)
    put(g, box(12, 22, 1.6, 0.4), mat('white'), -8, 0, 0.6)
    windowPane(g, 12, 10, 10, 10)
    const s = sign(L.contact.title, L.contact.sub, 34, 9, '#ffffff', COL.coral)
    s.position.set(0, top + PLATE + 1, -2)
    g.add(s)
    const post = stack(g, 2, 2, 3, 'coral', -26, 30, 0)
    put(g, box(10, 1.2, 1, 0.3), mat('navy'), -26, post - 7, 30 + P + 0.2)
  })

  // 公園（木・ベンチ・街灯）。背の低いものだけにして、建物を隠さない
  const tree = (x: number, z: number, s: number) => {
    const g = new THREE.Group()
    put(g, new THREE.CylinderGeometry(2.2, 2.6, 16 * s, 10), mat('trunk'), 0, 8 * s, 0)
    for (let k = 0; k < 3; k++) put(g, new THREE.CylinderGeometry((9 - k * 2.6) * s, (11 - k * 2.6) * s, 8 * s, 18), mat('leaf'), 0, (16 + k * 7) * s, 0)
    g.position.set(x, 0, z)
    town.add(g)
  }
  const trees: [number, number, number][] = [[-210, 60, 1.1], [-150, 80, 0.9], [-30, 70, 1], [40, 90, 1.2], [150, 64, 0.95], [210, 86, 1.05], [-110, -100, 1.2], [70, -100, 1], [150, -96, 0.9], [-225, -90, 1]]
  for (const [x, z, s] of trees) tree(x, z, s)
  for (let x = -200; x <= 200; x += 80) {
    put(town, new THREE.CylinderGeometry(0.9, 1.2, 44, 8), mat('black'), x, 22, 30)
    put(town, new THREE.CylinderGeometry(3, 2, 4, 12), mat('white'), x, 46, 30)
  }
  for (const x of [-120, 70]) {
    put(town, blockGeo(4, 1, 1), mat('dark'), x, 4, 50)
    stack(town, 1, 1, 1, 'dark', x - 12, 50, 0, false)
    stack(town, 1, 1, 1, 'dark', x + 12, 50, 0, false)
  }

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
    input.onLeave()
    goal = b
    if (input.reducedMotion) {
      fig.position.copy(b.door)
      path = []
      goal = null
      facing = Math.PI
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

  // ───────── 操作: 建物をクリックで向かう、ドラッグで回す、← → で歩く（街にフォーカスがあるときだけ） ─────────
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  let hover: Building | null = null
  const pick = (e: PointerEvent) => {
    const r = renderer.domElement.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    const hit = ray.intersectObjects(buildings.map((b) => b.group), true)[0]
    if (!hit) return null
    let o: THREE.Object3D | null = hit.object
    while (o && !o.userData.id) o = o.parent
    return buildings.find((b) => b.group === o) ?? null
  }
  let drag: { x: number; y: number; moved: number } | null = null
  const el = renderer.domElement
  const onDown = (e: PointerEvent) => {
    drag = { x: e.clientX, y: e.clientY, moved: 0 }
    el.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent) => {
    if (drag) {
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      drag.moved += Math.abs(dx) + Math.abs(dy)
      drag.x = e.clientX
      drag.y = e.clientY
      if (drag.moved > 6) {
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
      el.style.cursor = b ? 'pointer' : ''
      loop()
    }
  }
  const onUp = (e: PointerEvent) => {
    const click = drag && drag.moved <= 6
    drag = null
    el.classList.replace('cursor-grabbing', 'cursor-grab')
    if (!click) return
    const b = pick(e)
    if (b) goTo(b.id)
  }
  const onLeaveCanvas = () => {
    hover = null
    loop()
  }
  el.addEventListener('pointerdown', onDown)
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerup', onUp)
  el.addEventListener('pointerleave', onLeaveCanvas)
  disposers.push(() => {
    el.removeEventListener('pointerdown', onDown)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
    el.removeEventListener('pointerleave', onLeaveCanvas)
  })
  const keys = new Set<string>()
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      keys.add(e.key)
      path = []
      goal = null
      input.onLeave()
      e.preventDefault()
      loop()
    } else if (e.key === 'Enter' || e.key === 'ArrowUp') {
      const near = buildings.reduce((a, b) => (Math.abs(b.x - fig.position.x) < Math.abs(a.x - fig.position.x) ? b : a))
      if (Math.abs(near.x - fig.position.x) < 50) {
        e.preventDefault()
        goTo(near.id)
      }
    }
  }
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key)
  host.addEventListener('keydown', onKeyDown)
  host.addEventListener('keyup', onKeyUp)
  disposers.push(() => {
    host.removeEventListener('keydown', onKeyDown)
    host.removeEventListener('keyup', onKeyUp)
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
    if (!input.reducedMotion) for (const g of gears) g.rotation.z = ((clock * 6) / (g.userData.t as number)) * (g.userData.t === 8 ? -1 : 1)

    // カメラは人形を追いかける（広い画面では、街の真ん中との間）
    const want = new THREE.Vector3(narrow() ? fig.position.x : fig.position.x * 0.55, 18, narrow() ? -10 : -24)
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
