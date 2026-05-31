'use client';

import { useLanguage } from '../context/LanguageContext';
import styles from './Contact.module.css';

export default function Contact() {
    const { t } = useLanguage();

    return (
        <section id="contact" className={styles.contact}>
            <div className="container">
                <h2 className={styles.heading}>{t('contact.heading.part1')} <span className="accent-text">{t('contact.heading.part2')}</span></h2>
                <div className={styles.grid}>
                    <div className={styles.info}>
                        <div className={styles.item}>
                            <span className={styles.icon}>📍</span>
                            <div>
                                <strong>{t('contact.address')}</strong>
                                <p>
                                    <a href="https://maps.google.com/?q=Krefelder+Str.+42,47226+Duisburg" target="_blank" rel="noopener noreferrer">
                                        Krefelder Str. 42, 47226 Duisburg
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.icon}>📞</span>
                            <div>
                                <strong>{t('contact.phone')}</strong>
                                <p>
                                    <a href="tel:+4920655507223">+49 2065 5507223</a>
                                </p>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.icon}>💬</span>
                            <div>
                                <strong>WhatsApp</strong>
                                <p>
                                    <a href="https://wa.me/491639676927" target="_blank" rel="noopener noreferrer">
                                        +49 163 9676927
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.icon}>📧</span>
                            <div>
                                <strong>E-Mail</strong>
                                <p>
                                    <a href="mailto:info@fahrschule-sedat.de">info@fahrschule-sedat.de</a>
                                </p>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.icon}>🕒</span>
                            <div>
                                <strong>{t('contact.hours')}</strong>
                                <p>
                                    {t('contact.days.mofr')} 12:00-18:00
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
