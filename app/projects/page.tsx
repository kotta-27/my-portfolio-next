import { permanentRedirect } from 'next/navigation'

/** 作品の一覧は /works に移した。前の URL は転送する */
export default function OldProjectsPage() {
  permanentRedirect('/works')
}
