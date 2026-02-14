'use client';

import { useState, useEffect } from 'react';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
    children: React.ReactNode;
    className?: string; // Additional classes for trigger customization
}

export default function MobileMenu({ children, className }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Determine closest A tag
        const link = (e.target as HTMLElement).closest('a');
        if (link) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                className={`${styles.trigger} ${isOpen ? styles.open : ''} ${className || ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {/* Wrench Icon */}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'transform 0.3s ease' }}
                >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
            </button>

            <div
                className={`${styles.menu} ${isOpen ? styles.isOpen : ''}`}
                onClick={handleLinkClick}
            >
                <div className={styles.menuContent}>
                    {children}
                </div>
            </div>
        </>
    );
}
