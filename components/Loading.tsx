'use client';
import React from 'react';
import styles from './Loading.module.css';
import Image from 'next/image';

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingContent}>
                <div className={styles.gearContainer}>
                    <Image
                        src="/lego-block.svg"
                        alt="Loading"
                        width={60}
                        height={60}
                        className={styles.spinningGear}
                    />
                </div>
                <div className={styles.loadingText}>Loading...</div>
            </div>
        </div>
    );
}
