import Image from 'next/image';
import styles from './AboutV2.module.css';

export default function AboutV2() {
    return (
        <section id="about" className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/assets/car1.jpg"
                            alt="Driving School"
                            width={600}
                            height={400}
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.content}>
                        <h2 className={styles.title}>Persönliche Betreuung</h2>
                        <p className={styles.lead}>
                            Bei uns sind Sie nicht nur eine Nummer. Wir legen Wert auf ein freundliches Miteinander
                            und eine Ausbildung, die zu Ihrem Leben passt.
                        </p>
                        <div className={styles.text}>
                            <p>
                                Unser Team erfahrener Fahrlehrer begleitet Sie Schritt für Schritt von den ersten
                                Theoriestunden bis zur praktischen Prüfung. Wir fördern ein angstfreies Lernen,
                                das Spaß macht und für Sicherheit auf der Straße sorgt.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
