import { cookies, headers } from 'next/headers'
import type { Lang } from '@/types'

/** 言語は URL に持たず cookie に持つ。www.kotap.dev と blog.kotap.dev で共有する（Domain=.kotap.dev） */
export const LANG_COOKIE = 'lang'

export const parseLang = (v: string | null | undefined): Lang | null => (v === 'ja' || v === 'en' ? v : null)

/** cookie → ブラウザの言語設定（日本語が英語より先なら ja）→ 英語 */
export async function getLang(): Promise<Lang> {
  const saved = parseLang((await cookies()).get(LANG_COOKIE)?.value)
  if (saved) return saved
  const accept = (await headers()).get('accept-language')?.toLowerCase() ?? ''
  const ja = accept.search(/(^|,)\s*ja/)
  const en = accept.search(/(^|,)\s*en/)
  return ja !== -1 && (en === -1 || ja < en) ? 'ja' : 'en'
}

/** cookie の Domain。kotap.dev 上ではサブドメイン間で共有し、手元ではホスト限定 */
export const cookieDomain = (host: string | null) => (host?.endsWith('kotap.dev') ? '.kotap.dev' : undefined)
