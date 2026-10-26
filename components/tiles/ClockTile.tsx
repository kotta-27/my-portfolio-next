'use client'

import { useEffect, useState } from 'react'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

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

  return (
    <Tile>
      <TileLabel>{label}</TileLabel>
      <span aria-hidden className="stud-dot stud-dot--on absolute right-4 top-4 h-[12px] w-[12px]" />
      <p className="mt-auto font-mono text-[28px] font-medium leading-none tracking-[-0.02em] tabular-nums">
        {time}
      </p>
      <p className="text-[11.5px] text-mute">{sub}</p>
    </Tile>
  )
}
