import Link from 'next/link'
import { PiArrowLeft } from 'react-icons/pi'

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-[7px] rounded-full bg-tile py-[7px] pl-[10px] pr-[14px] text-[12px] font-bold text-mute no-underline transition-colors duration-200 hover:text-ink"
    >
      <PiArrowLeft className="text-[15px] transition-transform duration-200 ease-out group-hover:-translate-x-[3px]" />
      {label}
    </Link>
  )
}
