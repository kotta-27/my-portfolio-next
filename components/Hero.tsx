'use client';
import React, { useEffect, useState } from 'react';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import styles from './Hero.module.css';
import Image from 'next/image';

export default function Hero() {
    const texts = {
        name: "Kota Mizuno",
        roles: ["Web Developer", "Quantum Computing"]
    };
    const [displayedName, setDisplayedName] = useState("");
    const [displayedRoles, setDisplayedRoles] = useState(["", ""]);

    useEffect(() => {
        // Name typing animation
        let i = 0;
        const nameTimer = setInterval(() => {
            setDisplayedName(texts.name.slice(0, i + 1));
            i++;
            if (i === texts.name.length) {
                clearInterval(nameTimer);
                // Start role typing after name is complete
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
                newRoles[roleIndex] = texts.roles[roleIndex].slice(0, i + 1);
                return newRoles;
            });
            i++;
            if (i === texts.roles[roleIndex].length) {
                clearInterval(roleTimer);
                if (roleIndex < texts.roles.length - 1) {
                    setTimeout(() => startRoleTyping(roleIndex + 1), 500);
                }
            }
        }, 100);
    };

    return (
        <section id="home" className={styles.heroSection}>
            <div className={styles.heroProfile}>
                <Image src="/me-sq.jpg" alt="Profile" className={styles.heroProfileImg} width={150} height={150} />
                <h1 className={styles.heroTitle}>
                    {displayedName}
                    {displayedName.length > 0 && displayedName.length < texts.name.length && (
                        <span className={styles.cursor} />
                    )}
                </h1>
                {displayedRoles.map((role, index) => (
                    <div key={index} className={styles.heroSubtitleCard}>
                        <p className={styles.heroSubtitle}>
                            {role}
                            {role.length > 0 && role.length < texts.roles[index].length && (
                                <span className={styles.cursor} />
                            )}
                        </p>
                    </div>
                ))}
            </div>
            <div className={styles.heroArrow}>
                <ArrowDownIcon className={`${styles.heroArrowIcon} ${styles.w8} ${styles.h8}`} />
            </div>
        </section>
    );
}