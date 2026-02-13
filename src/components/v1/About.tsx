import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
    return (
        <section id="about" className={styles.about}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <h2 className={styles.heading}>Über <span className="accent-text">uns</span></h2>
                        <p>
                            Unsere Fahrschule in Duisburg-Rheinhausen begleitet dich zuverlässig auf deinem Weg zum Führerschein.
                            Unser Team erfahrener Fahrlehrer:innen (m/w/d) begleitet dich Schritt für Schritt von den ersten
                            Theoriestunden bis zur praktischen Prüfung.
                        </p>
                        <p>
                            Bei uns bist du nicht nur Fahrschüler:in, du wirst Teil unserer Fahrschul-Familie.
                            Wir legen Wert auf ein freundliches Miteinander, individuelle Betreuung und ein Lernen,
                            das Spaß macht und sicher ist.
                        </p>
                        <div className={styles.features}>
                            <div className={styles.featureItem}>
                                <span className={styles.check}>✓</span> Freundliche Fahrlehrer/innen
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.check}>✓</span> Moderne Ausbildungsfahrzeuge
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.check}>✓</span> Entspannte Atmosphäre
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
