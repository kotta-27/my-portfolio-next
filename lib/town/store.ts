/*
 * 街の中で動かした小物（ベンチ）の置き場所。ページの中だけで持ち、リロードすると元に戻る。
 * 言語の切り替えなどで街を作り直しても、ここに残っている位置から始める。
 */
export type PropPlace = { x: number; z: number; rot: number }

const places = new Map<string, PropPlace>()

export const propStore = {
  get: (id: string) => places.get(id),
  set: (id: string, place: PropPlace) => {
    places.set(id, place)
  },
}
