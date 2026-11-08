'use client';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Promotion from '../components/Promotion';
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
            <Promotion />
            <About />
            <Pricing />
            <LicenseClasses />
            <Theory />
            <Contact />

            <footer className={styles.footer}>
                <div className="container">
                    <div className={styles.footerGrid}>
                        <div className={styles.brand}>
                            <h3>Fahrschule <span className="accent-text">Sedat</span></h3>
                            <p className={styles.owner}>Inh. Sedat Kapcak</p>
                            <p className={styles.tagline}>{t('footer.tagline')}</p>
                        </div>
                        <div className={styles.footerCol}>
                            <h4>{t('footer.legal')}</h4>
                            <div className={styles.links}>
                                <a href="/legal?tab=impressum">{t('nav.impressum')}</a>
                                <a href="/legal?tab=datenschutz">{t('nav.privacy')}</a>
                            </div>
                        </div>
                        <div className={styles.footerCol}>
                            <h4>{t('footer.social')}</h4>
                            <div className={styles.social}>
                                <a href="https://www.instagram.com/fahrschule__sedat" target="_blank" rel="noreferrer">Instagram</a>
                                <a href="https://www.tiktok.com/@fahrschulesedat" target="_blank" rel="noreferrer">TikTok</a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.copyright}>
                        <span>&copy; {new Date().getFullYear()} Fahrschule Sedat</span>
                        <span>{t('footer.copyright')}</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
