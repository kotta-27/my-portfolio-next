'use client';
import React, { useEffect, useState } from 'react';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import styles from './Hero.module.css';

export default function Hero() {
    const name = "Kota Mizuno";
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayed(name.slice(0, i + 1));
            i++;
            if (i === name.length) clearInterval(timer);
        }, 120);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="home" className={styles.heroSection}>
            {/* 右上にLEGOビームパーツSVGを追加 */}
            {/* <svg
                width="180"
                height="36"
                viewBox="0 0 180 36"
                style={{ position: 'absolute', top: 70, right: 40, zIndex: 20 }}
            >
                <rect x="4" y="8" width="172" height="20" rx="10" fill="#F9C909" stroke="#888" strokeWidth="2" />
                {[...Array(9)].map((_, i) => (
                    <circle
                        key={i}
                        cx={18 + i * 18}
                        cy={18}
                        r={7}
                        fill="#000"
                        stroke="#888"
                        strokeWidth="1.5"
                    />
                ))}
            </svg> */}
            <div className={styles.gearBg}>
                {/* 大ギア */}
                <svg width="220" height="220" className={`${styles.absolute} ${styles.animateSpinSlow} ${styles.opacity30}`} style={{ left: 40, top: 64 }} viewBox="0 0 220 220">
                    <defs>
                        <radialGradient id="gearGray" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#f3f4f6" />
                            <stop offset="100%" stopColor="#a3a3a3" />
                        </radialGradient>
                    </defs>
                    {/* 歯（外向き三角形） */}
                    <g>
                        {[...Array(32)].map((_, i) => {
                            const angle = (i * 360) / 32;
                            const rad = (angle * Math.PI) / 180;
                            const rOuter = 100; // 尖った先
                            const rInner = 88; // 底辺
                            const x1 = 110 + Math.cos(rad) * rOuter;
                            const y1 = 110 + Math.sin(rad) * rOuter;
                            const x2 = 110 + Math.cos(rad - 0.07) * rInner;
                            const y2 = 110 + Math.sin(rad - 0.07) * rInner;
                            const x3 = 110 + Math.cos(rad + 0.07) * rInner;
                            const y3 = 110 + Math.sin(rad + 0.07) * rInner;
                            return (
                                <polygon
                                    key={i}
                                    points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                                    fill="#888"
                                    stroke="#888"
                                    strokeWidth="1"
                                />
                            );
                        })}
                    </g>
                    {/* 本体円 */}
                    <circle cx="110" cy="110" r="85" fill="url(#gearGray)" stroke="#888" strokeWidth="4" />
                    {/* 内側の円穴 */}
                    {[...Array(3)].map((_, row) =>
                        [...Array(3)].map((_, col) => {
                            const cx = 65 + col * 45;
                            const cy = 65 + row * 45;
                            return <circle key={row + '-' + col} cx={cx} cy={cy} r="12" fill="#e5e7eb" stroke="#888" strokeWidth="2" />;
                        })
                    )}
                    {/* 十字穴（中央） */}
                    <g>
                        <rect x="100" y="90" width="20" height="40" rx="5" fill="#bdbdbd" stroke="#888" strokeWidth="2" />
                        <rect x="90" y="100" width="40" height="20" rx="5" fill="#bdbdbd" stroke="#888" strokeWidth="2" />
                    </g>
                </svg>
                {/* 小ギア */}
                <svg width="120" height="120" className={`${styles.absolute} ${styles.animateSpinSlowRev} ${styles.opacity20}`} style={{ left: 234, top: 64 }} viewBox="0 0 120 120">
                    <defs>
                        <radialGradient id="gearGray2" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#f3f4f6" />
                            <stop offset="100%" stopColor="#a3a3a3" />
                        </radialGradient>
                    </defs>
                    {/* 歯（外向き三角形） */}
                    <g>
                        {[...Array(20)].map((_, i) => {
                            const angle = (i * 360) / 20;
                            const rad = (angle * Math.PI) / 180;
                            const rOuter = 55;
                            const rInner = 47;
                            const x1 = 60 + Math.cos(rad) * rOuter;
                            const y1 = 60 + Math.sin(rad) * rOuter;
                            const x2 = 60 + Math.cos(rad - 0.09) * rInner;
                            const y2 = 60 + Math.sin(rad - 0.09) * rInner;
                            const x3 = 60 + Math.cos(rad + 0.09) * rInner;
                            const y3 = 60 + Math.sin(rad + 0.09) * rInner;
                            return (
                                <polygon
                                    key={i}
                                    points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                                    fill="#888"
                                    stroke="#888"
                                    strokeWidth="1"
                                />
                            );
                        })}
                    </g>
                    {/* 本体円 */}
                    <circle cx="60" cy="60" r="45" fill="url(#gearGray2)" stroke="#888" strokeWidth="3" />
                    {/* 内側の円穴 */}
                    {[...Array(2)].map((_, row) =>
                        [...Array(2)].map((_, col) => {
                            const cx = 38 + col * 44;
                            const cy = 38 + row * 44;
                            return <circle key={row + '-' + col} cx={cx} cy={cy} r="8" fill="#e5e7eb" stroke="#888" strokeWidth="1.5" />;
                        })
                    )}
                    {/* 十字穴（中央） */}
                    <g>
                        <rect x="54" y="44" width="12" height="32" rx="3" fill="#bdbdbd" stroke="#888" strokeWidth="1.5" />
                        <rect x="44" y="54" width="32" height="12" rx="3" fill="#bdbdbd" stroke="#888" strokeWidth="1.5" />
                    </g>
                </svg>
            </div>
            <div className={styles.heroProfile}>
                <img src="/icon.png" alt="Profile" className={styles.heroProfileImg} />
                <h1 className={styles.heroTitle}>
                    {displayed}
                    <span className={styles.heroCursor} />
                </h1>
                <p className={styles.heroSubtitle}>Web Developer</p>
                <p className={styles.heroSubtitle}>Quantum Computing</p>
            </div>
            <div className={styles.heroArrow}>
                <ArrowDownIcon className={`${styles.heroArrowIcon} ${styles.w6} ${styles.h6}`} />
            </div>
        </section>
    );
} 