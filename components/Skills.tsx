'use client';

import React from 'react';
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
    0: '#61dafb',
    1: '#a855f7',
    2: '#10b981',
    3: '#f59e0b',
};

export default function Skills() {
    const { lang } = useLanguage();
    const skillData = skills[lang as keyof typeof skills];

    return (
        <section id="skills" className={styles.skillsSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Skills</h2>
            </div>
            <div className={styles.skillsContainer}>
                {skillData.categories.map((category, categoryIndex) => (
                    <div
                        key={categoryIndex}
                        className={styles.categoryCard}
                        style={{ '--accent': categoryAccents[categoryIndex] || '#78b1eb' } as React.CSSProperties}
                    >
                        <h3 className={styles.categoryTitle}>{category.name}</h3>
                        <div className={styles.chips}>
                            {category.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className={styles.chip}>
                                    <span className={styles.chipIcon}>{skillIcons[skill.name]}</span>
                                    <span className={styles.chipLabel}>{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
