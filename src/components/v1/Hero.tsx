'use client';

import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Hero.module.css';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <Image
        src="https://lh3.googleusercontent.com/p/AF1QipPkd13573Ag1IK8cyI0p0MfvjoojCsov7BpKNwW=s1600"
        alt="Fahrschule Sedat Team"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          Fahrschule <span className="accent-text">Sedat</span>
        </h1>
        <p className={styles.subtitle}>
          Sicher ans Ziel – mit Kompetenz und Erfahrung. <br />
          Wir begleiten dich Schritt für Schritt von den ersten Theoriestunden bis zur praktischen Prüfung.
        </p>
        <div className={styles.buttons}>
          <a href="#contact" className={`${styles.primaryBtn} premium-gradient`}>{t('nav.join')}</a>
          <a href="#about" className={styles.secondaryBtn}>{t('nav.about')}</a>
        </div>
      </div>
    </section>
  );
}
