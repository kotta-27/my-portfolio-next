import Link from 'next/link'
import { PiArrowLeft } from 'react-icons/pi'

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-[7px] rounded-full border border-[#e4e1d8] bg-white py-[7px] pl-[10px] pr-[14px] text-[12px] font-medium text-[#666] no-underline shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-[#1a1a1a] hover:text-[#1a1a1a] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
    >
      <PiArrowLeft className="text-[15px] transition-transform duration-200 ease-out group-hover:-translate-x-[3px]" />
      {label}
    </Link>
  )
}
