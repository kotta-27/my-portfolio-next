import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { PARTS, PITCH, PLATE, createBrickMaterial, footprint, partGeometry, setBrickColor, type PartId } from '@/lib/bricks/geometry'

/*
 * トップのヒーローの 3D シーン「机の上の作品」。灰色のプレートの上に小さな塔と、まわりに散らばった部品。
 * 読み込むと部品が上から順に落ちてきてはまる。ドラッグで回せ、カーソルに合わせて視点が少しだけ動く。
 * three は大きいので、このファイルはヒーローが画面に入ってから動的に読み込む（components/home/WorkbenchScene.tsx）。
 */

type Tone = 'teal' | 'coral' | 'white' | 'navy' | 'mustard' | 'azure' | 'plate'
type Theme = 'light' | 'dark'

const PALETTE: Record<Theme, Record<Tone, string>> = {
  light: { teal: '#0C7A7C', coral: '#C84A2C', white: '#F4F4F2', navy: '#0D1B2A', mustard: '#F4B01C', azure: '#3E9FD9', plate: '#C9D0D8' },
  // 暗い地面の上で沈まないよう、紺とプレートを一段明るくする
  dark: { teal: '#2FA8A5', coral: '#E0603F', white: '#E9EEF3', navy: '#3A4F6B', mustard: '#F4B01C', azure: '#4AA8E0', plate: '#2A3644' },
}

/** 部品の置き場所。sx, sz = 足元の左奥の角（スタッド単位、プレートの中心が原点）、y = 高さ（プレート単位）、rot = 90° 単位、spin = それ以外の傾き（ラジアン） */
type Piece = { part: PartId; tone: Tone; sx: number; sz: number; y: number; rot?: number; spin?: number }

const PIECES: Piece[] = [
  // 土台のプレート 4 枚（12×12 スタッド）
  { part: 'p6x6', tone: 'plate', sx: -6, sz: -6, y: 0 },
  { part: 'p6x6', tone: 'plate', sx: 0, sz: -6, y: 0 },
  { part: 'p6x6', tone: 'plate', sx: -6, sz: 0, y: 0 },
  { part: 'p6x6', tone: 'plate', sx: 0, sz: 0, y: 0 },
  // 塔
  { part: 'b2x4', tone: 'navy', sx: -3, sz: -2, y: 1 },
  { part: 'b2x4', tone: 'teal', sx: -2, sz: -3, y: 4, rot: 1 },
  { part: 'b2x2', tone: 'coral', sx: -2, sz: -1, y: 7 },
  { part: 'b1x2', tone: 'white', sx: -2, sz: -1, y: 10, rot: 1 },
  { part: 'b1x1', tone: 'mustard', sx: -1, sz: -1, y: 13 },
  // プレートの上のほかの部品
  { part: 'b2x3', tone: 'white', sx: 2, sz: 1, y: 1 },
  { part: 'p2x4', tone: 'coral', sx: 1, sz: 1, y: 4 },
  { part: 'b1x4', tone: 'teal', sx: -5, sz: 3, y: 1 },
  { part: 'b1x2', tone: 'mustard', sx: 3, sz: -5, y: 1, rot: 1 },
  { part: 'b2x2', tone: 'azure', sx: 3, sz: 3, y: 1 },
  { part: 'p1x2', tone: 'navy', sx: -5, sz: -5, y: 1 },
  // 机に転がった部品
  { part: 'b1x2', tone: 'coral', sx: 8, sz: -2, y: 0, rot: 1, spin: 0.5 },
  { part: 'b1x1', tone: 'teal', sx: 8.5, sz: 3, y: 0, spin: 0.3 },
  { part: 'b2x2', tone: 'white', sx: -10, sz: 2, y: 0, spin: -0.35 },
]

/** 落ちてくる演出: 部品ごとの遅れ（ms）と長さ（ms）。プレートは最初から置いておく */
const DROP_STAGGER = 85
const DROP_MS = 620
const DROP_HEIGHT = 70

export type Workbench = {
  setTheme: (theme: Theme) => void
  dispose: () => void
}

// 少し行き過ぎてから戻る（はまる感じ）
const easeOutBack = (t: number) => {
  const c = 1.4
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}

