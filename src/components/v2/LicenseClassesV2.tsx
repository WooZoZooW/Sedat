'use client';

import { useLanguage } from '../../context/LanguageContext';
import styles from './LicenseClassesV2.module.css';

const classes = [
    { name: 'PKW Ausbildung', type: 'Klasse B', desc: 'Schalt- und Automatik-Fahrzeuge' },
    { name: 'Begleitetes Fahren', type: 'B197', desc: 'Die moderne Art der Ausbildung' },
    { name: 'Anhänger Training', type: 'Klasse BE', desc: 'Sicheres Fahren mit Gespann' },
];

export default function LicenseClassesV2() {
    const { t } = useLanguage();

    return (
        <section id="services" className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>Unsere <span style={{ color: 'var(--accent-secondary)' }}>{t('nav.classes')}</span></h2>
                <div className={styles.grid}>
                    {classes.map((cls, i) => (
                        <div key={i} className={styles.card}>
                            <span className={styles.type}>{cls.type}</span>
                            <h3>{cls.name}</h3>
                            <p>{cls.desc}</p>
                            <div className={styles.line}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
