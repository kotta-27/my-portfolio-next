'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { lang, setLang } = useLanguage();

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Works', href: '/works' },
        { name: 'Blog', href: '/blog' },
    ];

    // ページ遷移時にメニューを閉じる
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <header className="header-glass">
            <nav className="header-nav">
                <Link href="/" className="header-title">
                    Kota Mizuno
                </Link>
                <button
                    className="menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
                <div className={`header-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-links">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`header-link ${isActive ? 'header-link-active' : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="lang-switcher">
                        <button
                            onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
                            className={`lang-button ${lang === 'en' ? 'active' : ''}`}
                            aria-label="Switch to English"
                        >
                            EN
                        </button>
                        <span className="lang-separator">/</span>
                        <button
                            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
                            className={`lang-button ${lang === 'ja' ? 'active' : ''}`}
                            aria-label="Switch to Japanese"
                        >
                            JA
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}