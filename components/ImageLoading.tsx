'use client';
import React from 'react';
import styles from './ImageLoading.module.css';

export default function ImageLoading() {
    return (
        <div className={styles.imageLoadingContainer}>
            <div className={styles.shimmer}></div>
        </div>
    );
}
