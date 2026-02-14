'use client';

import { useLanguage } from '../../context/LanguageContext';
import styles from './LanguageSwitcher.module.css';

const languages = [
    { code: 'de' as const, label: 'DE', flag: '🇩🇪' },
    { code: 'tr' as const, label: 'TR', flag: '🇹🇷' },
    { code: 'en' as const, label: 'EN', flag: '🇬🇧' },
    { code: 'ru' as const, label: 'RU', flag: '🇷🇺' },
];

export default function LanguageSwitcher() {
    const { lang: currentLang, setLang } = useLanguage();

    return (
        <div className={styles.switcher}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    className={`${styles.langBtn} ${currentLang === lang.code ? styles.active : ''}`}
                    onClick={() => setLang(lang.code)}
                    title={lang.label}
                >
                    <span className={styles.flag}>{lang.flag}</span>
                    <span className={styles.label}>{lang.label}</span>
                </button>
            ))}
        </div>
    );
}
