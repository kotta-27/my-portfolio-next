'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import skills from '../data/skills.json';
import styles from './Skills.module.css';
import {
    SiReact,
    SiTypescript,
    SiCss3,
    SiQiskit,
    SiPython,
    SiNodedotjs,
    SiDocker,
    SiGit,
} from 'react-icons/si';
import { FaAws, FaAtom } from 'react-icons/fa6';

const skillIcons: Record<string, React.ReactNode> = {
    'React/Next.js': <SiReact />,
    'TypeScript': <SiTypescript />,
    'CSS/SCSS': <SiCss3 />,
    'Qiskit': <SiQiskit />,
    '量子アルゴリズム': <FaAtom />,
    'Quantum Algorithms': <FaAtom />,
    'Python': <SiPython />,
    'Node.js': <SiNodedotjs />,
    'AWS': <FaAws />,
    'Docker': <SiDocker />,
    'Git': <SiGit />,
};

const categoryAccents: Record<number, string> = {
    0: '#61dafb',  // Frontend - React blue
    1: '#a855f7',  // Quantum - Purple
    2: '#10b981',  // Backend - Green
    3: '#f59e0b',  // Infra - Amber
};

export default function Skills() {
    const { lang } = useLanguage();
    const skillData = skills[lang as keyof typeof skills];
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="skills" ref={sectionRef} className={styles.skillsSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Skills</h2>
            </div>
            <div className={styles.skillsContainer}>
                {skillData.categories.map((category, categoryIndex) => (
                    <div
                        key={categoryIndex}
                        className={`${styles.categoryContainer} ${isVisible ? styles.fadeIn : ''}`}
                        style={{
                            animationDelay: `${categoryIndex * 0.15}s`,
                            '--accent': categoryAccents[categoryIndex] || '#78b1eb',
                        } as React.CSSProperties}
                    >
                        <div className={styles.categoryHeader}>
                            <h3 className={styles.categoryTitle}>{category.name}</h3>
                            <div className={styles.categoryLine} />
                        </div>
                        <div className={styles.skillsList}>
                            {category.skills.map((skill, skillIndex) => (
                                <div
                                    key={skillIndex}
                                    className={`${styles.skillCard} ${isVisible ? styles.slideIn : ''}`}
                                    style={{
                                        animationDelay: `${categoryIndex * 0.15 + skillIndex * 0.1 + 0.2}s`,
                                    }}
                                >
                                    <div className={styles.skillHeader}>
                                        <div className={styles.skillNameRow}>
                                            <span className={styles.skillIcon}>
                                                {skillIcons[skill.name]}
                                            </span>
                                            <h4 className={styles.skillName}>{skill.name}</h4>
                                        </div>
                                        <span className={styles.skillYears}>
                                            {skill.years} {lang === 'ja' ? '年' : 'yrs'}
                                        </span>
                                    </div>
                                    <div className={styles.skillBarContainer}>
                                        <div
                                            className={`${styles.skillBar} ${isVisible ? styles.barAnimate : ''}`}
                                            style={{
                                                '--bar-width': `${skill.level}%`,
                                                animationDelay: `${categoryIndex * 0.15 + skillIndex * 0.1 + 0.4}s`,
                                            } as React.CSSProperties}
                                        />
                                        <span className={styles.skillLevel}>{skill.level}%</span>
                                    </div>
                                    <p className={styles.skillDescription}>{skill.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
