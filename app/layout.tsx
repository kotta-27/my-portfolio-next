import type { Metadata } from 'next'
import { JetBrains_Mono, Noto_Sans_JP, Plus_Jakarta_Sans } from 'next/font/google'
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

const notoJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-jp',
})

export const metadata: Metadata = {
  title: 'Kota Mizuno — Portfolio',
  description:
    'Software Engineer specializing in Quantum Computing and Web Engineering. Currently at Studist Inc.',
  openGraph: {
    title: 'Kota Mizuno — Portfolio',
    description:
      'Software Engineer specializing in Quantum Computing and Web Engineering.',
    siteName: 'Kota Mizuno',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} ${notoJp.variable}`}>
      <body className="bg-ground antialiased">{children}</body>
    </html>
  )
}
