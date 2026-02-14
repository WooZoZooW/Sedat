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
                        </div>
                    </div>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/assets/car1.jpg"
                            alt="Unser Schulungsfahrzeug"
                            width={500}
                            height={600}
                            className={styles.image}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
