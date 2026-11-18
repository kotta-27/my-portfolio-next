export type Lang = 'en' | 'ja'

/** Which set of tiles the bento grid is showing. 'all' is the default overview. */
export type View = 'all' | 'career' | 'projects' | 'writing'

const VIEWS: readonly View[] = ['all', 'career', 'projects', 'writing']

export function parseView(value: string | undefined): View {
  return VIEWS.find((v) => v === value) ?? 'all'
}
