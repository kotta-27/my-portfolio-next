'use client'

import { useEffect, useState } from 'react'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

/*
 * 7 セグメントの数字（デジタル時計の表示）。点いていないセグメントも薄く描き、液晶らしく見せる。
 * 1 文字は 12×21 の枠。セグメントは a（上）から時計回りに b c d e f、g が中央。
 */
const H = (yc: number) => `2.2,${yc} 3.2,${yc - 1} 8.8,${yc - 1} 9.8,${yc} 8.8,${yc + 1} 3.2,${yc + 1}`
const V = (xc: number, y1: number, y2: number) => `${xc},${y1} ${xc + 1},${y1 + 1} ${xc + 1},${y2 - 1} ${xc},${y2} ${xc - 1},${y2 - 1} ${xc - 1},${y1 + 1}`
const SEGMENTS: Record<string, string> = {
  a: H(1.5),
  b: V(10.5, 2.2, 10.1),
  c: V(10.5, 10.9, 18.8),
  d: H(19.5),
  e: V(1.5, 10.9, 18.8),
  f: V(1.5, 2.2, 10.1),
  g: H(10.5),
}
const DIGITS: Record<string, string> = {
  '0': 'abcdef',
  '1': 'bc',
  '2': 'abdeg',
  '3': 'abcdg',
  '4': 'bcfg',
  '5': 'acdfg',
  '6': 'acdefg',
  '7': 'abc',
  '8': 'abcdefg',
  '9': 'abcdfg',
  '-': 'g',
}

function Digit({ ch }: { ch: string }) {
  const on = DIGITS[ch] ?? ''
  return (
    <svg viewBox="0 0 12 21" className="h-full w-auto">
      {Object.entries(SEGMENTS).map(([k, pts]) => (
        <polygon key={k} points={pts} className={on.includes(k) ? 'fill-teal' : 'fill-slab-fg/[0.07]'} />
      ))}
    </svg>
  )
}

export function ClockTile({ label, sub }: { label: string; sub: string }) {
  const [time, setTime] = useState<string>('--:--')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tokyo',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])

  const [h1, h2, , m1, m2] = time

  return (
    <Tile>
      <TileLabel>{label}</TileLabel>
      <span aria-hidden className="stud-dot stud-dot--on absolute right-4 top-4 h-[12px] w-[12px]" />
      {/* 液晶パネル。読み上げには時刻をそのまま渡す */}
      <div role="img" aria-label={`${time} ${sub}`} className="relative mx-auto my-auto flex w-fit items-end gap-2 rounded-[6px] bg-slab px-3 pb-[10px] pt-[12px]">
        <div aria-hidden className="flex h-[36px] -skew-x-6 items-center gap-[5px]">
          <Digit ch={h1} />
          <Digit ch={h2} />
          <span className="flex h-full flex-col justify-center gap-[9px]">
            <span className="clock-colon h-[4px] w-[4px] bg-teal" />
            <span className="clock-colon h-[4px] w-[4px] bg-teal" />
          </span>
          <Digit ch={m1} />
          <Digit ch={m2} />
        </div>
        <span aria-hidden className="font-mono text-[10px] font-bold leading-none text-teal/70">{sub}</span>
      </div>
    </Tile>
  )
}
