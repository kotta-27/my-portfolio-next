export type Span = 1 | 2 | 4
export type Rows = 1 | 2

// span 4 = full row: 2 columns on mobile, 4 on lg
export const colSpan: Record<Span, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  4: 'col-span-2 lg:col-span-4',
}
export const rowSpan: Record<Rows, string> = { 1: 'row-span-1', 2: 'row-span-2' }

export const gridClass = 'grid grid-flow-dense grid-cols-2 auto-rows-[minmax(120px,auto)] gap-3 lg:grid-cols-4'
