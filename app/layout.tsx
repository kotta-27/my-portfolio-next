import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export const metadata: Metadata = {
    title: 'Your Portfolio',
    description: 'Your stylish portfolio site',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Abel&family=Bitter:ital,wght@0,100..900;1,100..900&family=Edu+NSW+ACT+Hand+Pre:wght@400..700&family=Noto+Sans+JP&family=Noto+Sans+TC:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Pacifico&family=Press+Start+2P&display=swap" rel="stylesheet" />
            </head>
            <body>
                <LanguageProvider>
                    <LanguageSwitcher />
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
} 