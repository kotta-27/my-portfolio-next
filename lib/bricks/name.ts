import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { PITCH, PLATE, createBrickMaterial, partGeometry, setBrickColor } from '@/lib/bricks/geometry'
import { axleGeometry, cylinderZ, gearGeometry, liftarmGeometry, meshPhase, pinGeometry, rackGeometry, roundedBox } from '@/lib/bricks/technic'

/*
 * ヒーローの名前「KOTA / MIZUNO」を 1×1 のブロックで 2 段に組んだものと、それを壊す仕掛け、そして壊れたブロックの行き先。
 *
 * 仕掛け: ページをスクロールするとラックが下がり、ピニオン（8T）→ 歯車（24T）と回る。歯車のピンがハンマーの尻を押し下げて頭を持ち上げ、
 * ピンが尻から外れた瞬間にハンマーが落ちて「A」を叩き、名前が崩れる。
 *
 * 行き先: 崩れたブロックは、そのままスクロールに付いて画面の中を下りていき、小さくなりながら、「作ったもの」の見出しの上の小さな英字「WORKS」に組み上がる。
 * 名前を組んでいたのと同じブロックを、ちょうど使い切る。スクロールを戻すと文字がほどけ、名前に戻る。
 * そのために canvas は画面全体に固定して重ね（操作は受けない）、名前と行き先の場所は、毎フレーム DOM の枠の位置から決める。
 *
 * ほかの見出しの英字（CAREER / OUTPUT）も同じ canvas にブロックで組む。こちらは別のブロックで、画面に入ると上から降ってきてはまる。
 *
 * クリックでもその場所から崩れ、こちらは床で跳ねて、少し待つと 1 列ずつ戻って組み上がる。
 * 物理は簡易なもの（ブロックどうしは当たらない）。画面に何も映らないあいだは描かない。
 * three は動的に読み込む（components/home/BrickName.tsx）。
 */

export type Theme = 'light' | 'dark'
export type Tone = 'plate' | 'navy' | 'teal' | 'coral' | 'mustard' | 'gray' | 'lbg' | 'dbg' | 'black'

export const PALETTE: Record<Theme, Record<Tone, string>> = {
  light: { plate: '#C9D0D8', navy: '#1B2B3D', teal: '#0C7A7C', coral: '#C84A2C', mustard: '#F4B01C', gray: '#66737F', lbg: '#A0A5A9', dbg: '#5B6064', black: '#26292C' },
  // 暗い地面の上で沈まないよう、暗い部品を一段明るくする（時計と同じ色）
  dark: { plate: '#2A3644', navy: '#E9EEF3', teal: '#2FA8A5', coral: '#E0603F', mustard: '#F4B01C', gray: '#8D949B', lbg: '#8D949B', dbg: '#5E6872', black: '#1E2124' },
}

/** 5 段の文字。X がブロック 1 個 */
const FONT: Record<string, string[]> = {
  K: ['X..X', 'X.X.', 'XX..', 'X.X.', 'X..X'],
  O: ['.XX.', 'X..X', 'X..X', 'X..X', '.XX.'],
  T: ['XXX', '.X.', '.X.', '.X.', '.X.'],
  A: ['.XX.', 'X..X', 'XXXX', 'X..X', 'X..X'],
  M: ['X...X', 'XX.XX', 'X.X.X', 'X...X', 'X...X'],
  I: ['XXX', '.X.', '.X.', '.X.', 'XXX'],
  Z: ['XXXX', '...X', '.XX.', 'X...', 'XXXX'],
  U: ['X..X', 'X..X', 'X..X', 'X..X', '.XX.'],
  N: ['X..X', 'XX.X', 'X.XX', 'X..X', 'X..X'],
}
type Letter = { ch: string; tone: Tone }
/** 上の段から。名は 1 文字ずつ色を変え、姓は灰色にして名を主役にする（文字のときの濃淡と同じ） */
const LINES: Letter[][] = [
  [
    { ch: 'K', tone: 'navy' },
    { ch: 'O', tone: 'teal' },
    { ch: 'T', tone: 'coral' },
    { ch: 'A', tone: 'mustard' },
  ],
  'MIZUNO'.split('').map((ch) => ({ ch, tone: 'gray' as const })),
]
/**
 * 見出しの小さな英字（WORKS / CAREER / OUTPUT）を、文字と台で組む。文字は灰、台は 2 段で、色を左から帯で入れる。
 *
 * WORKS だけは名前のブロックを使う。文字が灰 55 個、台が幅 25 × 2 段 = 50 個で、
 * 名前のブロック 105 個（灰 66・紺 10・ティール 10・コーラル 7・マスタード 12）をちょうど使い切るよう、台の帯の幅を決めてある。
 * ほかの単語は別のブロックで、同じ割合の帯にする。
 */
