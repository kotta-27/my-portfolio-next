/** 図の中のブランチの色。カード・HEAD・グラフの先端を同じ色でつなぎ、どれがどれを指しているか目で追えるようにする */
export type Branch = 'main' | 'feature' | 'hotfix'

export const BRANCH_TONE: Record<Branch, { fill: string; text: string; border: string; dot: string }> = {
  main: { fill: 'bg-ink text-paper', text: 'text-ink', border: 'border-ink', dot: 'bg-ink' },
  feature: { fill: 'bg-teal text-paper', text: 'text-teal', border: 'border-teal', dot: 'bg-teal' },
  hotfix: { fill: 'bg-coral text-paper', text: 'text-coral', border: 'border-coral', dot: 'bg-coral' },
}
