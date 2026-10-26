export type Span = 1 | 2 | 4
export type Rows = 1 | 2

// span 4 = full row: 2 columns on mobile, 4 on lg
export const colSpan: Record<Span, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  4: 'col-span-2 lg:col-span-4',
}
export const rowSpan: Record<Rows, string> = { 1: 'row-span-1', 2: 'row-span-2' }

/*
 * 列の間は隙間なし（ブロック同士を横に密着させ、余白はタイル内の padding で取る）。段の間隔はブロックの厚み（--lip）ちょうど。上の段の底が下の段の面に乗り、下の段のスタッドは上の段の中に隠れる（はまる）。
 * 重なりの前後は BentoGrid / Reveal が「上の段ほど手前」になるよう z-index を付けている。
 */
export const gridClass = 'grid grid-flow-dense grid-cols-2 gap-y-brick lg:grid-cols-4'
/** 帯で区切るビュー用: 空きマスを後続で埋めず、順番どおりに並べる */
export const gridClassOrdered = 'grid grid-cols-2 gap-y-brick lg:grid-cols-4'
