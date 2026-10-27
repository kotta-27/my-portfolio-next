import { PiArrowUpRight } from 'react-icons/pi'
import { Thumb } from '@/components/Thumb'

type Og = { title: string | null; description: string | null; image: string | null; site: string | null }

const decode = (s: string) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')

/** リンク先の OGP（タイトル・説明・画像）を読む。1 日キャッシュ */
async function fetchOg(url: string): Promise<Og> {
  try {
    const html = await fetch(url, { next: { revalidate: 86400 }, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-bot/1.0)' } }).then((r) => r.text())
    const meta = (prop: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']*)["']`, 'i')) ??
        html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:${prop}["']`, 'i'))
      return m ? decode(m[1]) : null
    }
    return { title: meta('title'), description: meta('description') ?? meta('image:alt'), image: meta('image'), site: meta('site_name') }
  } catch {
    return { title: null, description: null, image: null, site: null }
  }
}

/** 本文中に置くリンクのカード。リンク先の OGP 画像とタイトルを出す。取れなければ渡したタイトルで出す */
export async function LinkPreview({ url, title, source }: { url: string; title: string; source: string }) {
  const og = await fetchOg(url)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-auto flex w-full max-w-[720px] flex-col overflow-hidden rounded-[10px] border border-ink/10 bg-tile no-underline transition-colors duration-150 hover:border-teal/50 sm:flex-row"
    >
      {og.image && (
        <span className="relative block aspect-[2/1] w-full shrink-0 self-center bg-soft sm:w-[260px] sm:border-r sm:border-ink/10">
          <Thumb src={og.image} alt="" sizes="(min-width: 640px) 260px, 100vw" className="object-cover" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-[6px] px-4 py-3">
        <span className="text-[11px] font-bold uppercase tracking-[.06em] text-mute">{source}</span>
        <span className="line-clamp-2 text-[14px] font-extrabold leading-[1.5] text-ink group-hover:text-teal">{title}</span>
        {og.description && <span className="line-clamp-2 text-[12.5px] leading-[1.6] text-mute">{og.description}</span>}
        <span className="mt-auto flex items-center gap-1 pt-1 font-mono text-[11px] text-mute">
          {url.replace(/^https?:\/\//, '')}
          <PiArrowUpRight className="shrink-0 text-[12px]" />
        </span>
      </span>
    </a>
  )
}
