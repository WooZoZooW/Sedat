'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Sedat <span className="accent-text">Fahrschule</span>
        </Link>
        <div className={styles.links}>
          <Link href="#about">Über uns</Link>
          <Link href="#services">Klassen</Link>
          <Link href="#theory">Theorie</Link>
          <Link href="#contact" className={styles.cta}>Kontakt</Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
