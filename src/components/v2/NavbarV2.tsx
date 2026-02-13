'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import styles from './NavbarV2.module.css';

export default function NavbarV2() {
    const { t } = useLanguage();

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/v2" className={styles.logo}>
                    Sedat <span className={styles.thin}>Driving</span>
                </Link>
                <div className={styles.links}>
                    <Link href="#about">{t('nav.about')}</Link>
                    <Link href="#services">{t('nav.classes')}</Link>
                    <Link href="#contact">{t('nav.contact')}</Link>
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
}
