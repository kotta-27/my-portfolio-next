import React from 'react';

const navItems = [
    { label: 'Home', to: '#home' },
    { label: 'About', to: '#about' },
    { label: 'Skills', to: '#skills' },
    { label: 'Projects', to: '#projects' },
    { label: 'Contact', to: '#contact' },
];

export default function Header() {
    return (
        <header className="header-glass">
            <nav className="header-nav">
                <span className="header-title">MyPortfolio</span>
                <ul className="header-menu">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <a href={item.to} className="header-link">{item.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
} 