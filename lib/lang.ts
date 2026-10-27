import { cookies } from 'next/headers'
import type { Lang } from '@/types'

/** 言語は URL に持たず cookie に持つ。www.kotap.dev と blog.kotap.dev で共有する（Domain=.kotap.dev） */
export const LANG_COOKIE = 'lang'

export const parseLang = (v: string | null | undefined): Lang | null => (v === 'ja' || v === 'en' ? v : null)

/** 保存した選択（cookie）→ なければ日本語 */
export async function getLang(): Promise<Lang> {
  return parseLang((await cookies()).get(LANG_COOKIE)?.value) ?? 'ja'
}

/** cookie の Domain。kotap.dev 上ではサブドメイン間で共有し、手元ではホスト限定 */
export const cookieDomain = (host: string | null) => (host?.endsWith('kotap.dev') ? '.kotap.dev' : undefined)
