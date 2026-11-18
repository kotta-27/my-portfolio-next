import type { Section } from '@/lib/town/sections'

/** 建物の色の小さな印（パネルの見出し・スマホの下の地図で使う） */
export const DOT: Record<Section, string> = {
  about: 'bg-ink',
  works: 'bg-teal',
  // 経歴のビルの各階の帯の色（下から古い会社）を並べて、ほかの建物の単色と見分けられるようにする
  career: 'bg-[linear-gradient(90deg,rgb(var(--mustard))_0_25%,rgb(var(--coral))_25%_50%,rgb(var(--mute))_50%_75%,rgb(var(--teal))_75%)]',
  output: 'bg-mustard',
  contact: 'bg-coral',
}
