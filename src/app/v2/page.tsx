import NavbarV2 from '../../components/v2/NavbarV2';
import HeroV2 from '../../components/v2/HeroV2';
import AboutV2 from '../../components/v2/AboutV2';
import LicenseClassesV2 from '../../components/v2/LicenseClassesV2';
import TheoryContactV2 from '../../components/v2/TheoryContactV2';

export default function V2Page() {
    return (
        <main style={{ background: '#fff' }}>
            <NavbarV2 />
            <HeroV2 />
            <AboutV2 />
            <LicenseClassesV2 />
            <TheoryContactV2 />

            <footer style={{ padding: '80px 20px', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                <p style={{ fontFamily: 'Playfair Display', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                    Sedat Driving
                </p>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    &copy; {new Date().getFullYear()} Fahrschule Sedat. Duisburg-Rheinhausen.
                </p>
            </footer>
        </main>
    );
}
