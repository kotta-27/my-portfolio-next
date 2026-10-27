'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { GRAPH, HNSW_RUN, POINTS, QUERY, inLayer, layerEdges } from '@/components/notes/hnsw/demo'

/*
 * HNSW の層を立体で重ねて見せる。下が層 0（全部の点）、上ほど点が少ない。
 * 同じ点は縦の点線でつながっていて、探索は上の層から「止まった点」の真下へ降りていく。
 * step: 0 = 全体、1..n = 上の層から順にその層の探索まで、n+1 = 結果。
 */

const SIZE = 10
const GAP = 2.6
const LAYERS = HNSW_RUN.layers // 上の層から順

const toX = (v: number[]) => (v[0] - 0.5) * SIZE
const toZ = (v: number[]) => (v[1] - 0.5) * SIZE
const toY = (layer: number) => layer * GAP
const at = (node: number, layer: number) => new THREE.Vector3(toX(POINTS[node]), toY(layer), toZ(POINTS[node]))

/** globals.css の色トークン（"12 122 124"）を読む。ダークモードで値が変わる */
function token(name: string) {
  const [r, g, b] = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number)
  // CSS の値は sRGB。そのまま渡すと線形として扱われ、全部の色が白っぽくなる
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace)
}

/** 探索の道筋（上の層から）。層をまたぐところは、止まった点から真下へ降りる */
function routePoints(untilLayerIndex: number) {
  const pts: THREE.Vector3[] = []
  LAYERS.slice(0, untilLayerIndex + 1).forEach((l) => {
    const nodes = l.expands.map((e) => e.node).filter((n, i, a) => n !== a[i - 1])
    // 2 つ目以降の層の最初の点は、上の層で止まった点の真下。ここで縦に降りる線になる
    nodes.forEach((n) => pts.push(at(n, l.layer)))
  })
  return pts
}

