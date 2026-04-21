'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Promotion.module.css';

const Promotion = () => {
    const { t } = useLanguage();
    const [isTossing, setIsTossing] = useState(false);

    const handleToss = () => {
        if (isTossing) return;
        setIsTossing(true);
        setTimeout(() => setIsTossing(false), 2500); // Sync with CSS duration
    };

    return (
        <section className={styles.promotionContainer}>
            <div className={styles.banner}>
                <div className={styles.decorativeShapes}>
                    <div className={styles.shape1}></div>
                    <div className={styles.shape2}></div>
                </div>
                
                <div className={styles.content}>
                    <span className={styles.tag}>{t('promo.title')}</span>
                    <h2 className={styles.title}>
                        FRÜHLINGS<br />
                        <span className="accent-text">AKTION</span>
                    </h2>
                    <p className={styles.subtitle}>{t('promo.subtitle')}</p>
                </div>

                <div 
                    className={`${styles.priceCircle} ${isTossing ? styles.tossing : ''}`}
                    onClick={handleToss}
                >
                    <div className={styles.priceLabel}>Anmeldung</div>
                    <div className={styles.priceBefore}>statt 250 €</div>
                    <div className={styles.priceNow}>100 €</div>
                    <div className={styles.includes}>{t('promo.include')}</div>
                </div>
            </div>
        </section>
    );
};

export default Promotion;
