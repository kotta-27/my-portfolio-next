'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import skills from '../data/skills.json';
import styles from './Skills.module.css';

export default function Skills() {
    const { lang } = useLanguage();
    const skillData = skills[lang as keyof typeof skills];

    return (
        <section className={styles.skillsSection}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skillsContainer}>
                {skillData.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className={styles.categoryContainer}>
                        <h3 className={styles.categoryTitle}>{category.name}</h3>
                        <div className={styles.skillsList}>
                            {category.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className={styles.skillCard}>
                                    <div className={styles.skillHeader}>
                                        <h4 className={styles.skillName}>{skill.name}</h4>
                                        <span className={styles.skillYears}>{skill.years} {lang === 'ja' ? '年' : 'years'}</span>
                                    </div>
                                    <div className={styles.skillBarContainer}>
                                        <div
                                            className={styles.skillBar}
                                            style={{ width: `${skill.level}%` }}
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