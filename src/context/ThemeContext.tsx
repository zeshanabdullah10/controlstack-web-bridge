import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type PrimaryColor = '#2196F3' | '#4CAF50' | '#FF9800' | '#F44336' | '#9C27B0';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    primaryColor: PrimaryColor;
    setPrimaryColor: (color: PrimaryColor) => void;
    compactMode: boolean;
    setCompactMode: (compact: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'auto';
    });

    const [primaryColor, setPrimaryColor] = useState<PrimaryColor>(() => {
        return (localStorage.getItem('primaryColor') as PrimaryColor) || '#2196F3';
    });

    const [compactMode, setCompactMode] = useState<boolean>(() => {
        return localStorage.getItem('compactMode') === 'true';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'auto') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty('--md-primary', primaryColor);
        // We might want to calculate light/dark variants here if possible, 
        // or just rely on the main color for now. 
        // For a full system, we'd use color manipulation lib, but let's stick to the base var.
        localStorage.setItem('primaryColor', primaryColor);
    }, [primaryColor]);

    useEffect(() => {
        if (compactMode) {
            document.documentElement.style.setProperty('--md-radius-md', '4px');
            document.documentElement.style.setProperty('--md-radius-lg', '8px');
            // reduced padding logic could go here or via class
        } else {
            document.documentElement.style.removeProperty('--md-radius-md');
            document.documentElement.style.removeProperty('--md-radius-lg');
        }
        localStorage.setItem('compactMode', String(compactMode));
    }, [compactMode]);

    return (
        <ThemeContext.Provider value={{
            theme, setTheme,
            primaryColor, setPrimaryColor,
            compactMode, setCompactMode
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
