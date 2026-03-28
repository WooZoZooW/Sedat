'use client';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import LicenseClasses from '../components/LicenseClasses';
import Theory from '../components/Theory';
import Contact from '../components/Contact';
import Pricing from '../components/Pricing';
import { useLanguage } from '../context/LanguageContext';
import styles from './page.module.css';

export default function Home() {
    const { t } = useLanguage();

    return (
        <main className={styles.main}>
            <Navbar />
            <Hero />
            <About />
            <Pricing />
            <LicenseClasses />
            <Theory />
            <Contact />

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerGrid}>
                        <div>
                            <h3>Sedat <span className="accent-text">Fahrschule</span></h3>
                            <p>Inh. Sedat Kapcak</p>
                            <p>{t('footer.tagline')}</p>
                        </div>
                        <div className={styles.links}>
                            <a href="/legal?tab=impressum">Impressum</a>
                            <a href="/legal?tab=datenschutz">Datenschutz</a>
                        </div>
                        <div className={styles.social}>
                            <a href="https://www.instagram.com/fahrschule__sedat" target="_blank">Instagram</a>
                            <a href="https://www.tiktok.com/@fahrschulesedat" target="_blank">TikTok</a>
                        </div>
                    </div>
                    <div className={styles.copyright}>
                        &copy; {new Date().getFullYear()} Fahrschule Sedat. {t('footer.copyright')}
                    </div>
                </div>
            </footer>
        </main>
    );
}
