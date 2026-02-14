'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import LanguageMenu from './shared/LanguageMenu'; // Use the new menu
import MobileMenu from './shared/MobileMenu';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { t } = useLanguage();
  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Sedat <span className="accent-text">Fahrschule</span>
        </Link>
        <div className={styles.links}>
          <Link href="/#about">{t('nav.about')}</Link>
          <Link href="/#services">{t('nav.classes')}</Link>
          <Link href="/#theory">{t('nav.theory')}</Link>
          <Link href="/#contact" className={styles.cta}>{t('nav.contact')}</Link>
          {/* Desktop Language Switcher - Also using the new Menu for consistency, 
               or I could put it outside .links? 
               Usually better to have language switcher accessible here too. */}
          <div className={styles.desktopLang}>
            <LanguageMenu />
          </div>
        </div>

        {/* Mobile controls: Language + Wrench (MobileMenu) */}
        <div className={styles.mobileControls}>
          <LanguageMenu />
          <MobileMenu>
            <Link href="/#about">{t('nav.about')}</Link>
            <Link href="/#services">{t('nav.classes')}</Link>
            <Link href="/#theory">{t('nav.theory')}</Link>
            <Link href="/#contact" className={styles.cta}>{t('nav.contact')}</Link>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Link href="/legal?tab=impressum" style={{ display: 'block', fontSize: '0.9rem', marginBottom: '10px', opacity: 0.7 }}>Impressum</Link>
              <Link href="/legal?tab=datenschutz" style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7 }}>Datenschutz</Link>
            </div>
          </MobileMenu>
        </div>
      </div>
    </nav>
  );
}
