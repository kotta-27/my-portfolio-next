import Image from 'next/image'

type Props = {
  src: string
  alt: string
  /** 表示幅のヒント。next/image がこの幅に合わせた画像を選ぶ */
  sizes: string
  className?: string
}

/**
 * 親（position: relative でサイズ確定済み）を埋めるサムネイル。
 * ローカル画像は next/image で縮小・AVIF/WebP 化し、外部画像は遅延読み込みの <img> にする。
 */
export function Thumb({ src, alt, sizes, className = '' }: Props) {
  if (src.startsWith('/')) {
    return <Image src={src} alt={alt} fill sizes={sizes} className={className} />
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full ${className}`} />
  )
}
