'use client';
import React, { useEffect, useState } from 'react';
import styles from './Hero.module.css';
import Image from 'next/image';
import { FaArrowDown } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const BrickCareer = dynamic(() => import('./BrickCareer'), { ssr: false });

export default function Hero() {
    const profile = {
        name: "Kota Mizuno",
        roles: ["Software Engineer", "Quantum Computing"],
    };

    const [displayedName, setDisplayedName] = useState("");
    const [displayedRoles, setDisplayedRoles] = useState<string[]>(["", ""]);
    const [flashIndex, setFlashIndex] = useState<number | null>(null);

    useEffect(() => {
        let i = 0;
        const nameTimer = setInterval(() => {
            setDisplayedName(profile.name.slice(0, i + 1));
            i++;
            if (i === profile.name.length) {
                clearInterval(nameTimer);
                startRoleTyping(0);
            }
        }, 120);
        return () => clearInterval(nameTimer);
    }, []);

    const startRoleTyping = (roleIndex: number) => {
        let i = 0;
        const roleTimer = setInterval(() => {
            setDisplayedRoles(prev => {
                const newRoles = [...prev];
                newRoles[roleIndex] = profile.roles[roleIndex].slice(0, i + 1);
                return newRoles;
            });
            i++;
            if (i === profile.roles[roleIndex].length) {
                clearInterval(roleTimer);
                setFlashIndex(roleIndex);
                setTimeout(() => setFlashIndex(null), 500);
                if (roleIndex < profile.roles.length - 1) {
                    setTimeout(() => startRoleTyping(roleIndex + 1), 800);
                }
            }
        }, 100);
    };

    return (
        <section id="home" className={styles.heroSection}>
            <div className={styles.heroProfile}>
                <div className={styles.heroProfileTopContainer}>
                    <Image src="/me-sq.jpg" alt="Profile" className={styles.heroProfileImg} width={150} height={150} />
                    <h1 className={styles.heroTitle}>
                        {displayedName}
                        {displayedName.length > 0 && displayedName.length < profile.name.length && (
                            <span className={styles.cursor} />
                        )}
                    </h1>

                    <div className={styles.roleContainer}>
                        {displayedRoles.map((role, index) => (
                            <div
                                key={index}
                                className={`${styles.heroSubtitleCard} ${flashIndex === index ? (index === 0 ? styles.flashBlue : styles.flashGreen) : ''}`}
                            >
                                <p className={styles.heroSubtitle}>
                                    {role}
                                    {role.length > 0 && role.length < profile.roles[index].length && (
                                        <span className={styles.cursor} />
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.arrowContainer}>
                        <FaArrowDown className={styles.arrowIcon} />
                    </div>
                </div>

                <div className={styles.aboutContainer}>
                    <BrickCareer />
                </div>
            </div>
        </section>
    );
}
