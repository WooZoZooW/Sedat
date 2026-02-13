import styles from './LicenseClassesV3.module.css';

const classes = [
    { name: 'KLASSE B', desc: 'SNEAK PREVIEW TO FREEDOM', icon: '⚡' },
    { name: 'B197', desc: 'THE FUTURE IS AUTOMATIC', icon: '🔥' },
    { name: 'KLASSE BE', desc: 'HEAVY LOADS ONLY', icon: '📦' },
];

export default function LicenseClassesV3() {
    return (
        <section id="services" className={styles.section}>
            <div className="container">
                <h2 className={styles.title}>LEVEL <span className="neon-text">UP</span></h2>
                <div className={styles.grid}>
                    {classes.map((cls, i) => (
                        <div key={i} className={styles.card}>
                            <div className={styles.content}>
                                <div className={styles.icon}>{cls.icon}</div>
                                <h3>{cls.name}</h3>
                                <p>{cls.desc}</p>
                            </div>
                            <div className={styles.neonBar}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
