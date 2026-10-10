import type { IconType } from 'react-icons'

const SIZE = {
  sm: { box: 'h-[24px] w-[24px]', icon: 'text-[13px]' },
  md: { box: 'h-[26px] w-[26px]', icon: 'text-[14px]' },
} as const

export function ArrowBadge({
  icon: Icon,
  size = 'sm',
}: {
  icon: IconType
  size?: keyof typeof SIZE
}) {
  const { box, icon } = SIZE[size]
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-soft text-mute transition-colors duration-200 group-hover:bg-ink group-hover:text-white ${box}`}
    >
      <Icon className={icon} />
    </span>
  )
}
