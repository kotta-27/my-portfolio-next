'use client';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GrLanguage } from 'react-icons/gr';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
    const { lang, setLang } = useLanguage();
    const [open, setOpen] = useState(false);

    return (
        <div
            className={styles.langSwitcher}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                className={styles.langIconBtn}
                aria-label="Change language"
                tabIndex={0}
                onClick={() => setOpen((v) => !v)}
            >
                <GrLanguage />
            </button>
            {open && (
                <div className={styles.langDropdown}>
                    <button
                        className={`${styles.langItem} ${lang === 'ja' ? styles.active : ''}`}
                        onClick={() => { setLang('ja'); setOpen(false); }}
                    >
                        日本語
                    </button>
                    <button
                        className={`${styles.langItem} ${lang === 'en' ? styles.active : ''}`}
                        onClick={() => { setLang('en'); setOpen(false); }}
                    >
                        English
                    </button>
                </div>
            )}
        </div>
    );
} 