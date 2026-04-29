'use client';
import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import terminal from '../data/terminal.json';
import careers from '../data/careers.json';
import achievements from '../data/achievements.json';
import styles from './About.module.css';

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

const SECTION_LABELS: Record<string, Record<string, string>> = {
    ja: { profile: 'プロフィール', work: '職歴', experience: '経歴', achievements: '実績' },
    en: { profile: 'Profile', work: 'Work', experience: 'Experience', achievements: 'Achievements' },
};

export default function About() {
    const { lang } = useLanguage();
    const t = terminal[lang as keyof typeof terminal];
    const d = careers[lang as keyof typeof careers];
    const achData = achievements[lang as keyof typeof achievements] as Achievement[];
    const labels = SECTION_LABELS[lang] ?? SECTION_LABELS.en;

    return (
        <section id="about" className={styles.aboutSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>About</h2>
            </div>

            <div className={styles.container}>

                {/* Profile */}
                <div className={styles.block}>
                    <h3 className={styles.blockTitle}>{labels.profile}</h3>
                    <div className={styles.profileGrid}>
                        {t.commands.flatMap((cmd, i) =>
                            cmd.output.split('\n').map((line, j) => {
                                const ci = line.indexOf(': ');
                                if (ci === -1) return null;
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
                </div>

                {/* Work */}
                <div className={styles.block}>
                    <h3 className={styles.blockTitle}>{labels.work}</h3>
                    <div className={styles.list}>
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
                                        <div className={styles.dot} />
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
                </div>

                {/* Experience */}
                <div className={styles.block}>
                    <h3 className={styles.blockTitle}>{labels.experience}</h3>
                    <div className={styles.list}>
                        {(d.experience as ExpEntry[]).map((entry, i) => (
                            <div key={i} className={styles.expRow}>
                                <div className={styles.dot} />
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
                </div>

                {/* Achievements */}
                <div className={styles.block}>
                    <h3 className={styles.blockTitle}>{labels.achievements}</h3>
                    <div className={styles.list}>
                        {achData.map((item, i) => (
                            <div key={i} className={styles.expRow}>
                                <div className={`${styles.dot} ${item.award ? styles.dotGold : ''}`} />
                                <div>
                                    <span className={styles.expTitle}>{item.title}</span>
                                    {item.award && <div className={styles.awardBadge}>{item.award.title}</div>}
                                    <div className={styles.period}>{item.period}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
