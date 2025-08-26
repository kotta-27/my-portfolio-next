import './globals.css';
import type { Metadata } from 'next';
import { Raleway, Noto_Sans_JP } from 'next/font/google';
import { LanguageProvider } from '../context/LanguageContext';
import Background from '../components/Background';
import Header from '../components/Header';

const raleway = Raleway({
    preload: true,
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '700', '900'],
    variable: '--font-raleway',
});

const notoSansJP = Noto_Sans_JP({
    preload: true,
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '700'],
    variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
    title: 'Kota Mizuno',
    description: 'Web Developer, Student, and more',
    openGraph: {
        title: 'Kota Mizuno',
        description: 'Web Developer, Student, and more',
        url: 'https://kotamizuno.dev',
        siteName: 'Kota Mizuno',
        locale: 'ja_JP',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kota Mizuno',
        description: 'Web Developer, Student, and more',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja" className={`${raleway.variable} ${notoSansJP.variable}`}>
            <body>
                <Background />
                <LanguageProvider>
                    <Header />
                    <main className="main-bg">
                        {children}
                    </main>
                </LanguageProvider>
            </body>
        </html>
    );
} 