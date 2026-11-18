import { permanentRedirect } from 'next/navigation'

/** 作品のページは /works/<slug> に移した。前の URL は転送する */
export default async function OldProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  permanentRedirect(`/works/${encodeURIComponent(slug)}`)
}
