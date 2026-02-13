'use client';

import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import SocialButtons from '../shared/SocialButtons';
import styles from './TheoryContactV2.module.css';

export default function TheoryContactV2() {
    const { t } = useLanguage();

    return (
        <section id="contact" className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={`${styles.box} glass`}>
                        <div className={styles.imageOverlay}>
                            <Image
                                src="https://lh3.googleusercontent.com/p/AF1QipPWgpeMF-l8cMvB_SVzsHgEvN5J-7Jg0UDGJc3a=s1600"
                                alt="Theorieunterricht"
                                fill
                                style={{ objectFit: 'cover', opacity: 0.15 }}
                            />
                        </div>
                        <div className={styles.content}>
                            <span className={styles.label}>Zeitplan</span>
                            <h2 className={styles.title}>{t('theory.title')}</h2>
                            <div className={styles.schedule}>
                                <div className={styles.row}>
                                    <span>{t('theory.tuesday')}</span>
                                    <strong>18:00 - 19:30</strong>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.row}>
                                    <span>{t('theory.thursday')}</span>
                                    <strong>18:00 - 19:30</strong>
                                </div>
                            </div>
                            <div className={styles.socialBox}>
                                <span className={styles.socialTitle}>{t('contact.label')}</span>
                                <SocialButtons />
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.box} glass`}>
                        <div className={styles.content}>
                            <span className={styles.label}>Erreichbarkeit</span>
                            <h2 className={styles.title}>{t('contact.title')}</h2>
                            <div className={styles.info}>
                                <p>Telefon: 02065/5507223</p>
                                <p>WhatsApp: +49 177 2650676</p>
                                <p>Email: info@fahrschule-sedat.de</p>
                                <p className={styles.address}>Krefelder Str. 42<br />47226 Duisburg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
