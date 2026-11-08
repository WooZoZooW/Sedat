'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
    mode: ThemeMode;
    resolved: ResolvedTheme;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredMode(): ThemeMode {
    if (typeof window === 'undefined') return 'system';
    try {
        const stored = localStorage.getItem('theme');
        return stored === 'light' || stored === 'dark' || stored === 'system'
            ? stored
            : 'system';
    } catch {
        return 'system';
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>(getStoredMode);
    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

    const resolved: ResolvedTheme = mode === 'system' ? systemTheme : mode;

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            setSystemTheme(media.matches ? 'dark' : 'light');
        };

        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', resolved);
        document.documentElement.style.colorScheme = resolved;
    }, [resolved]);

    const setMode = (next: ThemeMode) => {
        setModeState(next);
        try {
            localStorage.setItem('theme', next);
        } catch {
            // Storage can be unavailable in private mode; ignore.
        }
    };

    return (
        <ThemeContext.Provider value={{ mode, resolved, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
