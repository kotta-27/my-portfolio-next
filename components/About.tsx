'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import about from '../data/about.json';
import careers from '../data/careers.json';
import achievements from '../data/achievements.json';
import styles from './About.module.css';

export default function About() {
    const { lang } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "start center"]
    });

    // より早いタイミングで正面を向くように調整
    const rotate = useTransform(scrollYProgress, [0, 0.3], [90, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0.3, 1]);
    const x = useTransform(scrollYProgress, [0, 0.3], [-100, 0]);
    const z = useTransform(scrollYProgress, [0, 0.3], [-300, 0]);

    const springRotate = useSpring(rotate, {
        stiffness: 70, // スティフネスを少し上げて、より素早く反応するように
        damping: 13    // 減衰を少し下げて、よりスナップのある動きに
    });

    const springX = useSpring(x, {
        stiffness: 70,
        damping: 13
    });

    const springZ = useSpring(z, {
        stiffness: 70,
        damping: 13
    });

    return (
        <section ref={sectionRef} className={styles.aboutSection} id="about">
            <div className={styles.sectionTitleContainer}>
                <h2 className={styles.sectionTitle}>About</h2>
            </div>
            <div className={styles.aboutContainer}>
                <motion.div
                    ref={profileRef}
                    className={styles.profileBlock}
                    style={{
                        rotateY: springRotate,
                        x: springX,
                        z: springZ,
                        opacity,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {[
                        { icon: "/lego-block-yellow.svg", value: about[lang].education.value },
                        { icon: "/lego-block-red.svg", value: about[lang].lab.value, link: about[lang].lab.link },
                        { icon: "/lego-block-blue.svg", value: about[lang].birthplace.value },
                        { icon: "/lego-block-green.svg", value: about[lang].graduationResearch.value },
                        { icon: "/lego-block-purple.svg", value: about[lang].researchTheme.value }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.profileDetail}
                            style={{
                                translateZ: index * 10,
                                rotateY: springRotate,
                            }}
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
                        </motion.div>
                    ))}
                </motion.div>
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