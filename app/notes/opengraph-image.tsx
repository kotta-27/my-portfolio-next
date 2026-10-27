import { ogSize, renderNoteOg } from '@/lib/noteOg'

export const size = ogSize
export const contentType = 'image/png'
export const alt = 'Kota Mizuno — Notes'

export default async function Image() {
  return renderNoteOg({ kicker: 'NOTES', title: '勉強の記録', tags: [] })
}
