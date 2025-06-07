'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaReact, FaVuejs, FaDocker } from 'react-icons/fa';
import { BiLogoTypescript } from "react-icons/bi";
import { SiRubyonrails, SiDjango } from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import styles from './Skills.module.css';
import { SiGooglecloud } from "react-icons/si";

const skills = [
    // フロントエンド
    { icon: <FaVuejs />, name: 'Vue.js', colorCode: '#3EB27F', iconColor: '#fff', textColor: '#000', category: 'frontend' },
    { icon: <BiLogoTypescript />, name: 'TypeScript', colorCode: '#3b82f6', iconColor: '#fff', textColor: '#fff', category: 'frontend' },
    { icon: <FaReact />, name: 'React', colorCode: '#22d3ee', iconColor: '#000', textColor: '#000', category: 'frontend' },
    // バックエンド
    { icon: <SiRubyonrails />, name: 'Ruby on Rails', colorCode: '#CC0102', iconColor: '#fff', textColor: '#fff', category: 'backend' },
    { icon: <SiDjango />, name: 'Django', colorCode: '#459285', iconColor: '#fff', textColor: '#fff', category: 'backend' },
    // その他
    { icon: <FaDocker />, name: 'Docker', colorCode: '#2496ED', iconColor: '#fff', textColor: '#fff', category: 'other' },
    { icon: <FaAws />, name: 'AWS', colorCode: '#F69400', iconColor: '#242E3C', textColor: '#fff', category: 'other' },
    { icon: <SiGooglecloud />, name: 'GCP', colorCode: '#2496ED', iconColor: '#fff', textColor: '#fff', category: 'other' },
];

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);
    return matches;
}

export default function Skills() {
    const [visibleCount, setVisibleCount] = useState(0);
    const [startAnim, setStartAnim] = useState(false);
    const skillsRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Intersection Observerで表示時にアニメ開始
    useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setStartAnim(true);
            },
            { threshold: 0.6 }
        );
        if (skillsRef.current) observer.observe(skillsRef.current);
        return () => observer.disconnect();
    }, []);

    // アニメーション制御（下から上に）
    useEffect(() => {
        if (startAnim && visibleCount < skills.length) {
            const timer = setTimeout(() => setVisibleCount(visibleCount + 1), 180);
            return () => clearTimeout(timer);
        }
    }, [startAnim, visibleCount]);

    // 3列分割（下から上にするためreverse）
    const col1 = skills.filter(skill => skill.category === 'frontend').reverse();
    const col2 = skills.filter(skill => skill.category === 'backend').reverse();
    const col3 = skills.filter(skill => skill.category === 'other').reverse();

    return (
        <section id="skills" className={styles.skillsSection} ref={skillsRef}>
            <div className={styles.skillsContainer}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                <div className={styles.skillsList3col}>
                    {[col1, col2, col3].map((col, colIdx) => (
                        <div className={styles.skillsCol} key={colIdx}>
                            {col.map((skill, idx) => {
                                const isLast = idx === col.length - 1;
                                const globalIdx = skills.length - 1 - (colIdx + idx * 3);
                                return (
                                    <div
                                        key={skill.name}
                                        className={`${styles.legoBlock} ${styles.skillBlockAnim}`}
                                        style={{
                                            background: skill.colorCode,
                                            opacity: globalIdx < visibleCount ? 1 : 0,
                                            transform: globalIdx < visibleCount ? 'translateY(0)' : 'translateY(40px)',
                                            transition: 'all 0.8s cubic-bezier(.68,-0.55,.27,1.55)',
                                            zIndex: globalIdx,
                                            marginBottom: isLast ? 0 : (visibleCount === skills.length ? '-34px' : '20px'),
                                        }}
                                    >
                                        <div className={styles.legoPotchRow}>
                                            {[...Array(isMobile ? 2 : 4)].map((_, i) => (
                                                <span key={i} className={styles.legoPotch} style={{ background: skill.colorCode }}></span>
                                            ))}
                                        </div>
                                        <div className={styles.skillIcon} style={{ color: skill.iconColor }}>{skill.icon}</div>
                                        <span className={styles.skillName} style={{ color: skill.textColor }}>{skill.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 