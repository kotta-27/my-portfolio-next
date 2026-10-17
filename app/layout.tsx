import type { Metadata } from 'next'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-jakarta',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
})


export const metadata: Metadata = {
  // OGP 画像などの相対 URL をこのドメイン基準の絶対 URL にする
  metadataBase: new URL('https://kotap.dev'),
  title: 'Kota Mizuno — Portfolio',
  description:
    'Software Engineer specializing in Quantum Computing and Web Engineering. Currently at Studist Inc.',
  openGraph: {
    title: 'Kota Mizuno — Portfolio',
    description:
      'Software Engineer specializing in Quantum Computing and Web Engineering.',
    siteName: 'Kota Mizuno',
    url: 'https://kotap.dev',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kota Mizuno — Portfolio',
    description:
      'Software Engineer specializing in Quantum Computing and Web Engineering.',
    creator: '@Melmol_27',
  },
}

/** 保存した選択 → なければ OS の設定、でダークを決める。描画前に走らせて白いちらつきを防ぐ */
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.classList.add('dark')}catch(e){}`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // head のスクリプトが描画前に html へ dark クラスを付けるので、その差分は hydration 警告から外す
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="bg-ground antialiased">{children}</body>
    </html>
  )
}
