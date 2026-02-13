import Navbar from '../../components/v1/Navbar';
import Hero from '../../components/v1/Hero';
import About from '../../components/v1/About';
import LicenseClasses from '../../components/v1/LicenseClasses';
import Theory from '../../components/v1/Theory';
import Contact from '../../components/v1/Contact';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <About />
      <LicenseClasses />
      <Theory />
      <Contact />

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <h3>Sedat <span className="accent-text">Fahrschule</span></h3>
              <p>Inh. Sedat Kapcak</p>
              <p>Sicher ans Ziel in Duisburg.</p>
            </div>
            <div className={styles.links}>
              <a href="#">Impressum</a>
              <a href="#">Datenschutz</a>
              <a href="#">AGB</a>
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
