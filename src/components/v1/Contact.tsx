import styles from './Contact.module.css';

export default function Contact() {
    return (
        <section id="contact" className={styles.contact}>
            <div className="container">
                <h2 className={styles.heading}>Kontakt & <span className="accent-text">Anfahrt</span></h2>
                <div className={styles.grid}>
                    <div className={styles.info}>
                        <div className={styles.item}>
                            <span className={styles.icon}>📍</span>
                            <div>
                                <strong>Adresse</strong>
                                <p>Krefelder Str. 42, 47226 Duisburg</p>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.icon}>📞</span>
                            <div>
                                <strong>Telefon</strong>
                                <p>02065/5507223</p>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.icon}>💬</span>
                            <div>
                                <strong>WhatsApp</strong>
                                <p>+49 177 2650676</p>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.icon}>📧</span>
                            <div>
                                <strong>E-Mail</strong>
                                <p>info@fahrschule-sedat.de</p>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.icon}>🕒</span>
                            <div>
                                <strong>Öffnungszeiten</strong>
                                <p>Mo-Fr 12:00-18:00 Uhr<br />Samstag 10:00-15:00 Uhr</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.map}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2487.876352934244!2d6.687440376643264!3d51.40532497178749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8bfca6a0b0b0b%3A0x0!2sKrefelder%20Str.%2042%2C%2047226%20Duisburg!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde"
                            width="100%"
                            height="450"
                            style={{ border: 0, borderRadius: '20px' }}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
