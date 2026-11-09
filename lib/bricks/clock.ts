import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { PARTS, PITCH, PLATE, createBrickMaterial, footprint, partGeometry, setBrickColor, type PartId } from '@/lib/bricks/geometry'
import { axleGeometry, cylinderZ, escapeWheelGeometry, gearGeometry, liftarmGeometry, meshPhase, pinGeometry, roundedBox } from '@/lib/bricks/technic'

/*
 * トップのヒーローの 3D シーン「6 段減速の時計」。10×10 のプレートの上に、テクニック部品で組んだ骨組みの時計。
 * 上の振り子とアンクルが脱進機の車を 1 歯ずつ「コチ、コチ」と進め、その動きが 8T → 24T の組を 5 回下りながら 1/3 ずつ減速する。
 * 下の文字盤の針は、見ている人の今の時刻（日本時間）を指す。
 * three は大きいので、このファイルはヒーローが画面に入ってから動的に読み込む（components/home/ClockScene.tsx）。
 */

type Theme = 'light' | 'dark'
type Tone = 'plate' | 'lbg' | 'dbg' | 'teal' | 'coral' | 'mustard' | 'navy' | 'white' | 'metal' | 'black'

const PALETTE: Record<Theme, Record<Tone, string>> = {
  light: { plate: '#C9D0D8', lbg: '#A0A5A9', dbg: '#5B6064', teal: '#0C7A7C', coral: '#C84A2C', mustard: '#F4B01C', navy: '#1B2B3D', white: '#F4F4F2', metal: '#8C9298', black: '#26292C' },
  // 暗い地面の上で沈まないよう、暗い部品を一段明るくする
  dark: { plate: '#2A3644', lbg: '#8D949B', dbg: '#5E6872', teal: '#2FA8A5', coral: '#E0603F', mustard: '#F4B01C', navy: '#3A4F6B', white: '#E9EEF3', metal: '#A3ABB3', black: '#1E2124' },
}

const TAU = Math.PI * 2
const TOP = PLATE // プレートの上面
const TICKS_PER_SECOND = 2 // 振り子は 1 秒で 1 往復、コチは 0.5 秒ごと
const SWING = 0.16 // 振り子の振れ幅（ラジアン）
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)))

export type ClockBench = {
  setTheme: (theme: Theme) => void
  dispose: () => void
}

