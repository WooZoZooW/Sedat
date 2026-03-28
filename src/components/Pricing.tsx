import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Pricing.module.css';

const pricingData = [
  {
    nameKey: "pricing.cat.B",
    items: [
      { labelKey: "pricing.item.grund", price: "250,00" },
      { labelKey: "pricing.item.lesson", price: "55,00" },
      { labelKey: "pricing.item.special", price: "55,00" },
      { labelKey: "pricing.item.instruction", price: "55,00" },
      { labelKey: "pricing.item.theory_exam", price: "100,00" },
      { labelKey: "pricing.item.praxis_exam", price: "200,00" },
    ]
  },
  {
    nameKey: "pricing.cat.BE",
    items: [
      { labelKey: "pricing.item.grund", price: "250,00" },
      { labelKey: "pricing.item.lesson", price: "60,00" },
      { labelKey: "pricing.item.special", price: "60,00" },
      { labelKey: "pricing.item.instruction", price: "60,00" },
      { labelKey: "pricing.item.praxis_exam_be", price: "250,00" },
      { labelKey: "pricing.item.partial_praxis", price: "60,00" },
      { labelKey: "pricing.item.partial_check", price: "60,00" },
      { labelKey: "pricing.item.partial_connect", price: "60,00" },
    ]
  },
  {
    nameKey: "pricing.cat.B96",
    items: [
      { labelKey: "pricing.item.grund", price: "250,00" },
      { labelKey: "pricing.item.lesson", price: "60,00" },
      { labelKey: "pricing.item.special", price: "60,00" },
      { labelKey: "pricing.item.instruction", price: "60,00" },
      { labelKey: "pricing.item.partial_praxis", price: "60,00" },
      { labelKey: "pricing.item.partial_connect", price: "60,00" },
    ]
  }
];

const Pricing = () => {
    const { t } = useLanguage();

    return (
        <section className={`section-padding ${styles.pricingSection}`} id="pricing">
            <div className={`container ${styles.container}`}>
                <div className={styles.header}>
                    <h2 className="section-title">
                        {t('pricing.heading.part1')} <span className="accent-text">{t('pricing.heading.part2')}</span>
                    </h2>
                    <p className={styles.subtitle}>PREISAUSHANG nach § 32 Fahrlehrergesetz</p>
                </div>

                <div className={styles.grid}>
                    {pricingData.map((category, idx) => (
                        <div key={idx} className={`glass-card ${styles.pricingCard}`}>
                            <div className={styles.cardHeader}>
                                <h3>{t(category.nameKey as any)}</h3>
                            </div>
                            <ul className={styles.priceList}>
                                {category.items.map((item, i) => (
                                    <li key={i} className={styles.priceItem}>
                                        <span className={styles.label}>{t(item.labelKey as any)}</span>
                                        <span className={styles.price}>{item.price} €</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                <div className={styles.seminars}>
                    <h3>{t('pricing.seminars.title')}</h3>
                    <div className={styles.seminarCards}>
                        <div className={`glass-card ${styles.seminarCard}`}>
                            <h4>{t('pricing.seminars.asf.name')}</h4>
                            <p>{t('pricing.seminars.asf.desc')}</p>
                            <span className={styles.price}>{t('pricing.seminars.on_request')}</span>
                        </div>
                        <div className={`glass-card ${styles.seminarCard}`}>
                            <h4>{t('pricing.seminars.fes.name')}</h4>
                            <p>{t('pricing.seminars.fes.desc')}</p>
                            <span className={styles.price}>{t('pricing.seminars.on_request')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
