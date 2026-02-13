'use client';

import { useLanguage } from '../../context/LanguageContext';
import styles from './LicenseClasses.module.css';

const classes = [
    { name: 'Klasse B', desc: 'Auto (Schaltgetriebe)', icon: '🚗' },
    { name: 'Klasse B197', desc: 'Automatik-Ausbildung mit Schalt-Kompetenz', icon: '🚙' },
    { name: 'Klasse B78', desc: 'Reines Automatik-Fahrzeug', icon: '⚡' },
    { name: 'Klasse BE', desc: 'PKW mit Anhänger', icon: '🛒' },
    { name: 'B96', desc: 'PKW mit schwerem Anhänger', icon: '🏗️' },
];

export default function LicenseClasses() {
    const { t } = useLanguage();

    return (
        <section id="services" className={styles.classes}>
            <div className="container">
                <h2 className={styles.heading}>Unsere <span className="accent-text">{t('nav.classes')}</span></h2>
                <div className={styles.grid}>
                    {classes.map((cls, i) => (
                        <div key={i} className={`${styles.card} glass`}>
                            <div className={styles.icon}>{cls.icon}</div>
                            <h3>{cls.name}</h3>
                            <p>{cls.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
