import { notesData } from '@/data/notes'
import { ogSize, renderNoteOg } from '@/lib/noteOg'

// SNS のクローラーは cookie を持たないので、既定の日本語で描く
export const size = ogSize
export const contentType = 'image/png'
export const alt = 'Kota Mizuno — Notes'

export function generateStaticParams() {
  return notesData.map((n) => ({ slug: n.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const note = notesData.find((n) => n.slug === slug) ?? notesData[0]
  return renderNoteOg({ kicker: `NOTE · ${note.date.replaceAll('-', '.')}`, title: note.title.ja, tags: note.tags })
}
