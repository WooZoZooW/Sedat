'use client';

import { useLanguage } from '../context/LanguageContext';
import styles from './LicenseClasses.module.css';

// Professional Minimalist Vector Icons (Monoline, Geometric)
// ViewBox: 0 0 64 64
// Stroke Width: 2
// Style: Side view, left-to-right (Car pulling trailer)

const CarIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Wheels */}
        <circle cx="16" cy="48" r="6" />
        <circle cx="48" cy="48" r="6" />
        {/* Chassis/Body */}
        <path d="M10 48H6V32H10L16 20H40L46 32H58V48H54" />
        <path d="M22 48H42" />
        {/* Window Line detail */}
        <path d="M32 20V32" strokeWidth="2" />
        <path d="M10 32H58" strokeWidth="2" />
    </svg>
);

// Adjusted Car for compositions (smaller, positioned left)
const CompositeCar = () => (
    <g transform="translate(0, 4) scale(0.9)">
        <circle cx="12" cy="44" r="5" strokeWidth="2.5" />
        <circle cx="36" cy="44" r="5" strokeWidth="2.5" />
        <path d="M7 44H4V32H7L11.5 23H29.5L34 32H44V44H41" strokeWidth="2.5" />
        <path d="M17 44H31" strokeWidth="2.5" />
        <path d="M7 32H44" strokeWidth="2" />
        <path d="M20.5 23V32" strokeWidth="2" />
    </g>
);

const CarTrailerIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Car Part (Left) */}
        <g transform="translate(-8, 4) scale(0.8)">
            <circle cx="14" cy="44" r="5" />
            <circle cx="38" cy="44" r="5" />
            <path d="M9 44H6V32H9L13.5 23H31.5L36 32H46V44H43" />
            <path d="M19 44H33" />
            <path d="M9 32H46" strokeWidth="2" />
        </g>

        {/* Connection */}
        <path d="M29 39H35" strokeWidth="2.5" />

        {/* Trailer Part (Right) */}
        <g transform="translate(35, 4) scale(0.8)">
            <circle cx="16" cy="44" r="5" />
            <path d="M6 31H26V44H21" />
            <path d="M11 44H6V36H2" /> {/* Hitch arm */}
            <rect x="6" y="22" width="20" height="9" strokeWidth="2.5" /> {/* Cargo Top (Optional) or just open trailer */}
            <path d="M6 22V31" />
            <path d="M26 22V31" />
        </g>
    </svg>
);

const CarTrailerSimpleIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Simplified Car (Left) */}
        <path d="M6 44H4V36H8L12 28H24L28 36H34V44H30" />
        <circle cx="10" cy="44" r="4" />
        <circle cx="26" cy="44" r="4" />

        {/* Hitch */}
        <path d="M34 40H40" />

        {/* Trailer (Right) */}
        <path d="M40 34H60V44H56" />
        <path d="M40 44H40V34" />
        <circle cx="52" cy="44" r="4" />
        <path d="M48 44H44" />
    </svg>
);

const CarCaravanSimpleIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Simplified Car (Left) */}
        <path d="M6 44H4V36H8L12 28H24L28 36H34V44H30" />
        <circle cx="10" cy="44" r="4" />
        <circle cx="26" cy="44" r="4" />

        {/* Hitch */}
        <path d="M34 40H38" />

        {/* Caravan (Right) - "House" shape */}
        <path d="M38 44H48" />
        <circle cx="52" cy="44" r="4" />
        <path d="M56 44H60V22H38V44" /> {/* Box body */}
        <path d="M38 28H60" strokeWidth="1.5" /> {/* Detail line */}
        <rect x="44" y="26" width="8" height="8" rx="1" strokeWidth="2" /> {/* Window */}
    </svg>
);


const classes = [
    { name: 'Klasse B', descKey: 'classes.B.desc', icon: <CarIcon /> },
    { name: 'Klasse B197', descKey: 'classes.B197.desc', icon: <CarIcon /> },
    { name: 'Klasse B78', descKey: 'classes.B78.desc', icon: <CarIcon /> },
    { name: 'Klasse BE', descKey: 'classes.BE.desc', icon: <CarTrailerSimpleIcon /> },
    { name: 'B96', descKey: 'classes.B96.desc', icon: <CarCaravanSimpleIcon /> },
];

export default function LicenseClasses() {
    const { t } = useLanguage();

    return (
        <section id="services" className={styles.classes}>
            <div className="container">
                <h2 className={styles.heading}>
                    {t('classes.heading.part1')}
                    {t('classes.heading.part1') && ' '}
                    <span className="accent-text">{t('nav.classes')}</span>
                </h2>
                <div className={styles.grid}>
                    {classes.map((cls, i) => (
                        <div key={i} className={`${styles.card} glass`}>
                            <div className={styles.icon} style={{ color: 'var(--accent)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {cls.icon}
                            </div>
                            <h3>{cls.name}</h3>
                            <p>{t(cls.descKey as any)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
