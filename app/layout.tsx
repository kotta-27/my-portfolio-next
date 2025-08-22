import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Background from '../components/Background';

export const metadata: Metadata = {
    title: 'Kota Mizuno',
    description: 'Kota Mizuno\'s portfolio',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <head>
                <title>Kota Mizuno</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Abel&family=Bitter:ital,wght@0,100..900;1,100..900&family=Edu+NSW+ACT+Hand+Pre:wght@400..700&family=Noto+Sans+JP&family=Noto+Sans+TC:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Pacifico&family=Press+Start+2P&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </head>
            <body>
                <Background />
                <LanguageProvider>
                    <LanguageSwitcher />
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
} 