export function mountClock(host: HTMLElement, opts: { theme: Theme; reducedMotion: boolean; onReady: () => void }): ClockBench {
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
  sc.left = sc.bottom = -120
  sc.right = sc.top = 120
  sc.near = 10
  sc.far = 800
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.03
  key.shadow.radius = 4
  scene.add(key, new THREE.HemisphereLight('#ffffff', '#8a7a68', 0.45))
  const shadowMat = new THREE.ShadowMaterial({ opacity: opts.theme === 'dark' ? 0.45 : 0.16 })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000).rotateX(-Math.PI / 2), shadowMat)
  floor.receiveShadow = true
  scene.add(floor)

  // ── 材質と、置くための小さな道具 ──
  const materials = new Map<Tone, THREE.MeshPhysicalMaterial>()
  const mat = (tone: Tone) => {
    let m = materials.get(tone)
    if (!m) {
      m = createBrickMaterial(PALETTE[opts.theme][tone])
      materials.set(tone, m)
    }
    return m
  }
  const rig = new THREE.Group()
  scene.add(rig)
  const put = (parent: THREE.Object3D, geo: THREE.BufferGeometry, tone: Tone, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat(tone))
    m.position.set(x, y, z)
    m.castShadow = m.receiveShadow = true
    parent.add(m)
    return m
  }
  const V = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z)
  /** リフトアーム: 1 つ目の穴を p に置き、x-y 面で phi の向きへ */
  const beam = (n: number, tone: Tone, p: THREE.Vector3, phi: number) => {
    const m = put(rig, liftarmGeometry(n), tone, p.x, p.y, p.z)
    m.rotation.z = phi
    return m
  }
  const beamBetween = (a: THREE.Vector3, b: THREE.Vector3, tone: Tone) => {
    const d = b.clone().sub(a)
    return beam(Math.max(2, Math.round(Math.hypot(d.x, d.y) / 8) + 1), tone, a, Math.atan2(d.y, d.x))
  }
  const brick = (part: PartId, tone: Tone, sx: number, sz: number, rot = 0) => {
    const f = footprint(PARTS[part], rot)
    const m = put(rig, partGeometry(part), tone, (sx + f.w / 2) * PITCH, TOP, (sz + f.d / 2) * PITCH)
    m.rotation.y = (rot * Math.PI) / 2
  }

  // ── 10×10 のプレート ──
  put(rig, roundedBox(79.8, 3.2, 79.8, 0.45), 'plate', 0, 1.6, 0)
  const studProfile = [[0, 0], [2.4, 0], [2.4, 1.42], [2.32, 1.6], [2.12, 1.7], [0, 1.7]].map(([a, b]) => new THREE.Vector2(a, b))
  const studs = new THREE.InstancedMesh(new THREE.LatheGeometry(studProfile, 24), mat('plate'), 100)
  const m4 = new THREE.Matrix4()
  for (let i = 0, k = 0; i < 10; i++) for (let j = 0; j < 10; j++) studs.setMatrixAt(k++, m4.makeTranslation((i - 4.5) * PITCH, TOP, (j - 4.5) * PITCH))
  studs.castShadow = studs.receiveShadow = true
  rig.add(studs)

  // ── 歯車の塔。軸 0（下）が針、軸 5（上）が脱進機 ──
  // 奥行き（z）の層: 歯車 -10.7〜11.7 / 軸受けのリフトアーム 前 14.4・18.2、後 -13.2・-17 / 柱・足 -22.3 / 梁 -26.1 / 台のブロック -32〜-24
  const AX = [V(-16, TOP + 21.8)] // 下の軸は、台の上のテクニックブロックの穴（高さ 5.8）から 2 穴上
  for (const deg of [50, 78, 40, 74]) {
    const prev = AX[AX.length - 1]
    AX.push(prev.clone().add(V(16 * Math.cos((deg * Math.PI) / 180), 16 * Math.sin((deg * Math.PI) / 180))))
  }
  // 一番上（脱進機）は x = 24 に置く。枠の柱（x = ±32）がプレートのスタッドの格子にそろう
  {
    const prev = AX[AX.length - 1]
    const dx = 24 - prev.x
    AX.push(V(24, prev.y + Math.sqrt(16 * 16 - dx * dx)))
  }
  const plane = (k: number) => -9 + k * 3.8
  const bigTones: Tone[] = ['lbg', 'teal', 'lbg', 'coral', 'lbg']
  type Axle = { big: THREE.Mesh | null; small: THREE.Mesh | null; shaft: THREE.Mesh; big0: number; small0: number }
  const axles: Axle[] = AX.map((p, k) => ({
    // 組 (k, k+1): 上の軸 k+1 の 8T が、下の軸 k の 24T を回す（面 p_k）
    big: k < 5 ? put(rig, gearGeometry(24), bigTones[k], p.x, p.y, plane(k)) : null,
    small: k > 0 ? put(rig, gearGeometry(8), 'dbg', p.x, p.y, plane(k - 1)) : null,
    // 下の軸だけ、文字盤の針まで前に伸ばす
    shaft: k === 0 ? put(rig, axleGeometry(50), 'black', p.x, p.y, 3) : put(rig, axleGeometry(44), 'black', p.x, p.y, 0.5),
    big0: 0,
    small0: 0,
  }))
  for (let k = 0; k < 5; k++) {
    const d = AX[k].clone().sub(AX[k + 1])
    const [ps, pb] = meshPhase(8, 24, Math.atan2(d.y, d.x))
    axles[k + 1].small0 = ps
    axles[k].big0 = pb
  }
  const E = AX[5]
  const escape = put(rig, escapeWheelGeometry(24), 'mustard', E.x, E.y, plane(5))

  // 軸受け: 隣り合う軸は 16mm（2 穴）なので、3 穴のリフトアームで前後から挟んでつなぐ。隣どうしは層を交互にずらす
  for (let k = 0; k < 5; k++) {
    const d = AX[k + 1].clone().sub(AX[k])
    const phi = Math.atan2(d.y, d.x)
    beam(3, k % 2 ? 'dbg' : 'lbg', V(AX[k].x, AX[k].y, k % 2 ? -17 : -13.2), phi)
    beam(3, k % 2 ? 'dbg' : 'lbg', V(AX[k].x, AX[k].y, k % 2 ? 18.2 : 14.4), phi)
  }
  for (const p of AX.slice(1)) put(rig, cylinderZ(3, 2.6), 'coral', p.x, p.y, 21.6)

  // 上の軸（脱進機）は、右の柱の穴へ 2 穴のリフトアームでつなぐ
  {
    const hole = V(E.x + 8, TOP + 5.8 + 10 * 8)
    beamBetween(V(E.x, E.y, -17), V(hole.x, hole.y, -17), 'dbg')
    put(rig, pinGeometry(), 'black', hole.x, hole.y, -19.65)
  }

  // 台への固定: プレートの奥の列（z = -28）に 1×2 のテクニックブロックを 3 つ置き、
  // 下の軸から下ろした縦のリフトアームと、左右の柱の下端の穴を、ブロックの穴（高さ 5.8）にピンで留める
  const footX = [AX[0].x, -32, 32]
  for (const x of footX) {
    brick('b1x2', 'navy', x / PITCH - 1, -4)
    put(rig, cylinderZ(2.5, 0.3, 24), 'black', x, TOP + 5.8, -23.85)
    put(rig, pinGeometry(), 'black', x, TOP + 5.8, -24)
  }
  beam(3, 'dbg', V(AX[0].x, AX[0].y, -22.3), -Math.PI / 2)

  // ── 枠: 柱 2 本（14 穴）と、斜めの梁・てっぺんの梁。交わるところはピンで留める ──
  const xl = E.x - 56, xr = E.x + 8 // -32 と 32。てっぺんの梁の穴に、振り子の軸（E の真上）が来る
  const yTop = TOP + 5.8 + 13 * 8
  beam(14, 'dbg', V(xl, TOP + 5.8, -22.3), Math.PI / 2)
  beam(14, 'dbg', V(xr, TOP + 5.8, -22.3), Math.PI / 2)
  beamBetween(V(xl, TOP + 21.8, -26.1), V(xr, TOP + 69.8, -26.1), 'lbg') // 64 × 48 → 80（11 穴）
  beam(9, 'lbg', V(xl, yTop, -26.1), 0)
  for (const p of [V(xl, TOP + 21.8), V(xr, TOP + 69.8), V(xl, yTop), V(xr, yTop)]) put(rig, pinGeometry(), 'black', p.x, p.y, -24.2)
  const Q = V(E.x, yTop)
  put(rig, axleGeometry(56), 'black', Q.x, Q.y, 0)
  put(rig, cylinderZ(3, 2.6), 'coral', Q.x, Q.y, -28.7)

  // ── アンクルと振り子（一緒に揺れる） ──
  const swing = new THREE.Group()
  swing.position.copy(Q)
  rig.add(swing)
  const drop = Q.y - E.y
  for (const side of [-1, 1]) {
    const tip = V(side * 12.6 * Math.sin(0.62), -drop + 12.6 * Math.cos(0.62))
    const arm = put(swing, roundedBox(2.6, tip.length() + 2, 4, 0.6), 'navy', tip.x / 2, tip.y / 2, plane(5))
    arm.rotation.z = Math.atan2(tip.y, tip.x) - Math.PI / 2
    put(swing, cylinderZ(1.1, 5, 10), 'coral', tip.x, tip.y + 0.6, plane(5))
  }
  const rodLen = 82
  put(swing, new THREE.CylinderGeometry(0.9, 0.9, rodLen, 10), 'metal', 0, -rodLen / 2, 25)
  put(swing, cylinderZ(9, 3.4, 40), 'mustard', 0, -rodLen, 25)
  put(swing, cylinderZ(3.6, 4.6, 20), 'metal', 0, -rodLen, 25)

  // ── 文字盤（骨組みの輪と 12 の目盛り）と針。前の軸受けより手前 ──
  const P0 = AX[0]
  const ring = new THREE.Shape()
  ring.absarc(0, 0, 18, 0, TAU, false)
  const inner = new THREE.Path()
  inner.absarc(0, 0, 14.5, 0, TAU, true)
  ring.holes.push(inner)
  put(rig, new THREE.ExtrudeGeometry(ring, { depth: 2, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 2, curveSegments: 64 }), 'white', P0.x, P0.y, 22.4)
  for (let i = 0; i < 12; i++) {
    const a = (i * TAU) / 12
    const big = i % 3 === 0
    const tick = put(rig, new THREE.BoxGeometry(big ? 2 : 1.2, big ? 3.4 : 2.2, 1), 'navy', P0.x + 16.2 * Math.sin(a), P0.y + 16.2 * Math.cos(a), 25)
    tick.rotation.z = -a
  }
  const hand = (len: number, w: number, z: number) => {
    const h = new THREE.Group()
    h.position.set(P0.x, P0.y, z)
    rig.add(h)
    put(h, roundedBox(w, len, 1.2, 0.4), 'navy', 0, len / 2 - 3, 0)
    return h
  }
  const minuteHand = hand(15, 1.8, 25.8)
  const hourHand = hand(9.5, 2.6, 27.2)
  put(rig, cylinderZ(2, 3, 16), 'coral', P0.x, P0.y, 28)
  brick('b2x2', 'teal', 1, 2)
  brick('b1x2', 'coral', 3, 1, 1)

  // ── カメラ ──
  const camera = new THREE.PerspectiveCamera(26, 1, 10, 3000)
  const target = V(2, 60, 0)
  const baseDir = V(100, 90, 260).normalize()
  const up = V(0, 1, 0)
  let dist = 370
  let needsRender = true
  function resize() {
    const w = host.clientWidth
    const h = host.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // 縦に長い時計が収まる距離。横幅が狭いときはさらに引く
    dist = 82 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.min(1, camera.aspect / 0.9)
    camera.updateProjectionMatrix()
    needsRender = true
  }

  // ── 操作: ドラッグで回す（離すと惰性で少し回る）、カーソルで視点が少しずれる ──
  let yaw = 0
  let yawVel = 0
  let dragging = false
  let lastX = 0
  const pointer = new THREE.Vector2()
  const look = new THREE.Vector2()
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

  // ── 動き ──
  /** 日本時間の今の時刻から、針の角度（12 時が 0、時計回りが負） */
  function setHands() {
    const now = new Date(Date.now() + 9 * 3600 * 1000)
    const min = now.getUTCMinutes() + now.getUTCSeconds() / 60
    const hour = (now.getUTCHours() % 12) + min / 60
    minuteHand.rotation.z = -(min / 60) * TAU
    hourHand.rotation.z = -(hour / 12) * TAU
  }
  function pose(seconds: number) {
    const tt = seconds * TICKS_PER_SECOND
    swing.rotation.z = opts.reducedMotion ? 0 : SWING * Math.sin(Math.PI * tt)
    const k = Math.floor(tt)
    const steps = opts.reducedMotion ? 0 : k + ease((tt - k) / 0.14)
    const escAng = -steps * (TAU / 24)
    escape.rotation.z = escAng
    axles.forEach((a, i) => {
      // 脱進機（軸 5）から下へ 1/3 ずつ。隣どうしは逆回り
      const ang = escAng * Math.pow(3, i - 5) * ((5 - i) % 2 === 0 ? 1 : -1)
      if (a.big) a.big.rotation.z = a.big0 + ang
      if (a.small) a.small.rotation.z = a.small0 + ang
      a.shaft.rotation.z = ang
    })
    setHands()
  }

  // ── 描画: 画面に見えているあいだだけ回す ──
  let visible = true
  let raf = 0
  let readySent = false
  const t0 = performance.now()
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) loop()
  })
  io.observe(host)
  function loop() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(frame)
  }
  function frame(now: number) {
    if (!visible || document.hidden) return
    pose((now - t0) / 1000)
    if (!dragging) {
      yaw += yawVel
      yawVel *= 0.92
      if (Math.abs(yawVel) < 1e-4) yawVel = 0
    }
    rig.rotation.y = yaw
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
    // 振り子は止まらないので描き続ける。動きを減らす設定では、操作や切り替えがあるときだけ
    if (!opts.reducedMotion || dragging || yawVel !== 0 || needsRender || look.distanceTo(pointer) > 0.001) loop()
  }
  const ro = new ResizeObserver(() => {
    resize()
    loop()
  })
  ro.observe(host)
  // 動きを減らす設定でも、針は 1 分ごとに進める
  const minuteTimer = window.setInterval(() => {
    needsRender = true
    loop()
  }, 60_000)
  resize()
  loop()
  document.addEventListener('visibilitychange', loop)

  return {
    setTheme(theme) {
      for (const [tone, m] of materials) setBrickColor(m, PALETTE[theme][tone])
      shadowMat.opacity = theme === 'dark' ? 0.45 : 0.16
      needsRender = true
      loop()
    },
    dispose() {
      cancelAnimationFrame(raf)
      window.clearInterval(minuteTimer)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', loop)
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
