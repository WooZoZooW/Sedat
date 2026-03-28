import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Pricing.module.css';

const Pricing = () => {
    const { t } = useLanguage();

    return (
        <section className={`section-padding ${styles.pricingSection}`} id="pricing">
            <div className={`container ${styles.container}`}>
                <h2 className="section-title">
                    {t('pricing.heading.part1')} <span className="accent-text">{t('pricing.heading.part2')}</span>
                </h2>
                <div className={`glass-card ${styles.placeholderCard}`}>
                    <p>{t('pricing.placeholder')}</p>
                    <div className={styles.imagePlaceholder}>
                        [ Hier kann ein Bild oder eine Tabelle mit Preisen eingefügt werden / Place for price image or table ]
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
