'use client';
import React, { useEffect, useState } from 'react';
import styles from './Hero.module.css';
import Image from 'next/image';
import { FaArrowDown } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import careers from '../data/careers.json';
import achievements from '../data/achievements.json';
import terminal from '../data/terminal.json';

export default function Hero() {
    const { lang } = useLanguage();
    const profile = {
        name: "Kota Mizuno",
        roles: ["Software Engineer", "Quantum Computing"],
    };

    const [displayedName, setDisplayedName] = useState("");
    const [displayedRoles, setDisplayedRoles] = useState<string[]>(["", ""]);
    const [flashIndex, setFlashIndex] = useState<number | null>(null);

    useEffect(() => {
        // Name typing animation
        let i = 0;
        const nameTimer = setInterval(() => {
            setDisplayedName(profile.name.slice(0, i + 1));
            i++;
            if (i === profile.name.length) {
                clearInterval(nameTimer);
                // Start role typing after name is complete
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
                // フラッシュ効果を追加
                setFlashIndex(roleIndex);
                // フラッシュ効果をリセット
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
                    <Image src="/me-sq.jpg" alt="Profile" className={styles.heroProfileImg} width={150} height={150} />
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


                <div className={styles.aboutContainer}>
                    <div className={styles.aboutContent}>
                        {terminal[lang].commands.map((command, index) => (
                            <div key={index} className={styles.commandOutput}>
                                {command.output.split('\n').map((line, i) => {
                                    const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
                                    if (linkMatch) {
                                        const [fullMatch, text, url] = linkMatch;
                                        const parts = line.split(fullMatch);
                                        return (
                                            <div key={i}>
                                                {parts[0]}
                                                <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
                                                {parts[1]}
                                            </div>
                                        );
                                    }
                                    return <div key={i}>{line}</div>;
                                })}
                            </div>
                        ))}
                    </div>
                    <div className={`${styles.careerSection} ${styles.fadeIn}`}>
                        <div className={styles.subSectionTitleContainer}>
                            <h3 className={styles.subSectionTitle}>{lang === 'ja' ? '経歴' : 'Career'}</h3>
                        </div>
                        <div className={styles.timelineWrapper}>
                            <div className={styles.timelineList}>
                                {careers[lang].map((career, idx) => (
                                    career['period-bar'] ? (
                                        <div key={idx} className={styles.timelinePeriodBar}>
                                            <div className={styles.timelineBarContainer}>
                                                <div className={styles.timelineLine} />
                                                <div className={styles.timelinePeriodContainer}>
                                                    <div className={styles.timelinePeriodText}>{career['period-bar']}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <React.Fragment key={idx}>
                                            <li
                                                className={styles.timelineItem}
                                            >
                                                <div className={styles.timelineDotContainer}>
                                                    <div className={styles.timelineLine} />
                                                    <div className={styles.timelineDot} />
                                                </div>
                                                <div className={styles.timelineContent}>
                                                    <div className={styles.timelineContentLeft}>
                                                        <div className={styles.timelinePeriod}>{career.period}</div>
                                                        <div className={styles.timelineTitle}>{career.title}</div>
                                                    </div>
                                                    {career.image && <Image src={career.image} alt={career.title}
                                                        width={100} height={100} className={styles.timelineImage} />}
                                                </div>
                                            </li>
                                        </React.Fragment>
                                    )))}
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.achievementsSection} ${styles.fadeIn}`}>
                        <div className={styles.subSectionTitleContainer}>
                            <h3 className={styles.subSectionTitle}>{lang === 'ja' ? '実績' : 'Achievements'}</h3>
                        </div>
                        <div className={styles.list}>
                            {achievements[lang].map((ach, idx) => (
                                <div key={idx} className={`${styles.listItem} ${styles.achievementCard}`}>
                                    <span style={{ fontStyle: 'italic' }}>{ach.period}：</span> {ach.title}
                                    {ach.award && (
                                        <>
                                            <br />
                                            <span style={{ color: '#facc15', fontWeight: 'bold' }}>{ach.award.title}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