const FROM_NAME = 'WORKS'
const WORD_FONT: Record<string, string[]> = {
  ...FONT,
  W: ['X...X', 'X...X', 'X.X.X', 'XX.XX', 'X...X'],
  R: ['XXX.', 'X..X', 'XXX.', 'X.X.', 'X..X'],
  S: ['.XXX', 'X...', '.XX.', '...X', 'XXX.'],
  C: ['.XXX', 'X...', 'X...', 'X...', '.XXX'],
  E: ['XXXX', 'X...', 'XXX.', 'X...', 'XXXX'],
  P: ['XXX.', 'X..X', 'XXX.', 'X...', 'X...'],
}
const BASE_ROWS = 2
const WORD_ROWS = BASE_ROWS + 5
/** 見出しの文字のブロック 1 個の幅（px）。名前のブロックよりずっと小さい */
const WORD_STUD_PX = 8.8
// 台の色の帯（幅 25 のときの個数）。上の段はすべて色にして、灰の文字が台に溶けないようにする
const BASE_BANDS: Record<'top' | 'bottom', [Tone, number][]> = {
  top: [['navy', 5], ['teal', 5], ['mustard', 8], ['coral', 7]],
  bottom: [['navy', 5], ['teal', 5], ['mustard', 4], ['gray', 11]],
}
type Cell = { col: number; level: number; tone: Tone }
/** 単語のマス目（左下が 0, 0） */
function wordCells(word: string): Cell[] {
  const cells: Cell[] = []
  let x0 = 0
  for (const ch of word) {
    const glyph = WORD_FONT[ch]
    if (!glyph) continue
    glyph.forEach((row, r) => {
      row.split('').forEach((c, i) => {
        if (c === 'X') cells.push({ col: x0 + i, level: BASE_ROWS + 4 - r, tone: 'gray' })
      })
    })
    x0 += glyph[0].length + 1
  }
  const width = x0 - 1
  // 帯の幅は、幅 25 のときの個数を単語の幅に合わせて伸び縮みさせる（WORKS は幅 25 なのでそのまま）
  const row = (bands: [Tone, number][]) => {
    const out: Tone[] = []
    let edge = 0
    for (const [tone, n] of bands) {
      edge += n
      while (out.length < Math.round((edge / 25) * width)) out.push(tone)
    }
    return out
  }
  row(BASE_BANDS.bottom).forEach((tone, col) => cells.push({ col, level: 0, tone }))
  row(BASE_BANDS.top).forEach((tone, col) => cells.push({ col, level: 1, tone }))
  return cells
}

/** 文字の間と両端に 1 スタッドずつ空けた、1 段の幅（スタッド数） */
const lineWidth = (line: Letter[]) => line.reduce((sum, l) => sum + FONT[l.ch][0].length + 1, 1)

const BRICK = PLATE * 3
const TOP = PLATE
const STUD_H = 1.7
const LINE_HEIGHT = TOP + 5 * BRICK + STUD_H // プレートの底から文字の上のスタッドまで
const LINE_STEP = LINE_HEIGHT + 12 // 段と段の間を 12mm 空ける
const DEPTH = 3 // プレートの奥行き（スタッド数）

// ── 仕掛けの寸法（mm）。x は名前全体の中心から、y は上の段のプレートの底から ──
const TRIGGER = 0.7 // スクロールの進み（0〜1）がここに来たとき、ピンがハンマーの尻から外れる
const RACK_TRAVEL = 40 // スクロールの端から端までで、ラックが下がる距離
const PIVOT = { x: 72, y: 33 } // ハンマーの支点
const TAIL = 16 // 支点から尻の先まで
const HEAD = 40 // 支点から頭まで。水平に倒れると、頭が「A」の右の辺に当たる
const WHEEL = { x: 92, y: 27 } // 24T の歯車の軸
const PIN_R = 8 // 歯車の軸から、ハンマーを押すピンまで
const PINION = { x: 108, y: 27 } // 8T の歯車の軸。右側でラックとかみ合う
const GEAR_Z = 16 // 歯車とラックの面。プレートの手前の縁（12）より前に出して、ラックが下まで通れるようにする
const POST_Z = -6 // 支柱の面（文字の後ろ）
const REST_YAW = 0.2 // 止まっているときの向き。少し斜めから見て厚みを見せる
const ELEVATION = 0.17
const FALL_SECONDS = 2.3
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x))
const smooth = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t) }

export type BrickWord = { text: string; slot: HTMLElement; fallback: HTMLElement | null }

export type NameBench = {
  setTheme: (theme: Theme) => void
  /**
   * スクロールの進み。raw は「固定区間をどこまで進んだか」で、0 が始まり・1 が固定の終わり、その先も 1 を超えて増える。
   * length は固定区間の長さ（px）。
   */
  setProgress: (raw: number, length: number) => void
  dispose: () => void
}

