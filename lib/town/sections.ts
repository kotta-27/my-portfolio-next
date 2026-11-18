/** 街の建物 = サイトのセクション。西（左）から並ぶ順 */
export const SECTIONS = ['about', 'works', 'career', 'output', 'contact'] as const
export type Section = (typeof SECTIONS)[number]
export const isSection = (v: string): v is Section => (SECTIONS as readonly string[]).includes(v)
