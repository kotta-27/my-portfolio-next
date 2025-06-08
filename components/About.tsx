'use client';
import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import about from '../data/about.json';
import careers from '../data/careers.json';
import achievements from '../data/achievements.json';
import styles from './About.module.css';

export default function About() {
    const { lang } = useLanguage();
    return (
        <section className={styles.aboutSection} id="about">
            <div className={styles.sectionTitleContainer}>
                <h2 className={styles.sectionTitle}>About</h2>
            </div>
            <div className={styles.aboutContainer}>
                <div className={styles.profileBlock}>
                    <div className={styles.profileDetail}>
                        <Image src="/lego-block-yellow.svg" alt="lego block" width={16} height={16} className={styles.legoIcon} />
                        {about[lang].education.value}
                    </div>
                    <div className={styles.profileDetail}>
                        <Image src="/lego-block-red.svg" alt="lego block" width={16} height={16} className={styles.legoIcon} />
                        {about[lang].lab.link ? (
                            <a href={about[lang].lab.link} target="_blank" rel="noopener noreferrer" className={styles.profileDetailLink}>
                                {about[lang].lab.value}
                            </a>
                        ) : (
                            about[lang].lab.value
                        )}
                    </div>
                    <div className={styles.profileDetail}>
                        <Image src="/lego-block-blue.svg" alt="lego block" width={16} height={16} className={styles.legoIcon} />
                        {about[lang].birthplace.value}
                    </div>
                    <div className={styles.profileDetail}>
                        <Image src="/lego-block-green.svg" alt="lego block" width={16} height={16} className={styles.legoIcon} />
                        {about[lang].graduationResearch.value}
                    </div>
                    <div className={styles.profileDetail}>
                        <Image src="/lego-block-purple.svg" alt="lego block" width={16} height={16} className={styles.legoIcon} />
                        {about[lang].researchTheme.value}
                    </div>
                </div>
                <div style={{ marginTop: '2rem' }}>
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
                                    <li key={idx} className={styles.timelineItem}>
                                        <div className={styles.timelineDotContainer}>
                                            <div className={styles.timelineLine} />
                                            <div className={styles.timelineDot} />
                                        </div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.timelinePeriod}>{career.period}</div>
                                            <div className={styles.timelineTitle}>{career.title}</div>
                                            {career.image && <Image src={career.image} alt={career.title}
                                                width={100} height={100} className={styles.timelineImage} />}
                                        </div>
                                    </li>
                                )
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.achievementsSection}>
                    <div className={styles.subSectionTitleContainer}>
                        <h3 className={styles.subSectionTitle}>{lang === 'ja' ? '実績' : 'Achievements'}</h3>
                    </div>
                    <div className={styles.list}>
                        {achievements[lang].map((ach, idx) => (
                            <div key={idx} className={styles.listItem}>
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
        </section>
    );
} 