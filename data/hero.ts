import type { Lang } from '@/types'

type HeroStrings = {
  roleTag: string
  tagline: string
  currentlyAt: string
  viewWork: string
  interests: string[]
  hobbies: string[]
}

export const hero: Record<Lang, HeroStrings> = {
  en: {
    roleTag: 'Software Engineer · Tokyo, Japan',
    tagline: 'Web Engineering.',
    currentlyAt: 'Currently Working at Studist Corporation',
    viewWork: 'View Work',
    interests: ['Search Tech', 'UI/UX', 'Design'],
    hobbies: ['LEGO', 'Escape Rooms', 'Cafés'],
  },
  ja: {
    roleTag: 'ソフトウェアエンジニア',
    tagline: 'Web Engineering.',
    currentlyAt: 'Currently Working at Studist Corporation',
    viewWork: '実績を見る',
    interests: ['検索技術', 'UI/UX', 'デザイン'],
    hobbies: ['LEGO', '謎解き', 'カフェ'],
  },
}
