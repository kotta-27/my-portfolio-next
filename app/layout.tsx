import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
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
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="bg-[#edeae3] antialiased">{children}</body>
    </html>
  )
}
