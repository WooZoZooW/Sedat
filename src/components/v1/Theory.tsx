'use client';

import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import SocialButtons from '../shared/SocialButtons';
import styles from './Theory.module.css';

export default function Theory() {
    const { t } = useLanguage();

    return (
        <section id="theory" className={styles.theory}>
            <div className="container">
                <div className={`${styles.box} premium-gradient`}>
                    <div className={styles.imageOverlay}>
                        <Image
                            src="https://lh3.googleusercontent.com/p/AF1QipPWgpeMF-l8cMvB_SVzsHgEvN5J-7Jg0UDGJc3a=s1600"
                            alt="Theorieunterricht"
                            fill
                            style={{ objectFit: 'cover', opacity: 0.2 }}
                        />
                    </div>
                    <div className={styles.content}>
                        <h2>{t('theory.title')}</h2>
                        <p>{t('theory.subtitle')}</p>
                        <div className={styles.schedule}>
                            <div className={styles.day}>
                                <span>{t('theory.tuesday')}</span>
                                <strong>18:00 - 19:30 Uhr</strong>
                            </div>
                            <div className={styles.day}>
                                <span>{t('theory.thursday')}</span>
                                <strong>18:00 - 19:30 Uhr</strong>
                            </div>
                        </div>
                        <p className={styles.note}>{t('theory.note')}</p>
                        <div className={styles.socialInline}>
                            <span className={styles.socialLabel}>{t('contact.label')}</span>
                            <SocialButtons />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
