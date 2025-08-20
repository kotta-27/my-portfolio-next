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
            <div className={styles.heroProfile}>
                <img src="/icon.png" alt="Profile" className={styles.heroProfileImg} />
                <h1 className={styles.heroTitle}>
                    {displayed}
                    <span className={styles.heroCursor} />
                </h1>
                <div className={styles.heroSubtitleCard}>
                    <p className={styles.heroSubtitle}>Web Developer</p>
                </div>
                <div className={styles.heroSubtitleCard}>
                    <p className={styles.heroSubtitle}>Quantum Computing</p>
                </div>
            </div>
            <div className={styles.heroArrow}>
                <ArrowDownIcon className={`${styles.heroArrowIcon} ${styles.w8} ${styles.h8}`} />
            </div>
        </section>
    );
}