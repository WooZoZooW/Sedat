import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
    return (
        <div className={styles.selection}>
            <p className="accent-text" style={{ marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Sedat Drive</p>
            <h1>Wählen Sie eine Design-Version</h1>
            <div className={styles.grid}>
                <Link href="/v1" className={styles.card}>
                    <h2>Version 1</h2>
                    <p>Modern Glassmorphism (Aktiv / Адаптивный)</p>
                </Link>
                <Link href="/v2" className={styles.card}>
                    <h2>Version 2</h2>
                    <p>Dynamic Heritage (Rot-Weiß / Энергичный)</p>
                </Link>
                <Link href="/v3" className={styles.card}>
                    <h2>Version 3</h2>
                    <p>Street Pulse (Dunkel / Динамика)</p>
                </Link>
            </div>
        </div>
    );
}