type Piece = {
  mesh: THREE.Mesh
  tone: Tone
  home: THREE.Vector3
  vel: THREE.Vector3
  spin: THREE.Vector3
  from: THREE.Vector3
  fromQ: THREE.Quaternion
  fromScale: number
  col: number
  /** ハンマーで飛び散った先（名前の中の場所からのずれ） */
  scatter: THREE.Vector3
  axis: THREE.Vector3
  turns: number
  /** 行き先（WORKS の文字と台）の中の場所。枠の左下から。割り当てがなければ null */
  slot: THREE.Vector3 | null
  /** 行き先へ向かい始めるスクロールの進み（下の段ほど早い） */
  startAt: number
}

/**
 * host: 画面全体に固定した枠。ここに canvas を置く。操作は受けない
 * hit: 名前の枠。クリックとドラッグはここで受ける。名前はこの枠の位置に描く
 * words: 見出しの小さな英字をブロックで組む枠。slot に描き、fallback（もとの文字）は隠す。
 *        text が WORKS の枠は、崩れた名前のブロックの行き先になる（なければ、崩れたブロックは下へ落ちて消える）
 */
export function mountName(
  host: HTMLElement,
  hit: HTMLElement,
  opts: { theme: Theme; reducedMotion: boolean; onReady: () => void; onBreak: () => void; words?: BrickWord[] },
): NameBench {
  const words = opts.words ?? []
  const dest = words.find((w) => w.text === FROM_NAME)?.slot ?? null
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.classList.add('block', 'h-full', 'w-full')
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.65
  const key = new THREE.DirectionalLight('#fff4e6', 2.2)
  key.position.set(-120, 260, 160)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.03
  key.shadow.radius = 4
  scene.add(key, new THREE.HemisphereLight('#ffffff', '#8a7a68', 0.45))
  const shadowMat = new THREE.ShadowMaterial({ opacity: opts.theme === 'dark' ? 0.45 : 0.16 })

  const materials = new Map<Tone, THREE.MeshPhysicalMaterial>()
  const mat = (tone: Tone) => {
    let m = materials.get(tone)
    if (!m) {
      m = createBrickMaterial(PALETTE[opts.theme][tone])
      materials.set(tone, m)
    }
    return m
  }

  // ── 段ごとに、台のプレートと文字のブロック。左端をそろえて上から積む（上の段は宙に浮いた棚） ──
  const W = Math.max(...LINES.map(lineWidth))
  const rig = new THREE.Group()
  scene.add(rig)
  const plates = new THREE.Group()
  const bricks = new THREE.Group()
  rig.add(plates, bricks)
  const studProfile = [[0, 0], [2.4, 0], [2.4, 1.42], [2.32, 1.6], [2.12, 1.7], [0, 1.7]].map(([a, b]) => new THREE.Vector2(a, b))
  const studGeo = new THREE.LatheGeometry(studProfile, 24)
  const m4 = new THREE.Matrix4()
  const pieces: Piece[] = []
  LINES.forEach((line, li) => {
    // プレートはどの段も一番広い段の幅にする（上の段の右の空きに仕掛けを載せる）。文字は左端にそろえる
    const w = W
    const left = (-W / 2) * PITCH
    const cx = left + (w * PITCH) / 2
    const y0 = (LINES.length - 1 - li) * LINE_STEP
    const plate = new THREE.Mesh(roundedBox(w * PITCH - 0.2, PLATE, DEPTH * PITCH - 0.2, 0.45), mat('plate'))
    plate.position.set(cx, y0 + PLATE / 2, 0)
    plate.castShadow = plate.receiveShadow = true
    const studs = new THREE.InstancedMesh(studGeo, mat('plate'), w * DEPTH)
    for (let i = 0, k = 0; i < w; i++) for (let j = 0; j < DEPTH; j++) studs.setMatrixAt(k++, m4.makeTranslation(left + (i + 0.5) * PITCH, y0 + TOP, (j + 0.5 - DEPTH / 2) * PITCH))
    studs.castShadow = studs.receiveShadow = true
    plates.add(plate, studs)
    let x0 = 1
    for (const { ch, tone } of line) {
      FONT[ch].forEach((row, r) => {
        row.split('').forEach((c, i) => {
          if (c !== 'X') return
          const mesh = new THREE.Mesh(partGeometry('b1x1'), mat(tone))
          mesh.position.set(left + (x0 + i + 0.5) * PITCH, y0 + TOP + (4 - r) * BRICK, 0)
          mesh.castShadow = mesh.receiveShadow = true
          bricks.add(mesh)
          pieces.push({ mesh, tone, home: mesh.position.clone(), vel: new THREE.Vector3(), spin: new THREE.Vector3(), from: new THREE.Vector3(), fromQ: new THREE.Quaternion(), fromScale: 1, col: x0 + i, scatter: new THREE.Vector3(), axis: new THREE.Vector3(1, 0, 0), turns: 0, slot: null, startAt: 0 })
        })
      })
      x0 += FONT[ch][0].length + 1
    }
  })

  // 影を受ける床。名前の足元と、行き先の足元
  const nameFloor = new THREE.Mesh(new THREE.PlaneGeometry(900, 500).rotateX(-Math.PI / 2), shadowMat)
  nameFloor.receiveShadow = true
  // 行き先の床は足元だけの大きさにする（上にある名前の台の影まで拾わないように）
  const destFloor = new THREE.Mesh(new THREE.PlaneGeometry(330, 110).rotateX(-Math.PI / 2), shadowMat)
  destFloor.receiveShadow = true
  rig.add(nameFloor, destFloor)

  // ── 行き先のマス目を、同じ色のブロックに 1 個ずつ割り当てる。下の段ほど早く向かう ──
  {
    const spare = new Map<Tone, Piece[]>()
    for (const p of [...pieces].sort(() => Math.random() - 0.5)) spare.set(p.tone, [...(spare.get(p.tone) ?? []), p])
    const top = WORD_ROWS - 1
    for (const cell of wordCells(FROM_NAME)) {
      const p = spare.get(cell.tone)?.pop()
      if (!p) continue
      p.slot = new THREE.Vector3((cell.col + 0.5) * PITCH, cell.level * BRICK, 0)
      p.startAt = 0.42 + 0.36 * (cell.level / top) + Math.random() * 0.03
    }
  }

  // ── ほかの見出しの英字。単語ごとのグループに組んでおき、毎フレーム枠の位置と大きさに合わせる ──
  const extras = words
    .filter((w) => w.slot !== dest)
    .map((w) => {
      const group = new THREE.Group()
      rig.add(group)
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(380, 110).rotateX(-Math.PI / 2), shadowMat)
      floor.position.x = 120
      floor.receiveShadow = true
      group.add(floor)
      const cells = wordCells(w.text)
      const studs = Math.max(...cells.map((c) => c.col)) + 1
      const parts = cells.map((cell) => {
        const mesh = new THREE.Mesh(partGeometry('b1x1'), mat(cell.tone))
        mesh.position.set((cell.col + 0.5) * PITCH, cell.level * BRICK, 0)
        mesh.castShadow = mesh.receiveShadow = true
        group.add(mesh)
        // 下の段から、左から順に降ってくる
        return { mesh, y: cell.level * BRICK, at: (cell.level / WORD_ROWS) * 0.6 + (cell.col / studs) * 0.25 }
      })
      return { slot: w.slot, group, parts, studs }
    })

  // ── 仕掛け: ラック → ピニオン → 歯車（ピン付き）→ ハンマー ──
  const Y0 = (LINES.length - 1) * LINE_STEP
  const mech = new THREE.Group()
  mech.position.y = Y0
  rig.add(mech)
  const part = (parent: THREE.Object3D, geo: THREE.BufferGeometry, tone: Tone, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat(tone))
    m.position.set(x, y, z)
    m.castShadow = m.receiveShadow = true
    parent.add(m)
    return m
  }
  // 支柱（縦のリフトアーム。一番上の穴が軸の高さ）
  for (const at of [PIVOT, WHEEL, PINION]) part(mech, liftarmGeometry(4), 'dbg', at.x, at.y - 24, POST_Z).rotation.z = Math.PI / 2
  part(mech, axleGeometry(GEAR_Z - POST_Z + 8), 'black', WHEEL.x, WHEEL.y, (GEAR_Z + POST_Z) / 2)
  part(mech, axleGeometry(GEAR_Z - POST_Z + 8), 'black', PINION.x, PINION.y, (GEAR_Z + POST_Z) / 2)
  part(mech, cylinderZ(2.3, 12), 'black', PIVOT.x, PIVOT.y, POST_Z / 2)
  const [pinion0, wheel0] = meshPhase(8, 24, Math.PI) // ピニオンから見て歯車は左
  const wheel = new THREE.Group()
  wheel.position.set(WHEEL.x, WHEEL.y, 0)
  mech.add(wheel)
  part(wheel, gearGeometry(24), 'lbg', 0, 0, GEAR_Z).rotation.z = wheel0
  part(wheel, pinGeometry(GEAR_Z), 'coral', PIN_R, 0, GEAR_Z / 2) // 歯車の面からハンマーの面（z = 0）まで届くピン
  const pinion = part(mech, gearGeometry(8), 'dbg', PINION.x, PINION.y, GEAR_Z)
  const RACK_LEN = RACK_TRAVEL + 22
  const rackY0 = PINION.y - 10 // スクロールの最初で、ラックの下端がある高さ
  const rack = part(mech, rackGeometry(RACK_LEN), 'mustard', PINION.x + 4, rackY0, GEAR_Z)
  const hammer = new THREE.Group()
  hammer.position.set(PIVOT.x, PIVOT.y, 0)
  mech.add(hammer)
  part(hammer, liftarmGeometry((TAIL + HEAD) / 8 + 1), 'lbg', -TAIL, 0, 0) // 穴は尻の先から頭まで 8mm おき
  part(hammer, roundedBox(9, 14, 8, 0.8), 'coral', HEAD, 0, 0)

  /** 歯車の向き a（ピンのある角度）のとき、ピンに押されたハンマーの傾き。ピンが尻に届かなければ 0（倒れたまま） */
  function liftAt(a: number) {
    const qx = WHEEL.x + PIN_R * Math.cos(a) - PIVOT.x
    const qy = WHEEL.y + PIN_R * Math.sin(a) - PIVOT.y
    if (qy > 0 || qx <= 0 || Math.hypot(qx, qy) > TAIL) return 0
    return Math.atan2(-qy, qx)
  }
  // ピンが尻から外れる向きを探しておく（ピンが左側を下りていく間のどこか）
  let releaseAngle = Math.PI
  for (let a = Math.PI * 0.6; a < Math.PI * 1.5; a += 0.002) {
    if (liftAt(a) > 0) releaseAngle = a
    else if (releaseAngle !== Math.PI && liftAt(a) === 0) break
  }
  const wheelAngle = (progress: number) => releaseAngle + 0.004 - ((TRIGGER - progress) * RACK_TRAVEL) / 12
  const headPoint = new THREE.Vector3(PIVOT.x - HEAD, Y0 + PIVOT.y, 0) // 倒れたときの頭の位置（rig の中の座標）

  // ── カメラ（平行投影）。画面の中心が原点で、1mm が scale px。少し上から見下ろす ──
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 3000)
  const centre = new THREE.Vector3(0, ((LINES.length - 1) * LINE_STEP + LINE_HEIGHT) / 2, 0) // 名前の枠の中心にあたる、rig の中の点
  const cosE = Math.cos(ELEVATION)
  const sinE = Math.sin(ELEVATION)
  let scale = 1
  let vw = 1
  let vh = 1
  function resize() {
    vw = host.clientWidth
    vh = host.clientHeight
    const bw = hit.clientWidth
    if (!vw || !vh || !bw) return
    renderer.setSize(vw, vh, false)
    scale = (bw * 0.97) / (W * PITCH)
    const halfW = vw / scale / 2
    const halfH = vh / scale / 2
    camera.left = -halfW
    camera.right = halfW
    camera.top = halfH
    camera.bottom = -halfH
    camera.position.set(0, sinE * 900, cosE * 900)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    const sc = key.shadow.camera
    sc.left = -halfW - 60
    sc.right = halfW + 60
    sc.top = halfH + 60
    sc.bottom = -halfH - 60
    sc.near = 10
    sc.far = 1200
    sc.updateProjectionMatrix()
  }

  // ── 状態 ──
  // home: 名前に組んである / fall: クリックで崩れて落ちている / back: 名前へ戻っている途中
  // loose: ハンマーで崩れた。場所はスクロールの進みで決まる（飛び散る → 画面の中を下りる → WORKS に組み上がる）
  type Phase = 'home' | 'fall' | 'back' | 'loose'
  let phase: Phase = 'home'
  let clock = 0
  let intro = false // 最初の組み上げ中。自分の番が来るまでブロックを隠す
  let progress = 0 // 固定区間の中の進み（0〜1）
  let raw = 0
  let runway = 1
  const identity = new THREE.Quaternion()
  const dq = new THREE.Quaternion()
  const axis = new THREE.Vector3()
  const tmp = new THREE.Vector3()
  const tumble = new THREE.Quaternion()

  /** クリックで崩す: rig の中の座標 c から外へ弾く */
  function burst(c: THREE.Vector3) {
    for (const p of pieces) {
      const d = p.home.clone().sub(c)
      d.y += 14
      const dist = d.length()
      d.normalize().multiplyScalar(230 / (1 + dist / 26) + 36 + Math.random() * 44)
      d.y += 80 + Math.random() * 50
      d.z += (Math.random() - 0.5) * 130
      p.vel.copy(d)
      p.spin.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(14)
    }
    phase = 'fall'
    clock = 0
    opts.onBreak()
    loop()
  }
  /** ハンマーで崩す: 叩いた点から外へ飛び散った先を決める。その後の場所はスクロールで決まる */
  function shatter(c: THREE.Vector3, instant = false) {
    for (const p of pieces) {
      const d = p.home.clone().sub(c)
      d.y += 10
      const dist = d.length()
      d.normalize().multiplyScalar(70 / (1 + dist / 40) + 16 + Math.random() * 26)
      d.z = (Math.random() - 0.5) * 40
      p.scatter.copy(d)
      p.axis.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
      p.turns = 3 + Math.random() * 5
    }
    phase = 'loose'
    clock = instant ? 10 : 0
    opts.onBreak()
    loop()
  }
  function startReturn() {
    for (const p of pieces) {
      p.mesh.visible = true
      p.from.copy(p.mesh.position)
      p.fromQ.copy(p.mesh.quaternion)
      p.fromScale = p.mesh.scale.x
    }
    phase = 'back'
    clock = 0
  }
  function step(dt: number) {
    clock += dt
    if (phase === 'fall') {
      for (const p of pieces) {
        p.vel.y -= 620 * dt
        p.mesh.position.addScaledVector(p.vel, dt)
        const speed = p.spin.length()
        if (speed > 0.01) p.mesh.quaternion.premultiply(dq.setFromAxisAngle(axis.copy(p.spin).divideScalar(speed), speed * dt))
        // 上の段のブロックも、一番下の床まで落ちて跳ね返る
        if (p.mesh.position.y < 2 && p.vel.y < 0) {
          p.mesh.position.y = 2
          p.vel.y *= -0.32
          p.vel.x *= 0.62
          p.vel.z *= 0.62
          p.spin.multiplyScalar(0.5)
        }
      }
      if (clock > FALL_SECONDS) startReturn()
    } else if (phase === 'back') {
      let done = true
      for (const p of pieces) {
        // 左の列から順に、弧を描いて戻る
        const k = clamp01((clock - p.col * 0.035) / 0.6)
        if (k < 1) done = false
        const e = ease(k)
        p.mesh.position.lerpVectors(p.from, p.home, e)
        p.mesh.position.y += Math.sin(Math.PI * e) * 26
        p.mesh.quaternion.slerpQuaternions(p.fromQ, identity, e)
        p.mesh.scale.setScalar(p.fromScale + (1 - p.fromScale) * e)
        p.mesh.visible = !intro || k > 0
      }
      if (done) {
        phase = 'home'
        intro = false
      }
    }
  }

  /**
   * ハンマーで崩れたブロックの場所（rig の中の座標）。
   * u は行き先までの道のりの進み: 0 = 叩いた瞬間のスクロール位置、1 = 行き先の枠が画面の真ん中あたりに来た位置。
   * 前半は、飛び散ったまま画面に付いて下りる（ページは上へ流れるので、ページに対しては落ちていく）。後半は、下の段（台）から順に行き先の場所へ入る。
   */
  /** 画面の中の点（px）→ rig の中の座標（z = 0 の面）。rig は名前の中心（cx, cy）を軸に yaw だけ回っている */
  function toRig(px: number, py: number, cx: number, cy: number, out: THREE.Vector3) {
    const x = (px - cx) / scale / Math.cos(rig.rotation.y)
    const up = -(py - cy) / scale
    return out.set(x, centre.y + (up - x * Math.sin(rig.rotation.y) * sinE) / cosE, 0)
  }
  /** ほかの見出しの英字を、枠の位置に置く。枠が画面の下から入ってくるのに合わせて、ブロックが降ってきてはまる */
  function placeExtras(cx: number, cy: number) {
    let any = false
    const small = WORD_STUD_PX / PITCH / scale
    for (const ex of extras) {
      const r = ex.slot.getBoundingClientRect()
      const on = r.bottom > -40 && r.top < vh + 40
      ex.group.visible = on
      if (!on) continue
      any = true
      toRig(r.left, r.bottom, cx, cy, ex.group.position)
      ex.group.scale.setScalar(small)
      const v = opts.reducedMotion ? 1 : clamp01((vh * 0.96 - r.top) / (vh * 0.34))
      for (const part of ex.parts) {
        const k = clamp01((v - part.at) / 0.2)
        part.mesh.visible = k > 0
        part.mesh.position.y = part.y + (1 - ease(k)) * 46
      }
    }
    return any
  }
  const destAt = new THREE.Vector3()
  let flight = 0 // 今の u（描くかどうかの判断に使う）
  function placeLoose(nameY: number, destRect: DOMRect | null, cx: number, cy: number) {
    const past = (raw - TRIGGER) * runway // 叩いた位置から先へ進んだ量（px）
    let u = 0
    if (destRect) {
      const remain = destRect.top + destRect.height / 2 - vh * 0.56 // 行き先の枠が画面の真ん中あたりに来るまでの残り（px）
      u = remain <= 0 ? 1 : clamp01(past / (past + remain))
      // 行き先の枠の左下 → rig の中の座標。rig は名前の中心を軸に yaw だけ回っている
      const x = (destRect.left - cx) / scale / Math.cos(rig.rotation.y)
      const up = -(destRect.bottom - cy) / scale
      destAt.set(x, centre.y + (up - x * Math.sin(rig.rotation.y) * sinE) / cosE, 0)
      destFloor.position.set(destAt.x + 40, destAt.y, 0)
    } else u = clamp01(past / (vh * 1.2))
    flight = u
    const small = WORD_STUD_PX / PITCH / scale // 見出しの文字のブロックは、名前のブロックの何倍か
    const out = 1 - Math.exp(-5 * clock) // 叩かれて飛び散る（時間で進む）
    // 固定が終わると名前はページと一緒に上へ流れる。ブロックは画面に付いたままにしたいので、名前が流れた分を戻す
    const stay = (Math.max(0, raw - 1) * runway) / scale / cosE
    // 画面の下寄りへゆっくり沈む
    const sink = ((vh * 0.6 - nameY) / scale / cosE) * smooth(u * 2.4)
    for (const p of pieces) {
      tmp.copy(p.home).addScaledVector(p.scatter, out)
      tmp.y += -stay - Math.max(0, sink) * (0.75 + (p.col % 5) * 0.08)
      tumble.setFromAxisAngle(p.axis, p.turns * (out * 0.6 + u * 2.2))
      if (p.slot && destRect) {
        // 行き先の文字は名前より小さい。向かいながら縮む
        const w = smooth((u - p.startAt) / 0.2)
        p.mesh.position.set(destAt.x + p.slot.x * small, destAt.y + p.slot.y * small, p.slot.z * small).sub(tmp).multiplyScalar(w).add(tmp)
        p.mesh.quaternion.slerpQuaternions(tumble, identity, w)
        p.mesh.scale.setScalar(1 + (small - 1) * w)
        p.mesh.visible = true
      } else {
        // 行き先がないブロックは、そのまま下へ落ちて画面の外へ
        tmp.y -= (u * vh * 1.4) / scale
        p.mesh.position.copy(tmp)
        p.mesh.quaternion.copy(tumble)
        p.mesh.visible = u < 1
      }
    }
  }

  // ── 仕掛けの動き: ラックと歯車はスクロールの位置そのまま。ハンマーはピンに押し上げられ、外れると重さで落ちる ──
  let lift = 0 // 今のハンマーの傾き
  let liftVel = 0
  let armed = false // 十分に持ち上がった。次に落ちたら叩く
  let pending = false // 叩いたとき名前がまだ組み上がる途中だった。組み上がってから崩す
  function moveMechanism(dt: number) {
    const a = wheelAngle(progress)
    wheel.rotation.z = a
    pinion.rotation.z = pinion0 - 3 * a
    rack.position.y = rackY0 - RACK_TRAVEL * progress
    const goal = liftAt(a)
    if (goal >= lift) {
      lift += (goal - lift) * Math.min(1, dt * 18)
      liftVel = 0
      if (lift > 0.25) armed = true
    } else {
      liftVel += 90 * dt
      lift = Math.max(goal, lift - liftVel * dt)
      if (lift === goal) {
        if (goal === 0 && armed) {
          armed = false
          // 叩くのは、先へスクロールしてピンが外れたときだけ。戻す向きではピンに支えられたままゆっくり下りる
          if (progress >= TRIGGER && !opts.reducedMotion) pending = true
        }
        liftVel = 0
      }
    }
    if (pending && phase === 'home') {
      pending = false
      if (progress >= TRIGGER) shatter(headPoint)
    }
    hammer.rotation.z = Math.PI - lift
    return Math.abs(goal - lift) > 0.0005 || pending
  }

  // ── 操作: クリックで崩す、横にドラッグで回す（離すと元の向きに戻る） ──
  let yaw = REST_YAW
  let drag: { x: number; moved: number } | null = null
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const onDown = (e: PointerEvent) => {
    drag = { x: e.clientX, moved: 0 }
    hit.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent) => {
    if (!drag) return
    const dx = e.clientX - drag.x
    drag.x = e.clientX
    drag.moved += Math.abs(dx)
    if (drag.moved > 6) {
      yaw = Math.min(1.2, Math.max(-1.2, yaw + dx * 0.008))
      loop()
    }
  }
  const onUp = (e: PointerEvent) => {
    if (!drag) return
    const wasClick = drag.moved <= 6
    drag = null
    if (hit.hasPointerCapture(e.pointerId)) hit.releasePointerCapture(e.pointerId)
    if (wasClick && phase === 'home' && !opts.reducedMotion) {
      ndc.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      const hitPoint = ray.intersectObjects([bricks, plates], true)[0]?.point
      burst(hitPoint ? rig.worldToLocal(hitPoint.clone()) : centre.clone())
    }
    loop()
  }
  // キーボード（Enter / Space）で押したときは、真ん中から崩す
  const onClick = (e: MouseEvent) => {
    if (e.detail === 0 && phase === 'home' && !opts.reducedMotion) burst(centre.clone())
  }
  hit.addEventListener('pointerdown', onDown)
  hit.addEventListener('pointermove', onMove)
  hit.addEventListener('pointerup', onUp)
  hit.addEventListener('pointercancel', onUp)
  hit.addEventListener('click', onClick)

  // ── 描画: 画面に何か映っていて、動いているあいだだけ ──
  let raf = 0
  let last = 0
  let needsRender = true
  let readySent = false
  let blank = false // 最後に描いた絵が空だった（何も映っていないあいだ、描き直さない）
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
    const mechMoving = moveMechanism(dt)
    if (phase === 'fall' || phase === 'back') step(dt)
    if (phase === 'loose') {
      clock += dt
      // 叩く前の位置まで戻ったら、名前へ戻す
      if (progress <= TRIGGER - 0.05) startReturn()
    }
    if (!drag) yaw += (REST_YAW - yaw) * Math.min(1, dt * 5)
    rig.rotation.y = yaw

    // 名前の枠の位置（画面の中）に rig を合わせる。rig の中の点 centre が、枠の中心に映る
    const nr = hit.getBoundingClientRect()
    const cx = nr.left + nr.width / 2
    const cy = nr.top + nr.height / 2
    rig.position.set((cx - vw / 2) / scale, -(cy - vh / 2) / scale / cosE - centre.y, 0)
    const rr = dest ? dest.getBoundingClientRect() : null
    if (phase === 'loose') placeLoose(cy + Math.max(0, raw - 1) * runway, rr, cx, cy)

    const nameOnScreen = nr.bottom > -vh * 0.15 && nr.top < vh * 1.15
    const destOnScreen = !!rr && rr.bottom > -40 && rr.top < vh + 40
    const extrasOnScreen = placeExtras(cx, cy)
    const flying = phase === 'loose' && flight < 1
    // 名前が画面の外にあるときは、台と仕掛けを消す（遠くから行き先の足元へ影だけが落ちてくるのを防ぐ）
    plates.visible = mech.visible = nameFloor.visible = nameOnScreen
    if (nameOnScreen || flying || (phase === 'loose' && destOnScreen) || extrasOnScreen) {
      renderer.render(scene, camera)
      blank = false
    } else if (!blank) {
      renderer.clear()
      blank = true
    }
    needsRender = false
    if (!readySent) {
      readySent = true
      opts.onReady()
    }
    const settling = phase === 'loose' && clock < 1.2
    if (phase === 'fall' || phase === 'back' || settling || mechMoving || drag || Math.abs(yaw - REST_YAW) > 0.001 || needsRender) loop()
    else last = 0
  }
  const wake = () => {
    needsRender = true
    loop()
  }
  const ro = new ResizeObserver(() => {
    resize()
    wake()
  })
  ro.observe(host)
  ro.observe(hit)
  window.addEventListener('scroll', wake, { passive: true })
  document.addEventListener('visibilitychange', loop)

  for (const w of words) {
    w.slot.hidden = false
    if (w.fallback) w.fallback.hidden = true
  }
  resize()
  // 最初は、上から 1 列ずつ降りてきて組み上がる
  if (!opts.reducedMotion) {
    for (const p of pieces) {
      p.mesh.position.set(p.home.x, p.home.y + 90 + Math.random() * 30, p.home.z)
      p.mesh.visible = false
    }
    startReturn()
    for (const p of pieces) p.mesh.visible = false
    intro = true
  }
  loop()

  let first = true
  return {
    setTheme(theme) {
      for (const [tone, m] of materials) setBrickColor(m, PALETTE[theme][tone])
      shadowMat.opacity = theme === 'dark' ? 0.45 : 0.16
      wake()
    },
    setProgress(value, length) {
      if (opts.reducedMotion) return
      raw = value
      runway = length
      progress = clamp01(value)
      // ページの途中で読み込まれた（すでに叩いた位置を過ぎている）ときは、崩れた状態から始める
      if (first && progress >= TRIGGER) {
        intro = false
        shatter(headPoint, true)
      }
      first = false
      wake()
    },
    dispose() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', wake)
      document.removeEventListener('visibilitychange', loop)
      hit.removeEventListener('pointerdown', onDown)
      hit.removeEventListener('pointermove', onMove)
      hit.removeEventListener('pointerup', onUp)
      hit.removeEventListener('pointercancel', onUp)
      hit.removeEventListener('click', onClick)
      for (const w of words) {
        w.slot.hidden = true
        if (w.fallback) w.fallback.hidden = false
      }
      for (const m of materials.values()) m.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    },
  }
}
