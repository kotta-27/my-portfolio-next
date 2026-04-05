'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import careers from '../data/careers.json';
import terminal from '../data/terminal.json';
import achievements from '../data/achievements.json';
import styles from './Career.module.css';

interface Interview {
    url: string;
    text: string;
}

interface Position {
    title: string;
    type: string;
    period: string;
    interview?: Interview;
}

interface WorkEntry {
    company: string;
    image?: string;
    positions: Position[];
}

interface ExperienceEntry {
    title: string;
    period: string;
    link?: string;
    image?: string;
    interview?: Interview;
}

interface Achievement {
    period: string;
    title: string;
    award?: { title: string };
}

function Studs({ count = 4 }: { count?: number }) {
    return (
        <div className={styles.studsRow}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={styles.stud} />
            ))}
        </div>
    );
}

export default function Career() {
    const { lang } = useLanguage();
    const data = careers[lang as keyof typeof careers];
    const terminalData = terminal[lang as keyof typeof terminal];
    const achievementData = achievements[lang as keyof typeof achievements] as Achievement[];

    return (
        <div className={styles.careerWrapper}>
            {/* Profile */}
            <div className={styles.sectionBlock}>
                <h3 className={styles.sectionLabel}>{lang === 'ja' ? 'プロフィール' : 'Profile'}</h3>
                <div className={`${styles.brick} ${styles.brickProfile}`}>
                    <Studs count={5} />
                    <div className={styles.profileCard}>
                        {terminalData.commands.map((command, index) => (
                            <div key={index} className={styles.profileRow}>
                                {command.output.split('\n').map((line, i) => {
                                    const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
                                    if (linkMatch) {
                                        const [fullMatch, text, url] = linkMatch;
                                        const parts = line.split(fullMatch);
                                        const [label, ...rest] = parts[0].split(': ');
                                        return (
                                            <div key={i} className={styles.profileItem}>
                                                <span className={styles.profileLabel}>{label}</span>
                                                <span className={styles.profileValue}>
                                                    {rest.join(': ')}
                                                    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
                                                        {text}
                                                    </a>
                                                    {parts[1]}
                                                </span>
                                            </div>
                                        );
                                    }
                                    const colonIdx = line.indexOf(': ');
                                    if (colonIdx !== -1) {
                                        return (
                                            <div key={i} className={styles.profileItem}>
                                                <span className={styles.profileLabel}>{line.slice(0, colonIdx)}</span>
                                                <span className={styles.profileValue}>{line.slice(colonIdx + 2)}</span>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={i} className={styles.profileItem}>
                                            <span className={styles.profileValue}>{line}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 職歴 */}
            <div className={styles.sectionBlock}>
                <h3 className={styles.sectionLabel}>{data.workLabel}</h3>
                <div className={styles.workList}>
                    {(data.work as WorkEntry[]).map((entry, idx) => (
                        <div key={idx} className={`${styles.brick} ${styles.brickWork}`}>
                            <Studs count={4} />
                            <div className={styles.companyHeader}>
                                {entry.image && (
                                    <div className={styles.companyIcon}>
                                        <Image
                                            src={entry.image}
                                            alt={entry.company}
                                            width={36}
                                            height={36}
                                            className={styles.companyImg}
                                        />
                                    </div>
                                )}
                                <div className={styles.companyInfo}>
                                    <h4 className={styles.companyName}>{entry.company}</h4>
                                </div>
                            </div>
                            <div className={styles.positionList}>
                                {entry.positions.map((pos, pIdx) => (
                                    <div key={pIdx} className={styles.positionItem}>
                                        <div className={styles.positionDotArea}>
                                            <div className={styles.positionDot} />
                                            {pIdx < entry.positions.length - 1 && (
                                                <div className={styles.positionLine} />
                                            )}
                                        </div>
                                        <div className={styles.positionContent}>
                                            <div className={styles.positionTitleRow}>
                                                <span className={styles.positionTitle}>{pos.title}</span>
                                                <span className={`${styles.typeBadge} ${pos.type === '正社員' || pos.type === 'Full-time' ? styles.badgeFulltime : styles.badgeIntern}`}>
                                                    {pos.type}
                                                </span>
                                            </div>
                                            <span className={styles.positionPeriod}>{pos.period}</span>
                                            {pos.interview && (
                                                <a
                                                    href={pos.interview.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.interviewLink}
                                                >
                                                    {pos.interview.text}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 経歴 */}
            <div className={styles.sectionBlock}>
                <h3 className={styles.sectionLabel}>{data.experienceLabel}</h3>
                <div className={`${styles.brick} ${styles.brickExperience}`}>
                    <Studs count={6} />
                    <div className={styles.timelineList}>
                        {(data.experience as ExperienceEntry[]).map((entry, idx) => (
                            <div key={idx} className={styles.experienceItem}>
                                <div className={styles.expDotArea}>
                                    <div className={styles.expDot} />
                                    {idx < (data.experience as ExperienceEntry[]).length - 1 && (
                                        <div className={styles.expLine} />
                                    )}
                                </div>
                                <div className={styles.expContent}>
                                    <span className={styles.expTitle}>
                                        {entry.link ? (
                                            <a href={entry.link} target="_blank" rel="noopener noreferrer" className={styles.expTitleLink}>
                                                {entry.title}
                                            </a>
                                        ) : (
                                            entry.title
                                        )}
                                    </span>
                                    <span className={styles.expPeriod}>{entry.period}</span>
                                    {entry.interview && (
                                        <a
                                            href={entry.interview.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.interviewLink}
                                        >
                                            {entry.interview.text}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 実績 */}
            <div className={styles.sectionBlock}>
                <h3 className={styles.sectionLabel}>{lang === 'ja' ? '実績' : 'Achievements'}</h3>
                <div className={`${styles.brick} ${styles.brickAchievement}`}>
                    <Studs count={5} />
                    <div className={styles.timelineList}>
                        {achievementData.map((ach, idx) => (
                            <div key={idx} className={styles.achievementItem}>
                                <div className={styles.achDotArea}>
                                    <div className={`${styles.achDot} ${ach.award ? styles.achDotAward : ''}`} />
                                    {idx < achievementData.length - 1 && (
                                        <div className={styles.expLine} />
                                    )}
                                </div>
                                <div className={styles.achContent}>
                                    <span className={styles.achTitle}>{ach.title}</span>
                                    {ach.award && (
                                        <span className={styles.achAward}>{ach.award.title}</span>
                                    )}
                                    <span className={styles.expPeriod}>{ach.period}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
