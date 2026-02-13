'use client';

import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import styles from './HeroV3.module.css';

export default function HeroV3() {
    const { t } = useLanguage();

    return (
        <section className={styles.hero}>
            <div className={styles.bg}>
                <Image
                    src="https://lh3.googleusercontent.com/p/AF1QipPkd13573Ag1IK8cyI0p0MfvjoojCsov7BpKNwW=s1600"
                    alt="Fahrschule Sedat Car"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    {t('hero.v3.title1')} <br />
                    <span className="neon-text">{t('hero.v3.title2')}</span>
                </h1>
                <div className={styles.details}>
                    <p>{t('hero.v3.subtitle')}</p>
                </div>
                <div className={styles.cta}>
                    <a href="#contact" className="btn-pulse">{t('hero.v3.btn')}</a>
                </div>
            </div>
            <div className={styles.slantedLine}></div>
        </section>
    );
}
