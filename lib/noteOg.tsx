import { ImageResponse } from 'next/og'

/*
 * 学習ノートの OGP 画像（1200x630）。Output のノートの表紙と同じ、濃い面にタイトルを大きく置く構図。
 * 日本語のタイトルを描くので、Noto Sans JP を使う文字だけに絞って取得する。satori で描くため Tailwind の代わりに tw 属性を使う。
 */

export const ogSize = { width: 1200, height: 630 }

type OgFont = { name: string; data: ArrayBuffer; weight: 500 | 800; style: 'normal' }

/** Google Fonts から TTF を取得する（satori は woff2 非対応なので古い UA で truetype を要求する） */
async function loadFont(family: string, weight: 500 | 800, text: string, name: string): Promise<OgFont | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`
    const css = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:1.0) Gecko/20100101 Firefox/1.0' } }).then((r) => r.text())
    const src = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1]
    if (!src) return null
    return { name, data: await fetch(src).then((r) => r.arrayBuffer()), weight, style: 'normal' }
  } catch {
    return null
  }
}

export async function renderNoteOg({ kicker, title, tags }: { kicker: string; title: string; tags: string[] }) {
  const text = `${kicker}${title}${tags.join('')}blog.kotap.dev·`
  const fonts = (
    await Promise.all([loadFont('Noto+Sans+JP', 800, text, 'Noto'), loadFont('Noto+Sans+JP', 500, text, 'Noto')])
  ).filter((f): f is OgFont => f !== null)
  // タイトルの長さで文字の大きさを変え、3 行に収める
  const titleSize = title.length > 24 ? 60 : title.length > 12 ? 64 : 88

  return new ImageResponse(
    (
      <div tw="flex h-full w-full bg-[#e5e9ef] p-8" style={{ fontFamily: 'Noto, sans-serif' }}>
        <div tw="flex h-full w-full flex-col justify-between rounded-[28px] bg-[#0d1b2a] px-16 py-14 text-white">
          <div tw="flex text-[26px] font-medium text-[#8a97a6]" style={{ letterSpacing: 2 }}>
            {kicker}
          </div>
          <div tw="flex font-extrabold leading-tight" style={{ fontSize: titleSize, letterSpacing: -1 }}>
            {title}
          </div>
          <div tw="flex items-end justify-between">
            <div tw="flex" style={{ gap: 12 }}>
              {tags.map((t) => (
                <div key={t} tw="flex rounded-[8px] bg-[#1f2c3c] px-5 py-2 text-[26px] font-medium text-[#c9d3dd]">
                  {t}
                </div>
              ))}
            </div>
            <div tw="flex items-center" style={{ gap: 18 }}>
              {/* 小さなブロックの山（ノートの表紙と同じ飾り） */}
              <div tw="flex flex-col items-center" style={{ gap: 6 }}>
                <div tw="flex h-[22px] w-[44px] rounded-[4px] bg-[#0c7a7c]" />
                <div tw="flex" style={{ gap: 6 }}>
                  <div tw="flex h-[22px] w-[44px] rounded-[4px] bg-[#c84a2c]" />
                  <div tw="flex h-[22px] w-[44px] rounded-[4px] bg-[#edf1f5]" />
                </div>
              </div>
              <div tw="flex text-[24px] font-medium text-[#8a97a6]">blog.kotap.dev</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length > 0 ? fonts : undefined },
  )
}