export function mountWorkbench(host: HTMLElement, opts: { theme: Theme; reducedMotion: boolean; onReady: () => void }): Workbench {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.classList.add('block', 'h-full', 'w-full', 'cursor-grab', 'touch-pan-y')
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.65

  const key = new THREE.DirectionalLight('#fff4e6', 2.2)
  key.position.set(-120, 260, 160)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  const sc = key.shadow.camera
  sc.left = sc.bottom = -140
  sc.right = sc.top = 140
  sc.near = 10
  sc.far = 800
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.03
  key.shadow.radius = 5
  scene.add(key, new THREE.HemisphereLight('#ffffff', '#8a7a68', 0.45))

  // 机の面: 影だけを受ける透明な板。ページの背景がそのまま見える
  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000).rotateX(-Math.PI / 2), shadowMat)
  floor.position.y = -0.02
  floor.receiveShadow = true
  scene.add(floor)

  const rig = new THREE.Group()
  scene.add(rig)

  const materials = new Map<Tone, THREE.MeshPhysicalMaterial>()
  const materialFor = (tone: Tone) => {
    let m = materials.get(tone)
    if (!m) {
      m = createBrickMaterial(PALETTE[opts.theme][tone])
      materials.set(tone, m)
    }
    return m
  }

  type Placed = { mesh: THREE.Mesh; restY: number; delay: number }
  const placed: Placed[] = []
  let dropIndex = 0
  for (const piece of PIECES) {
    const p = PARTS[piece.part]
    const rot = piece.rot ?? 0
    const f = footprint(p, rot)
    const mesh = new THREE.Mesh(partGeometry(piece.part), materialFor(piece.tone))
    const restY = piece.y * PLATE
    mesh.position.set((piece.sx + f.w / 2) * PITCH, restY, (piece.sz + f.d / 2) * PITCH)
    mesh.rotation.y = (rot * Math.PI) / 2 + (piece.spin ?? 0)
    mesh.castShadow = mesh.receiveShadow = true
    rig.add(mesh)
    const isBase = piece.part === 'p6x6'
    placed.push({ mesh, restY, delay: isBase || opts.reducedMotion ? -1 : dropIndex++ * DROP_STAGGER })
  }
  // 塔の中心あたりを回転の軸にする
  rig.position.x = 4

  const camera = new THREE.PerspectiveCamera(26, 1, 10, 3000)
  const target = new THREE.Vector3(2, 10, 6)
  const baseDir = new THREE.Vector3(150, 170, 230).normalize()
  const up = new THREE.Vector3(0, 1, 0)
  let dist = 600

  function resize() {
    const w = host.clientWidth
    const h = host.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // 横幅が狭いときは引いて、作品全体が入るようにする
    dist = 88 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.min(1, camera.aspect / 1.35)
    camera.updateProjectionMatrix()
    needsRender = true
  }

  // ── 操作: ドラッグで回す（離すと惰性で少し回る）、カーソルで視点が少しずれる ──
  let yaw = 0
  let yawVel = 0
  let dragging = false
  let lastX = 0
  const pointer = new THREE.Vector2()
  const onDown = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    renderer.domElement.setPointerCapture(e.pointerId)
    renderer.domElement.classList.replace('cursor-grab', 'cursor-grabbing')
  }
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1)
    if (!dragging) return
    const dx = e.clientX - lastX
    lastX = e.clientX
    yaw += dx * 0.008
    yawVel = dx * 0.008
  }
  const onUp = (e: PointerEvent) => {
    dragging = false
    if (renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId)
    renderer.domElement.classList.replace('cursor-grabbing', 'cursor-grab')
  }
  renderer.domElement.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerup', onUp)

  // ── 描画: 画面に見えているあいだだけ回す ──
  let visible = true
  let needsRender = true
  let raf = 0
  let start = -1
  let readySent = false
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) loop()
  })
  io.observe(host)

  const look = new THREE.Vector2()
  function loop() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(frame)
  }
  function frame(now: number) {
    if (!visible || document.hidden) return
    if (start < 0) start = now
    const t = now - start
    let moving = false

    for (const p of placed) {
      if (p.delay < 0) continue
      const k = Math.min(1, Math.max(0, (t - p.delay) / DROP_MS))
      p.mesh.visible = t >= p.delay
      p.mesh.position.y = p.restY + DROP_HEIGHT * (1 - easeOutBack(k))
      if (k < 1) moving = true
    }

    if (!dragging) {
      yaw += yawVel
      yawVel *= 0.92
      if (Math.abs(yawVel) < 1e-4) yawVel = 0
    }
    // ゆっくり左右に揺れる（動きを減らす設定では止める）
    const sway = opts.reducedMotion ? 0 : Math.sin(now / 2600) * 0.06
    rig.rotation.y = yaw + sway

    look.lerp(pointer, 0.06)
    camera.position.copy(baseDir).applyAxisAngle(up, -look.x * 0.06).multiplyScalar(dist).add(target)
    camera.position.y -= look.y * 12
    camera.lookAt(target)

    renderer.render(scene, camera)
    needsRender = false
    if (!readySent) {
      readySent = true
      opts.onReady()
    }
    // 落下中・ドラッグ中・揺れ・カーソル追従があるあいだは描き続ける
    if (moving || dragging || yawVel !== 0 || !opts.reducedMotion || needsRender || look.distanceTo(pointer) > 0.001) loop()
  }

  const ro = new ResizeObserver(() => {
    resize()
    loop()
  })
  ro.observe(host)
  resize()
  loop()

  return {
    setTheme(theme) {
      for (const [tone, m] of materials) setBrickColor(m, PALETTE[theme][tone])
      shadowMat.opacity = theme === 'dark' ? 0.45 : 0.16
      needsRender = true
      loop()
    },
    dispose() {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      for (const m of materials.values()) m.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
