import React from 'react';
import styles from './SnowEffect.module.css';

interface FlakeData {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  type: 'crystal' | 'dot';
}

function rand(seed: number): number {
  let x = Math.imul(seed + 1, 0x9e3779b1) >>> 0;
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b) >>> 0;
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x ^= x >>> 16;
  return (x >>> 8) / 0x1000000;
}

const FLAKE_COUNT = 42;

const FLAKES: FlakeData[] = Array.from({ length: FLAKE_COUNT }, (_, i) => ({
  id: i,
  left: Math.round((2 + rand(i * 7 + 1) * 94) * 10) / 10,
  size: Math.round(10 + rand(i * 7 + 2) * 14),
  duration: Math.round((7 + rand(i * 7 + 3) * 8) * 10) / 10,
  delay: Math.round(-(rand(i * 7 + 4) * 14) * 10) / 10,
  opacity: Math.round((0.5 + rand(i * 7 + 5) * 0.45) * 100) / 100,
  type: i % 3 === 0 ? 'crystal' : 'dot',
}));

export default function SnowEffect() {
  return (
    <div className={styles.snowContainer} aria-hidden="true">
      {FLAKES.map((f) => (
        <span
          key={f.id}
          className={`${styles.flake} ${f.type === 'crystal' ? styles.crystal : styles.dot}`}
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            width: f.type === 'dot' ? `${Math.max(5, Math.round(f.size * 0.45))}px` : undefined,
            height: f.type === 'dot' ? `${Math.max(5, Math.round(f.size * 0.45))}px` : undefined,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            opacity: f.opacity,
          }}
        >
          {f.type === 'crystal' ? '❄' : ''}
        </span>
      ))}
    </div>
  );
}
