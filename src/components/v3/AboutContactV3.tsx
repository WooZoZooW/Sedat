'use client';

import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import SocialButtons from '../shared/SocialButtons';
import styles from './AboutContactV3.module.css';

export default function AboutContactV3() {
    const { t } = useLanguage();

    return (
        <section id="about" className={styles.section}>
            <div className="container">
                <div className={styles.topRow}>
                    <div className={styles.aboutBox}>
                        <h2 className="neon-text">{t('about.title')}</h2>
                        <p>
                            {t('about.desc')}
                        </p>
                    </div>
                    <div className={styles.theoryBox}>
                        <div className={styles.theoryImage}>
                            <Image
                                src="https://lh3.googleusercontent.com/p/AF1QipPWgpeMF-l8cMvB_SVzsHgEvN5J-7Jg0UDGJc3a=s1600"
                                alt="Fahrschule Sedat Theorie"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.theoryContent}>
                            <h2 className="neon-text">{t('nav.theory')}</h2>
                            <div className={styles.times}>
                                <p>{t('theory.tuesday')} <span>18:00 - 19:30</span></p>
                                <p>{t('theory.thursday')} <span>18:00 - 19:30</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="contact" className={styles.contactFooter}>
                    <div className={styles.marquee}>
                        <span>KONTAKT // WHATSAPP // ANRUFEN // VORBEIKOMMEN // </span>
                        <span>KONTAKT // WHATSAPP // ANRUFEN // VORBEIKOMMEN // </span>
                    </div>
                    <div className={styles.contactDetails}>
                        <div className={styles.leftCol}>
                            <p>TEL: 02065/5507223</p>
                            <p>WA: +49 177 2650676</p>
                            <p>KREFELDER STR. 42 / DUISBURG</p>
                        </div>
                        <div className={styles.rightCol}>
                            <SocialButtons />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
