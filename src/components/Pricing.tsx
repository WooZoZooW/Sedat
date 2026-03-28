import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Pricing.module.css';

const pricingData = [
  {
    name: "Klasse B & B197",
    items: [
      { label: "Grundbetrag", price: "250,00" },
      { label: "Fahrstunde (45 Min.)", price: "55,00" },
      { label: "Besondere Ausbildungsfahrten (Überland, Autobahn, Nacht)", price: "55,00" },
      { label: "Unterweisung am Fahrzeug (45 Min.)", price: "55,00" },
      { label: "Vorstellungsentgelt Theorie", price: "100,00" },
      { label: "Vorstellungsentgelt Praxis", price: "200,00" },
    ]
  },
  {
    name: "Klasse BE",
    items: [
      { label: "Grundbetrag", price: "250,00" },
      { label: "Fahrstunde (45 Min.)", price: "60,00" },
      { label: "Besondere Ausbildungsfahrten (Überland, Autobahn, Nacht)", price: "60,00" },
      { label: "Unterweisung am Fahrzeug (45 Min.)", price: "60,00" },
      { label: "Vorstellungsentgelt Praxisprüfung", price: "250,00" },
      { label: "Teilprüfung Praktisches Fahren", price: "60,00" },
      { label: "Teilprüfung Abfahrtkontrolle", price: "60,00" },
      { label: "Teilprüfung Verbinden/Trennen", price: "60,00" },
    ]
  },
  {
    name: "Klasse B96",
    items: [
      { label: "Grundbetrag", price: "250,00" },
      { label: "Fahrstunde (45 Min.)", price: "60,00" },
      { label: "Besondere Ausbildungsfahrten (Überland, Autobahn, Nacht)", price: "60,00" },
      { label: "Unterweisung am Fahrzeug (45 Min.)", price: "60,00" },
      { label: "Teilprüfung Praktisches Fahren", price: "60,00" },
      { label: "Teilprüfung Verbinden/Trennen", price: "60,00" },
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
                                <h3>{category.name}</h3>
                            </div>
                            <ul className={styles.priceList}>
                                {category.items.map((item, i) => (
                                    <li key={i} className={styles.priceItem}>
                                        <span className={styles.label}>{item.label}</span>
                                        <span className={styles.price}>{item.price} €</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                <div className={styles.seminars}>
                    <h3>Seminare</h3>
                    <div className={styles.seminarCards}>
                        <div className={`glass-card ${styles.seminarCard}`}>
                            <h4>ASF</h4>
                            <p>Aufbauseminar für Fahranfänger</p>
                            <span className={styles.price}>Auf Anfrage</span>
                        </div>
                        <div className={`glass-card ${styles.seminarCard}`}>
                            <h4>FES</h4>
                            <p>Fahreignungsseminar</p>
                            <span className={styles.price}>Auf Anfrage</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
