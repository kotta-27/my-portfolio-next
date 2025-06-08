'use client';
import React from 'react';
import styles from './Contact.module.css';
import { useLanguage } from '../context/LanguageContext';
import contactData from '../data/contact.json';

export default function Contact() {
    const { lang } = useLanguage();
    return (
        <section id="contact" className={styles.contactSection}>
            <div className={styles.contactContainer}>
                <div className={styles.sectionTitleContainer}>
                    <h2 className={styles.sectionTitle}>{contactData[lang].title}</h2>
                </div>
                <div className={styles.contactText}>
                    {contactData[lang].text}
                </div>
                <a href="mailto:your.email@example.com" className={styles.contactBtn}>{contactData[lang].button}</a>
            </div>
        </section>
    );
} 