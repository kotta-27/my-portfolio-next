import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <span className={styles.footerCopy}>
                &copy; {new Date().getFullYear()} Kota Mizuno
            </span>
        </footer>
    );
}
