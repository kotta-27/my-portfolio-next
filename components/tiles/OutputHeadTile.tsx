import { PiArrowDownRight } from 'react-icons/pi'
import { Tile } from '@/components/Tile'
import { TileLabel } from '@/components/TileLabel'

type Props = { label: string; blurb: string; count: number; tone: 'accent' | 'dark' | 'light' }

/** Output ビューの区切り。Projects のヘッダータイルと同じ文法 */
export function OutputHeadTile({ label, blurb, count, tone }: Props) {
  const muted = tone === 'light' ? 'text-mute' : 'text-white/65'
  const body = tone === 'light' ? 'text-mute' : 'text-white/75'
  return (
    <Tile tone={tone}>
      <TileLabel className={muted}>{label}</TileLabel>
      <span className={`absolute right-4 top-4 grid h-[30px] w-[30px] place-items-center rounded-full ${tone === 'light' ? 'bg-soft text-ink' : 'bg-white/15'}`}>
        <PiArrowDownRight className="text-[15px]" />
      </span>
      <p className="mt-auto text-[44px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">{count}</p>
      <p className={`text-[11.5px] leading-[1.5] ${body}`}>{blurb}</p>
    </Tile>
  )
}
