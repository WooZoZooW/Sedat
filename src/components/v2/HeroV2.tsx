'use client';

import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import styles from './HeroV2.module.css';

export default function HeroV2() {
    const { t } = useLanguage();

    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.topLabel}>{t('hero.v2.top')}</span>
                    <h1 className={styles.title}>
                        {t('hero.v2.title')} <br />
                        <span className="gold-text">{t('hero.v2.with')}</span>
                    </h1>
                    <p className={styles.subtitle}>
                        {t('hero.v2.subtitle')}
                    </p>
                    <div className={styles.cta}>
                        <a href="#contact" className={styles.btnTurkish}>{t('hero.v2.btn')}</a>
                    </div>
                </div>
                <div className={`${styles.imageWrapper} glass`}>
                    <Image
                        src="https://lh3.googleusercontent.com/p/AF1QipPkd13573Ag1IK8cyI0p0MfvjoojCsov7BpKNwW=s1600"
                        alt="Fahrschule Sedat Team"
                        width={800}
                        height={450}
                        className={styles.image}
                    />
                </div>
            </div>
        </section>
    );
}
