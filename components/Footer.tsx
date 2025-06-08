import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import styles from './Footer.module.css';

const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/kotta-27', label: 'GitHub' },
    { icon: <FaXTwitter />, url: 'https://x.com/Mel134983774', label: 'Twitter' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/mizuno-kota-574a3233b/', label: 'LinkedIn' },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <span className={styles.footerCopy}>&copy; {new Date().getFullYear()} Kota Mizuno</span>
                <div className={styles.footerSocials}>
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.footerSocialLink}
                            aria-label={link.label}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
} 