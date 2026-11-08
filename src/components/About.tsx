import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import styles from './About.module.css';

export default function About() {
    const { t } = useLanguage();

    return (
        <section id="about" className={styles.about}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <h2 className={styles.heading}>
                            {t('about.heading.part1')}
                            {t('about.heading.part1') && ' '}
                            <span className="accent-text">{t('about.heading.part2')}</span>
                        </h2>
                        <p>
                            {t('about.p1')}
                        </p>
                        <p>
                            {t('about.p2')}
                        </p>
                        <div className={styles.features}>
                            <div className={styles.featureItem}>
                                <span className={styles.check}>✓</span> {t('about.feature1')}
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.check}>✓</span> {t('about.feature2')}
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.check}>✓</span> {t('about.feature3')}
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.check}>✓</span> {t('about.feature4')}
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.check}>✓</span> {t('about.feature5')}
                            </div>
                        </div>
                    </div>
                    <figure className={styles.imageWrapper}>
                        <div className={styles.photoInner}>
                            <Image
                                src="/assets/car1.jpg"
                                alt="Unser Schulungsfahrzeug"
                                width={500}
                                height={600}
                                className={styles.image}
                            />
                        </div>
                        <figcaption className={styles.caption}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M12 2c1.4 3.4 4.6 5.3 4.6 9.1a4.6 4.6 0 1 1-9.2 0c0-1.7.7-3 1.7-4.2.4 1.1 1.1 2 2.1 2.5C11.1 6.4 10.7 4.1 12 2z"
                                    fill="url(#flameGradient)"
                                />
                                <defs>
                                    <linearGradient id="flameGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#ffb347" />
                                        <stop offset="1" stopColor="#E30A17" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            Fahrschule Sedat · Duisburg
                        </figcaption>
                    </figure>
                </div>
            </div>
        </section>
    );
}
