import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/kotta-27', label: 'GitHub' },
    { icon: <FaTwitter />, url: 'https://twitter.com/yourname', label: 'Twitter' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/mizuno-kota-574a3233b/', label: 'LinkedIn' },
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <span className="footer-copy">&copy; {new Date().getFullYear()} Your Name</span>
                <div className="footer-socials">
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-social-link"
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