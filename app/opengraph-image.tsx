import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { FaGithub, FaXTwitter } from 'react-icons/fa6'

// OGP 画像 (1200x630)。satori で描画するため、ここでは Tailwind の代わりに `tw` 属性を使う。
export const alt = 'Kota Mizuno — Software Engineer, Tokyo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// text= でサブセット化すると uppercase 変換に必要な大文字グリフが欠けるため、フォント全体を取得する
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;800'

type OgFont = { name: string; data: ArrayBuffer; weight: 500 | 800; style: 'normal' }

/** Google Fonts から TTF を取得する（satori は woff2 非対応なので古い UA で truetype を要求する） */
async function loadDisplayFonts(): Promise<OgFont[]> {
  try {
    const css = await fetch(FONT_CSS, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:1.0) Gecko/20100101 Firefox/1.0' },
    }).then((r) => r.text())
    const faces = [...css.matchAll(/font-weight: (500|800);[^}]*?src: url\((.+?)\) format\('(?:truetype|opentype)'\)/g)]
    return await Promise.all(
      faces.map(async ([, weight, url]) => ({
        name: 'Jakarta',
        data: await fetch(url).then((r) => r.arrayBuffer()),
        weight: weight === '500' ? 500 : 800,
        style: 'normal' as const,
      }))
    )
  } catch {
    return []
  }
}

async function loadPortrait(): Promise<string> {
  const buf = await readFile(path.join(process.cwd(), 'public', 'mepic2.png'))
  return `data:image/png;base64,${buf.toString('base64')}`
}

export default async function Image() {
  const [fonts, portrait] = await Promise.all([loadDisplayFonts(), loadPortrait()])

  const pill = 'flex items-center rounded-full px-7 py-3 text-[22px] font-extrabold'

  return new ImageResponse(
    (
      // トップページの Hero タイルをそのまま 1200x630 に拡大した構図
      <div tw="flex h-full w-full bg-[#e5e9ef] p-8" style={{ fontFamily: 'Jakarta, sans-serif' }}>
        <div tw="flex h-full w-full rounded-[40px] bg-white px-14 py-12">
          <div tw="flex flex-1 flex-col justify-between">
            <div tw="flex text-[20px] font-extrabold uppercase text-[#5d6b7a]" style={{ letterSpacing: 2 }}>
              Software Engineer · Tokyo, Japan
            </div>
            <div tw="flex flex-col">
              <div tw="text-[104px] font-extrabold leading-none text-[#0d1b2a]" style={{ letterSpacing: -4 }}>
                Kota
              </div>
              <div tw="text-[104px] font-medium leading-none text-[#5d6b7a]" style={{ letterSpacing: -4 }}>
                Mizuno
              </div>
              <div tw="mt-7 flex flex-col text-[24px] font-medium leading-snug text-[#5d6b7a]">
                <div>Web Engineering.</div>
                <div>Currently Working at Studist Corporation</div>
              </div>
            </div>
            <div tw="flex flex-wrap" style={{ gap: 14 }}>
              <div tw={`${pill} bg-[#0d1b2a] text-white`}>View Work</div>
              <div tw={`${pill} bg-[#edf1f5] text-[#0d1b2a]`} style={{ gap: 10 }}>
                <FaGithub size={24} />
                kotta-27
              </div>
              <div tw={`${pill} bg-[#edf1f5] text-[#0d1b2a]`} style={{ gap: 10 }}>
                <FaXTwitter size={22} />
                @Melmol_27
              </div>
              <div tw={`${pill} bg-[#edf1f5] text-[#0d1b2a]`}>YouTrust</div>
            </div>
          </div>
          <div tw="flex items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" width={310} height={372} tw="rounded-[28px]" style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  )
}
