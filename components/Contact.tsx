'use client';
import React from 'react';
import styles from './Contact.module.css';
import { useLanguage } from '../context/LanguageContext';
import contactData from '../data/contact.json';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/kotta-27', label: 'GitHub' },
    { icon: <FaXTwitter />, url: 'https://x.com/Mel134983774', label: 'X' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/mizuno-kota-574a3233b/', label: 'LinkedIn' },
];

export default function Contact() {
    const { lang } = useLanguage();
    return (
        <section id="contact" className={styles.contactSection}>
            <div className={styles.contactContainer}>
                <h2 className={styles.sectionTitle}>{contactData[lang].title}</h2>
                <p className={styles.contactText}>{contactData[lang].text}</p>
                <a href="mailto:your.email@example.com" className={styles.contactBtn}>
                    {contactData[lang].button}
                </a>
                <div className={styles.socialLinks}>
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label={link.label}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
