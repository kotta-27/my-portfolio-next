import type { CSSProperties } from 'react'

/*
 * 地面（ベースプレート）の余白に、ところどころ置いたブロック。真上から見た形で、スタッドは地面の凸と同じ格子に乗る。
 * 位置はスタッド単位。side: 中身の左右どちら側か / gap: 中身の端からの距離 / top: ページ上端からの距離 / w×h: 大きさ
 * 中身（1100px）の外側の余白にだけ置くので、余白が狭い画面（xl 未満）では出さない。
 */
type Brick = { side: 'l' | 'r'; gap: number; top: number; w: number; h: number; tone: 'teal' | 'coral' | 'tile' | 'slab'; wide?: boolean }

const BRICKS: Brick[] = [
  { side: 'l', gap: 1, top: 6, w: 2, h: 1, tone: 'coral' },
  { side: 'r', gap: 1, top: 14, w: 1, h: 2, tone: 'teal' },
  { side: 'l', gap: 1, top: 31, w: 1, h: 1, tone: 'tile' },
  { side: 'l', gap: 3, top: 34, w: 2, h: 2, tone: 'teal', wide: true },
  { side: 'r', gap: 1, top: 44, w: 2, h: 1, tone: 'slab' },
  { side: 'r', gap: 2, top: 45, w: 1, h: 1, tone: 'coral' },
  { side: 'l', gap: 1, top: 62, w: 1, h: 2, tone: 'slab' },
  { side: 'r', gap: 1, top: 76, w: 2, h: 2, tone: 'tile' },
  { side: 'l', gap: 1, top: 93, w: 2, h: 1, tone: 'teal' },
  { side: 'r', gap: 3, top: 104, w: 2, h: 1, tone: 'coral', wide: true },
  { side: 'r', gap: 1, top: 121, w: 1, h: 1, tone: 'teal' },
  { side: 'l', gap: 2, top: 133, w: 1, h: 2, tone: 'coral' },
]

export function GroundBricks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block">
      {BRICKS.map((b, i) => (
        <span
          key={i}
          className={`ground-brick ground-brick--${b.tone} ${b.wide ? 'hidden 2xl:block' : ''}`}
          style={
            {
              '--x': b.side === 'l' ? `round(down, calc(50% - 550px - ${(b.gap + b.w) * 26}px), 26px)` : `round(up, calc(50% + 550px + ${b.gap * 26}px), 26px)`,
              '--y': `${b.top * 26}px`,
              '--w': b.w,
              '--h': b.h,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
