'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import LanguageMenu from './shared/LanguageMenu'; // Use the new menu
import MobileMenu from './shared/MobileMenu';
import ThemeToggle from './shared/ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { t } = useLanguage();
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Fahrschule <span className="accent-text">Sedat</span>
        </Link>
        <div className={styles.links}>
          <Link href="/#about">{t('nav.about')}</Link>
          <Link href="/#services">{t('nav.classes')}</Link>
          <Link href="/#theory">{t('nav.theory')}</Link>
          <Link href="/#contact" className={styles.cta}>{t('nav.contact')}</Link>
          {/* Desktop theme + language switchers */}
          <div className={styles.desktopLang}>
            <ThemeToggle />
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
              <Link href="/legal?tab=impressum" style={{ display: 'block', fontSize: '0.9rem', marginBottom: '10px', opacity: 0.7 }}>{t('nav.impressum')}</Link>
              <Link href="/legal?tab=datenschutz" style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7 }}>{t('nav.privacy')}</Link>
            </div>

            <ThemeToggle />
          </MobileMenu>
        </div>
      </div>
    </nav>
  );
}