export default function Layer3DCanvas({ step, onFail }: { step: number; onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const stepRef = useRef(step)
  const api = useRef<{ setStep: (s: number) => void } | null>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // WebGL が使えない環境では 3D を諦め、呼び出し側に 2D の図へ切り替えてもらう
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      onFail()
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)
    const labels = new CSS2DRenderer()
    labels.domElement.className = 'pointer-events-none absolute inset-0'
    el.appendChild(labels.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200)
    camera.position.set(15, 13, 17)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, toY(GRAPH.maxLevel) / 2, 0)
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.autoRotate = !still
    controls.autoRotateSpeed = 0.6
    controls.minPolarAngle = 0.25
    controls.maxPolarAngle = 1.45
    controls.addEventListener('start', () => (controls.autoRotate = false))
    // スマホでは縦のスワイプはページのスクロールに残し、横のドラッグだけで回す
    renderer.domElement.style.touchAction = 'pan-y'

    // 層ごとの静的な部分（面・点・つながり）と、step で変わる部分（道筋・強調）を分ける
    const base = new THREE.Group()
    const dynamic = new THREE.Group()
    scene.add(base, dynamic)
    const lineMats: LineMaterial[] = []

    const disposeGroup = (g: THREE.Group) => {
      g.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments || o instanceof THREE.Line || o instanceof Line2) {
          // 点の球は全部で共有しているので、ここでは捨てない
          if (o.geometry !== dot) o.geometry.dispose()
          const m = o.material as THREE.Material | THREE.Material[]
          ;(Array.isArray(m) ? m : [m]).forEach((x) => x.dispose())
        }
        if (o instanceof CSS2DObject) o.element.remove()
      })
      g.clear()
    }

    let colors = readColors()
    function readColors() {
      return { ink: token('--ink'), teal: token('--teal'), coral: token('--coral'), mute: token('--mute'), tile: token('--tile'), soft: token('--soft'), ground: token('--ground') }
    }

    const dot = new THREE.SphereGeometry(1, 14, 10)

    function buildBase() {
      disposeGroup(base)
      for (let l = 0; l <= GRAPH.maxLevel; l++) {
        const y = toY(l)
        // 面
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(SIZE + 1, SIZE + 1),
          new THREE.MeshBasicMaterial({ color: colors.ground, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }),
        )
        plane.rotation.x = -Math.PI / 2
        plane.position.y = y - 0.01
        plane.userData.layer = l
        base.add(plane)
        const frame = new THREE.LineSegments(new THREE.EdgesGeometry(plane.geometry), new THREE.LineBasicMaterial({ color: colors.mute, transparent: true, opacity: 0.55 }))
        frame.rotation.copy(plane.rotation)
        frame.position.copy(plane.position)
        frame.userData.frameOf = l
        base.add(frame)
        // ラベル
        const tag = document.createElement('span')
        tag.className = 'rounded-[5px] bg-tile/90 px-[6px] py-[1px] font-sans text-[11px] font-extrabold text-ink shadow-sm'
        tag.textContent = `層 ${l}（${inLayer(l).length} 点）`
        const label = new CSS2DObject(tag)
        label.position.set(-(SIZE + 1) / 2, y, -(SIZE + 1) / 2)
        base.add(label)
        // つながり
        const edges = layerEdges(l)
        const pos = new Float32Array(edges.length * 6)
        edges.forEach(([a, b], i) => {
          const pa = at(a, l)
          const pb = at(b, l)
          pos.set([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z], i * 6)
        })
        const eg = new THREE.BufferGeometry()
        eg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        base.add(new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: colors.ink, transparent: true, opacity: l === 0 ? 0.12 : 0.28 })))
        // 点
        const mat = new THREE.MeshBasicMaterial({ color: colors.mute })
        inLayer(l).forEach((n) => {
          const m = new THREE.Mesh(dot, mat)
          m.scale.setScalar(l === 0 ? 0.07 : 0.1)
          m.position.copy(at(n, l))
          base.add(m)
        })
      }
      // 同じ点を層の間で結ぶ縦の点線
      const vert: number[] = []
      GRAPH.levels.forEach((lv, n) => {
        if (lv < 1) return
        const a = at(n, 0)
        const b = at(n, lv)
        vert.push(a.x, a.y, a.z, b.x, b.y, b.z)
      })
      const vg = new THREE.BufferGeometry()
      vg.setAttribute('position', new THREE.Float32BufferAttribute(vert, 3))
      const vl = new THREE.LineSegments(vg, new THREE.LineDashedMaterial({ color: colors.mute, dashSize: 0.18, gapSize: 0.14, transparent: true, opacity: 0.45 }))
      vl.computeLineDistances()
      base.add(vl)
      // 探している場所: 全部の層を貫く赤い線と、各層の印
      const qg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(toX(QUERY), -0.4, toZ(QUERY)), new THREE.Vector3(toX(QUERY), toY(GRAPH.maxLevel) + 0.6, toZ(QUERY))])
      base.add(new THREE.Line(qg, new THREE.LineBasicMaterial({ color: colors.coral, transparent: true, opacity: 0.6 })))
      // 各層の印は 2D の図・凡例と同じ「＋」（薄い赤の丸の上に置く）
      // 下の層の印も上の面に隠れないよう、面より後に手前へ描く
      const barMat = new THREE.MeshBasicMaterial({ color: colors.coral, transparent: true, depthTest: false })
      const haloMat = new THREE.MeshBasicMaterial({ color: colors.coral, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false, depthTest: false })
      for (let l = 0; l <= GRAPH.maxLevel; l++) {
        const y = toY(l) + 0.02
        const halo = new THREE.Mesh(new THREE.CircleGeometry(0.5, 28), haloMat)
        halo.renderOrder = 8
        halo.rotation.x = -Math.PI / 2
        halo.position.set(toX(QUERY), y - 0.01, toZ(QUERY))
        base.add(halo)
        for (const rot of [0, Math.PI / 2]) {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.12), barMat)
          bar.renderOrder = 8
          bar.rotation.y = rot
          bar.position.set(toX(QUERY), y, toZ(QUERY))
          base.add(bar)
        }
      }
    }

    let reveal = 1
    let revealFrom = 0
    function buildDynamic(s: number, progress: number) {
      disposeGroup(dynamic)
      lineMats.length = 0
      const layerIdx = s - 1 // 0 = 一番上の層
      const done = Math.min(layerIdx, LAYERS.length - 1)
      // 面の強調
      base.children.forEach((o) => {
        if (o instanceof THREE.LineSegments && o.userData.frameOf !== undefined) {
          const active = s >= 1 && s <= LAYERS.length && LAYERS[layerIdx]?.layer === o.userData.frameOf
          const m = o.material as THREE.LineBasicMaterial
          m.color = active ? colors.teal : colors.mute
          m.opacity = active ? 1 : 0.55
        }
      })
      if (s === 0) return
      // 道筋と強調は、面に隠れないよう常に手前に描く
      // three.js は半透明の物体を不透明な物体の後に描くので、半透明の面より後に描かせるには
      // こちらも transparent 扱いにして renderOrder で順番を決める
      const front = (o: THREE.Mesh | Line2) => {
        o.renderOrder = 10
        const m = o.material as THREE.Material
        m.depthTest = false
        m.transparent = true
        return o
      }
      // 測った点: 2D の図と同じく「緑の輪」。層の面に寝かせて置く
      const ringGeo = new THREE.TorusGeometry(0.17, 0.035, 8, 24)
      const visitedMat = new THREE.MeshBasicMaterial({ color: colors.teal })
      LAYERS.slice(0, done + 1).forEach((l) =>
        l.expands.forEach((e) =>
          e.checked.forEach((n) => {
            const m = new THREE.Mesh(ringGeo, visitedMat)
            m.rotation.x = Math.PI / 2
            m.position.copy(at(n, l.layer))
            dynamic.add(front(m))
          }),
        ),
      )
      // 道筋（今の層のぶんだけ伸びていく）
      const prev = routePoints(done - 1)
      const all = routePoints(done)
      const grow = prev.length + Math.max(0, all.length - prev.length) * progress
      const visible = all.slice(0, Math.max(1, Math.floor(grow)))
      if (Math.floor(grow) < all.length && grow % 1 > 0) {
        const a = all[Math.floor(grow) - 1] ?? all[0]
        const b = all[Math.floor(grow)]
        visible.push(a.clone().lerp(b, grow % 1))
      }
      if (visible.length >= 2) {
        const geo = new LineGeometry()
        geo.setPositions(visible.flatMap((v) => [v.x, v.y, v.z]))
        // 下に背景色の太い線を敷いて縁取りにし、面や点の上でも道筋が浮いて見えるようにする
        const outline = new LineMaterial({ color: colors.tile, linewidth: 9 })
        const mat = new LineMaterial({ color: colors.teal, linewidth: 5 })
        for (const m of [outline, mat]) {
          m.resolution.set(el!.clientWidth, el!.clientHeight)
          lineMats.push(m)
        }
        const under = front(new Line2(geo, outline))
        under.renderOrder = 9
        dynamic.add(under)
        dynamic.add(front(new Line2(geo, mat)))
      }
      // 入口と、今いる点
      const entry = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), new THREE.MeshBasicMaterial({ color: colors.ink }))
      entry.position.copy(at(GRAPH.entry, GRAPH.maxLevel))
      dynamic.add(front(entry))
      const head = new THREE.Mesh(dot, new THREE.MeshBasicMaterial({ color: colors.teal }))
      head.scale.setScalar(0.24)
      head.position.copy(visible[visible.length - 1])
      dynamic.add(front(head))
    }

    function resize() {
      const w = el!.clientWidth
      const h = el!.clientHeight
      renderer.setSize(w, h)
      labels.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      lineMats.forEach((m) => m.resolution.set(w, h))
    }

    buildBase()
    buildDynamic(stepRef.current, 1)
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // テーマが変わったら色を読み直す
    const mo = new MutationObserver(() => {
      colors = readColors()
      buildBase()
      buildDynamic(stepRef.current, 1)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let start = performance.now()
    api.current = {
      setStep: (s) => {
        revealFrom = stepRef.current
        stepRef.current = s
        start = performance.now()
        reveal = still || s < revealFrom ? 1 : 0
        buildDynamic(s, reveal)
      },
    }

    let raf = 0
    const tick = (now: number) => {
      if (reveal < 1) {
        reveal = Math.min(1, (now - start) / 900)
        buildDynamic(stepRef.current, 1 - Math.pow(1 - reveal, 3))
      }
      controls.update()
      renderer.render(scene, camera)
      labels.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      controls.dispose()
      disposeGroup(base)
      disposeGroup(dynamic)
      dot.dispose()
      renderer.dispose()
      // GPU のコンテキストをすぐ返す（作り直しが続くとブラウザの上限に当たるため）
      renderer.forceContextLoss()
      renderer.domElement.remove()
      labels.domElement.remove()
      api.current = null
    }
    // 3D は最初の描画で 1 回だけ作る（onFail は親が固定で渡す）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (api.current && stepRef.current !== step) api.current.setStep(step)
  }, [step])

  return <div ref={host} className="relative h-[360px] w-full cursor-grab touch-pan-y active:cursor-grabbing sm:h-[460px]" />
}
