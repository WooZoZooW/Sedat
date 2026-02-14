'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './LanguageMenu.module.css';

const languages = [
    { code: 'de' as const, label: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr' as const, label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
];

export default function LanguageMenu() {
    const { lang: currentLang, setLang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code: typeof languages[0]['code']) => {
        setLang(code);
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={menuRef}>
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select Language"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                {/* Optional: Show current flag on desktop? Or just the globe. Keeping it clean with just globe. */}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`${styles.item} ${currentLang === lang.code ? styles.active : ''}`}
                            onClick={() => handleSelect(lang.code)}
                        >
                            <span className={styles.flag}>{lang.flag}</span>
                            <span className={styles.label}>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
