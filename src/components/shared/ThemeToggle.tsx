'use client';

import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const iconProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

const SunIcon = () => (
    <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
);

const MoonIcon = () => (
    <svg {...iconProps}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export default function ThemeToggle({ className }: { className?: string }) {
    const { mode, resolved, setMode } = useTheme();
    const { t } = useLanguage();

    const handleToggle = () => {
        if (mode === 'system') {
            setMode(resolved === 'dark' ? 'light' : 'dark');
        } else {
            setMode('system');
        }
    };

    return (
        <button
            type="button"
            className={`${styles.trigger} ${className || ''}`}
            onClick={handleToggle}
            aria-label={t('theme.label')}
            title={t('theme.label')}
        >
            <span className={`${styles.icon} ${styles.iconLight}`}>
                <SunIcon />
            </span>
            <span className={`${styles.icon} ${styles.iconDark}`}>
                <MoonIcon />
            </span>
        </button>
    );
}
