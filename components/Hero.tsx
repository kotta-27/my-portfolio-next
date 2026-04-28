'use client';
import React, { useEffect, useState } from 'react';
import styles from './Hero.module.css';
import Image from 'next/image';
import { FaArrowDown } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import terminal from '../data/terminal.json';
import careers from '../data/careers.json';
import achievements from '../data/achievements.json';

const TABS = ['profile', 'work', 'experience', 'achievements'] as const;
type TabKey = typeof TABS[number];

const TAB_LABELS: Record<string, Record<TabKey, string>> = {
    ja: { profile: 'プロフィール', work: '職歴', experience: '経歴', achievements: '実績' },
    en: { profile: 'Profile', work: 'Work', experience: 'Experience', achievements: 'Achievements' },
};

interface Position {
    title: string;
    type: string;
    period: string;
    interview?: { url: string; text: string };
}
interface WorkEntry {
    company: string;
    image?: string;
    positions: Position[];
}
interface ExpEntry {
    title: string;
    period: string;
    link?: string;
    interview?: { url: string; text: string };
}
interface Achievement {
    period: string;
    title: string;
    award?: { title: string };
}

function ProfileTab({ lang }: { lang: string }) {
    const t = terminal[lang as keyof typeof terminal];
    return (
        <div className={styles.tabPane}>
            {t.commands.flatMap((cmd, i) =>
                cmd.output.split('\n').map((line, j) => {
                    const ci = line.indexOf(': ');
                    if (ci === -1) return <div key={`${i}-${j}`} className={styles.infoVal}>{line}</div>;
                    const label = line.slice(0, ci);
                    const val = line.slice(ci + 2);
                    const linkMatch = val.match(/\[<?(.*?)>?\]\((.*?)\)/);
                    if (linkMatch) {
                        const before = val.slice(0, val.indexOf('['));
                        return (
                            <div key={`${i}-${j}`} className={styles.infoRow}>
                                <span className={styles.infoLabel}>{label}</span>
                                <span className={styles.infoVal}>
                                    {before}
                                    <a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>{linkMatch[1]}</a>
                                </span>
                            </div>
                        );
                    }
                    return (
                        <div key={`${i}-${j}`} className={styles.infoRow}>
                            <span className={styles.infoLabel}>{label}</span>
                            <span className={styles.infoVal}>{val}</span>
                        </div>
                    );
                })
            )}
        </div>
    );
}

