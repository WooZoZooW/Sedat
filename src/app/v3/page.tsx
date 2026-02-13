import HeroV3 from '../../components/v3/HeroV3';
import LicenseClassesV3 from '../../components/v3/LicenseClassesV3';
import AboutContactV3 from '../../components/v3/AboutContactV3';
import LanguageSwitcher from '../../components/shared/LanguageSwitcher';
import Link from 'next/link';

export default function V3Page() {
  return (
    <main style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      <nav style={{ position: 'absolute', top: 0, padding: '2rem', zIndex: 100, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Anton', fontSize: '1.5rem', color: 'var(--accent)' }}>SEDAT // DRIVE</span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/v3#services" style={{ fontFamily: 'Anton', fontSize: '0.9rem' }}>CLASSES</Link>
          <Link href="/v3#contact" style={{ fontFamily: 'Anton', fontSize: '0.9rem' }}>JOIN</Link>
          <LanguageSwitcher />
        </div>
      </nav>

      <HeroV3 />
      <LicenseClassesV3 />
      <AboutContactV3 />

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid #222', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Anton', opacity: 0.3 }}>&copy; 2026 - FAHRSCHULE SEDAT // DUISBURG</p>
      </footer>
    </main >
  );
}
