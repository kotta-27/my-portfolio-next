import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

// OGP 画像 (1200x630)。satori で描画するため、ここでは Tailwind の代わりに `tw` 属性を使う。
export const alt = 'Kota Mizuno — Software Engineer, Tokyo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// text= でサブセット化すると uppercase 変換に必要な大文字グリフが欠けるため、フォント全体を取得する
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800'

/** Google Fonts から TTF を取得する（satori は woff2 非対応なので古い UA で truetype を要求する） */
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(FONT_CSS, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:1.0) Gecko/20100101 Firefox/1.0' },
    }).then((r) => r.text())
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1]
    if (!url) return null
    return await fetch(url).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

async function loadPortrait(): Promise<string> {
  const buf = await readFile(path.join(process.cwd(), 'public', 'mepic2.png'))
  return `data:image/png;base64,${buf.toString('base64')}`
}

export default async function Image() {
  const [font, portrait] = await Promise.all([loadDisplayFont(), loadPortrait()])

  return new ImageResponse(
    (
      <div tw="flex h-full w-full bg-[#e5e9ef] p-10" style={{ fontFamily: 'Jakarta, sans-serif', gap: 20 }}>
        {/* 左: 名前の大タイル */}
        <div tw="flex flex-1 flex-col justify-between rounded-[36px] bg-[#0d1b2a] p-14">
          <div tw="flex text-[22px] font-extrabold uppercase text-[#8fa0b3]" style={{ letterSpacing: 2 }}>
            Software Engineer · Tokyo, Japan
          </div>
          <div tw="flex flex-col">
            <div tw="text-[132px] font-extrabold leading-none text-white" style={{ letterSpacing: -6 }}>
              Kota
            </div>
            <div tw="text-[132px] font-extrabold leading-none text-[#8fa0b3]" style={{ letterSpacing: -6 }}>
              Mizuno
            </div>
          </div>
          <div tw="flex items-center text-[28px] font-extrabold text-[#0e8a8c]" style={{ gap: 14 }}>
            <div tw="h-5 w-5 rounded-[6px] bg-[#0e8a8c]" />
            kotap.dev
          </div>
        </div>

        {/* 右: 写真と現職 */}
        <div tw="flex w-[400px] flex-col" style={{ gap: 20 }}>
          <div tw="flex flex-1 overflow-hidden rounded-[36px] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" width={400} height={380} tw="h-full w-full" style={{ objectFit: 'cover' }} />
          </div>
          <div tw="flex h-[150px] flex-col justify-between rounded-[36px] bg-[#0e8a8c] p-8 text-white">
            <div tw="text-[18px] font-extrabold uppercase text-[#d3efef]" style={{ letterSpacing: 2 }}>
              Currently
            </div>
            <div tw="text-[30px] font-extrabold leading-tight">Studist Corporation</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'Jakarta', data: font, weight: 800, style: 'normal' }] : undefined,
    }
  )
}