function WorkTab({ lang }: { lang: string }) {
    const d = careers[lang as keyof typeof careers];
    return (
        <div className={styles.tabPane}>
            {(d.work as WorkEntry[]).map((entry, i) => (
                <div key={i} className={styles.workEntry}>
                    <div className={styles.workHeader}>
                        {entry.image && (
                            <Image src={entry.image} alt={entry.company} width={18} height={18} style={{ objectFit: 'contain' }} />
                        )}
                        <span className={styles.companyName}>{entry.company}</span>
                    </div>
                    {entry.positions.map((pos, j) => (
                        <div key={j} className={styles.positionRow}>
                            <div className={styles.positionDot} />
                            <div>
                                <span className={styles.positionTitle}>{pos.title}</span>
                                <span className={`${styles.badge} ${pos.type === '正社員' || pos.type === 'Full-time' ? styles.badgeFull : styles.badgeIntern}`}>
                                    {pos.type}
                                </span>
                                <div className={styles.period}>{pos.period}</div>
                                {pos.interview && (
                                    <a href={pos.interview.url} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                                        {pos.interview.text}
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function ExperienceTab({ lang }: { lang: string }) {
    const d = careers[lang as keyof typeof careers];
    return (
        <div className={styles.tabPane}>
            {(d.experience as ExpEntry[]).map((entry, i) => (
                <div key={i} className={styles.expRow}>
                    <div className={styles.positionDot} />
                    <div>
                        <span className={styles.expTitle}>
                            {entry.link ? (
                                <a href={entry.link} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>{entry.title}</a>
                            ) : entry.title}
                        </span>
                        <div className={styles.period}>{entry.period}</div>
                        {entry.interview && (
                            <a href={entry.interview.url} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                                {entry.interview.text}
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function AchievementsTab({ lang }: { lang: string }) {
    const data = achievements[lang as keyof typeof achievements] as Achievement[];
    return (
        <div className={styles.tabPane}>
            {data.map((item, i) => (
                <div key={i} className={styles.expRow}>
                    <div className={`${styles.positionDot} ${item.award ? styles.dotGold : ''}`} />
                    <div>
                        <span className={styles.expTitle}>{item.title}</span>
                        {item.award && <div className={styles.awardBadge}>{item.award.title}</div>}
                        <div className={styles.period}>{item.period}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Hero() {
    const { lang } = useLanguage();
    const profile = { name: "Kota Mizuno", roles: ["Software Engineer", "Quantum Computing"] };
    const [displayedName, setDisplayedName] = useState("");
    const [displayedRoles, setDisplayedRoles] = useState<string[]>(["", ""]);
    const [flashIndex, setFlashIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    useEffect(() => {
        let i = 0;
        const nameTimer = setInterval(() => {
            setDisplayedName(profile.name.slice(0, i + 1));
            i++;
            if (i === profile.name.length) {
                clearInterval(nameTimer);
                startRoleTyping(0);
            }
        }, 120);
        return () => clearInterval(nameTimer);
    }, []);

    const startRoleTyping = (roleIndex: number) => {
        let i = 0;
        const roleTimer = setInterval(() => {
            setDisplayedRoles(prev => {
                const newRoles = [...prev];
                newRoles[roleIndex] = profile.roles[roleIndex].slice(0, i + 1);
                return newRoles;
            });
            i++;
            if (i === profile.roles[roleIndex].length) {
                clearInterval(roleTimer);
                setFlashIndex(roleIndex);
                setTimeout(() => setFlashIndex(null), 500);
                if (roleIndex < profile.roles.length - 1) {
                    setTimeout(() => startRoleTyping(roleIndex + 1), 800);
                }
            }
        }, 100);
    };

    return (
        <section id="home" className={styles.heroSection}>
            <div className={styles.heroProfile}>
                <div className={styles.heroProfileTopContainer}>
                    <Image src="/mepic2.png" alt="Profile" className={styles.heroProfileImg} width={150} height={150} />
                    <h1 className={styles.heroTitle}>
                        {displayedName}
                        {displayedName.length > 0 && displayedName.length < profile.name.length && (
                            <span className={styles.cursor} />
                        )}
                    </h1>
                    <div className={styles.roleContainer}>
                        {displayedRoles.map((role, index) => (
                            <div
                                key={index}
                                className={`${styles.heroSubtitleCard} ${flashIndex === index ? (index === 0 ? styles.flashBlue : styles.flashGreen) : ''}`}
                            >
                                <p className={styles.heroSubtitle}>
                                    {role}
                                    {role.length > 0 && role.length < profile.roles[index].length && (
                                        <span className={styles.cursor} />
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.arrowContainer}>
                        <FaArrowDown className={styles.arrowIcon} />
                    </div>
                </div>

                <div className={styles.aboutCard}>
                    <div className={styles.tabNav}>
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {TAB_LABELS[lang]?.[tab]}
                            </button>
                        ))}
                    </div>
                    <div className={styles.tabContent}>
                        {activeTab === 'profile' && <ProfileTab lang={lang} />}
                        {activeTab === 'work' && <WorkTab lang={lang} />}
                        {activeTab === 'experience' && <ExperienceTab lang={lang} />}
                        {activeTab === 'achievements' && <AchievementsTab lang={lang} />}
                    </div>
                </div>
            </div>
        </section>
    );
}
