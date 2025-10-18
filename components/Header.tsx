'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { lang, setLang } = useLanguage();

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Skill & Works', href: '/works' },
        { name: 'Outputs', href: '/outputs' },
    ];

    // ページ遷移時にメニューを閉じる
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <header className={styles.headerGlass}>
            <nav className={styles.headerNav}>
                {/* <Link href="/" className={styles.headerTitle}>
                    Kota Mizuno
                </Link> */}
                <button
                    className={styles.menuButton}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
                <div className={`${styles.headerMenu} ${isMenuOpen ? styles.open : ''}`}>
                    <ul className={styles.navLinks}>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href} className={styles.navItem}>
                                    <Link
                                        href={item.href}
                                        className={`${styles.headerLink} ${isActive ? styles.active : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                        {isActive && <span className={styles.activeIndicator} />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className={styles.langSwitcher}>
                        <button
                            onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
                            className={`${styles.langButton} ${lang === 'en' ? styles.active : ''}`}
                            aria-label="Switch to English"
                        >
                            EN
                        </button>
                        <span className={styles.langSeparator}>/</span>
                        <button
                            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
                            className={`${styles.langButton} ${lang === 'ja' ? styles.active : ''}`}
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