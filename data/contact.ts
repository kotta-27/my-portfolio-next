import type { Lang } from '@/types'

type ContactStrings = {
  title: string
  body: string
}

export const contact: Record<Lang, ContactStrings> = {
  en: {
    title: "Let\'s talk.",
    body: 'Open to new projects, research collaborations, and interesting conversations about quantum computing and web engineering.',
  },
  ja: {
    title: 'Let\'s talk.',
    body: 'ご気軽にご連絡ください。',
  },
}
