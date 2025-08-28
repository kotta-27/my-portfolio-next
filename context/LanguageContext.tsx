'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'ja' | 'en';

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'ja',
    setLang: () => { },
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    // 初期値は常にjaに設定
    const [lang, setLangState] = useState<Lang>('ja');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedLang = localStorage.getItem('language') as Lang;
        if (savedLang) {
            setLangState(savedLang);
        }
    }, []);

    const setLang = (newLang: Lang) => {
        setLangState(newLang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', newLang);
        }
    };

    // サーバーサイドレンダリング時は常にjaを使用
    if (!isClient) {
        return (
            <LanguageContext.Provider value={{ lang: 'ja', setLang }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}; 