import { getImageProps } from 'next/image'

/**
 * next/image の最適化 URL（縮小・AVIF/WebP）だけを借りる。width/height は付けず、
 * 表示サイズは CSS（max-w/max-h + object-contain）で決める。
 */
export function optimizedImage(
  src: string,
  alt: string,
  { width, sizes }: { width: number; sizes: string },
): { src: string; srcSet?: string; sizes?: string } {
  const { props } = getImageProps({ src, alt, width, height: Math.round(width * 0.625), sizes })
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes }
}
