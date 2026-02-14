import Navbar from '../../components/Navbar';
import Legal from '../../components/Legal';
import styles from '../page.module.css'; // Re-use main page styles for footer if needed

export default function LegalPage() {
    return (
        <main className={styles.main}>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <Legal />
            </div>

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerGrid}>
                        <div>
                            <h3>Sedat <span className="accent-text">Fahrschule</span></h3>
                            <p>Inh. Sedat Kapcak</p>
                            <p>Sicher ans Ziel in Duisburg.</p>
                        </div>
                        <div className={styles.links}>
                            {/* Self-referential links or back to home */}
                            <a href="/legal?tab=impressum">Impressum</a>
                            <a href="/legal?tab=datenschutz">Datenschutz</a>
                        </div>
                        <div className={styles.social}>
                            <a href="https://www.instagram.com/fahrschule__sedat" target="_blank">Instagram</a>
                            <a href="https://www.tiktok.com/@fahrschulesedat" target="_blank">TikTok</a>
                        </div>
                    </div>
                    <div className={styles.copyright}>
                        &copy; {new Date().getFullYear()} Fahrschule Sedat. Alle Rechte vorbehalten.
                    </div>
                </div>
            </footer>
        </main>
    );
}
