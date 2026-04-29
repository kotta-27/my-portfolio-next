'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Header.module.css';

const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Works', href: '#works' },
    { name: 'Contact', href: '#contact' },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('#home');
    const { lang, setLang } = useLanguage();

    // スクロールでアクティブセクション検知
    useEffect(() => {
        const sectionIds = navigation.map(n => n.href.replace('#', ''));

        const handleScroll = () => {
            const scrollY = window.scrollY + window.innerHeight * 0.3;
            let current = sectionIds[0];
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el && el.offsetTop <= scrollY) {
                    current = id;
                }
            }
            setActiveSection(`#${current}`);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    }, []);

    return (
        <header className={styles.headerGlass}>
            <nav className={styles.headerNav}>
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
                            const isActive = activeSection === item.href;
                            return (
                                <li key={item.href} className={styles.navItem}>
                                    <a
                                        href={item.href}
                                        className={`${styles.headerLink} ${isActive ? styles.active : ''}`}
                                        onClick={(e) => handleClick(e, item.href)}
                                    >
                                        {item.name}
                                        {isActive && <span className={styles.activeIndicator} />}
                                    </a>
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
