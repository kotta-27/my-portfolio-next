'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

import about from '../data/about.json';
import careers from '../data/careers.json';
import achievements from '../data/achievements.json';
import styles from './About.module.css';

export default function About() {
    const { lang } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);




    return (
        <section ref={sectionRef} className={styles.aboutSection} id="about">
            <div className={styles.sectionTitleContainer}>
                <h2 className={styles.sectionTitle}>About</h2>
            </div>
            <div className={styles.aboutContainer}>
                <div
                    ref={profileRef}
                    className={styles.profileBlock}
                >
                    {[
                        { icon: "/lego-block-yellow.svg", value: about[lang].education.value },
                        { icon: "/lego-block-red.svg", value: about[lang].lab.value, link: about[lang].lab.link },
                        { icon: "/lego-block-blue.svg", value: about[lang].birthplace.value },
                        { icon: "/lego-block-green.svg", value: about[lang].graduationResearch.value },
                        { icon: "/lego-block-purple.svg", value: about[lang].researchTheme.value }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={styles.profileDetail}
                        >
                            <Image
                                src={item.icon}
                                alt="lego block"
                                width={16}
                                height={16}
                                className={styles.legoIcon}
                            />
                            {item.link ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.profileDetailLink}>
                                    {item.value}
                                </a>
                            ) : (
                                item.value
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.careerSection}>
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
            </div>
            <div className={styles.achievementsSection}>
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
        </section >
    );
}