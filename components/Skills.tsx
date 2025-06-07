'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaReact, FaVuejs, FaGithub, FaDocker } from 'react-icons/fa';
import { BiLogoTypescript } from "react-icons/bi";
import { SiRubyonrails, SiDjango } from "react-icons/si";

const skills = [
    // フロントエンド
    { icon: <FaVuejs />, name: 'Vue.js', colorCode: '#4ade80', iconColor: '#fff', textColor: '#000', category: 'frontend' },
    { icon: <BiLogoTypescript />, name: 'TypeScript', colorCode: '#3b82f6', iconColor: '#fff', textColor: '#fff', category: 'frontend' },
    { icon: <FaReact />, name: 'React', colorCode: '#22d3ee', iconColor: '#000', textColor: '#000', category: 'frontend' },
    // バックエンド
    { icon: <SiRubyonrails />, name: 'Ruby on Rails', colorCode: '#CC0102', iconColor: '#fff', textColor: '#fff', category: 'backend' },
    { icon: <SiDjango />, name: 'Django', colorCode: '#ABC019', iconColor: '#fff', textColor: '#fff', category: 'backend' },
    // その他
    { icon: <FaGithub />, name: 'GitHub', colorCode: '#181717', iconColor: '#fff', textColor: '#fff', category: 'other' },
    { icon: <FaDocker />, name: 'Docker', colorCode: '#2496ED', iconColor: '#fff', textColor: '#fff', category: 'other' }
];

export default function Skills() {
    const [visibleCount, setVisibleCount] = useState(0);
    const [startAnim, setStartAnim] = useState(false);
    const skillsRef = useRef<HTMLDivElement>(null);

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
        <section id="skills" className="skills-section" ref={skillsRef}>
            <div className="skills-container">
                <h2 className="section-title">Skills</h2>
                <div className="skills-list-3col">
                    {[col1, col2, col3].map((col, colIdx) => (
                        <div className="skills-col" key={colIdx}>
                            {col.map((skill, idx) => {
                                const isLast = idx === col.length - 1;
                                const globalIdx = skills.length - 1 - (colIdx + idx * 3);
                                return (
                                    <div
                                        key={skill.name}
                                        className={`lego-block skill-block-anim`}
                                        style={{
                                            background: skill.colorCode,
                                            opacity: globalIdx < visibleCount ? 1 : 0,
                                            transform: globalIdx < visibleCount ? 'translateY(0)' : 'translateY(40px)',
                                            transition: 'all 0.8s cubic-bezier(.68,-0.55,.27,1.55)',
                                            zIndex: globalIdx,
                                            width: '100%',
                                            marginBottom: isLast ? 0 : (visibleCount === skills.length ? '-34px' : '20px'),
                                        }}
                                    >
                                        <div className="lego-potch-row">
                                            {[...Array(4)].map((_, i) => (
                                                <span key={i} className="lego-potch" style={{ background: skill.colorCode }}></span>
                                            ))}
                                        </div>
                                        <div className="skill-icon" style={{ color: skill.iconColor }}>{skill.icon}</div>
                                        <span className="skill-name" style={{ color: skill.textColor }}>{skill.name}</span>
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