import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  // HSL values for Tailwind variables
  primaryHsl: string;
  secondaryHsl: string;
  accentHsl: string;
}

export const SECTION_THEMES: Record<string, Theme> = {
  home: {
    name: 'Home',
    primary: '#8b5cf6', // Violet-500
    secondary: '#a78bfa', // Violet-400
    accent: '#c4b5fd', // Violet-300
    background: 'from-violet-900/20 to-purple-900/20',
    primaryHsl: '271 81% 56%',
    secondaryHsl: '269 97% 85%',
    accentHsl: '269 100% 92%',
  },
  about: {
    name: 'About',
    primary: '#06b6d4', // Cyan-500
    secondary: '#22d3ee', // Cyan-400
    accent: '#67e8f9', // Cyan-300
    background: 'from-cyan-900/20 to-sky-900/20',
    primaryHsl: '189 94% 43%',
    secondaryHsl: '186 94% 63%',
    accentHsl: '186 100% 94%',
  },
  journey: {
    name: 'Journey',
    primary: '#10b981', // Emerald-500
    secondary: '#34d399', // Emerald-400
    accent: '#6ee7b7', // Emerald-300
    background: 'from-emerald-900/20 to-green-900/20',
    primaryHsl: '158 64% 52%',
    secondaryHsl: '151 65% 66%',
    accentHsl: '151 100% 81%',
  },
  skills: {
    name: 'Skills',
    primary: '#ef4444', // Red-500
    secondary: '#f87171', // Red-400
    accent: '#fca5a5', // Red-300
    background: 'from-red-900/20 to-rose-900/20',
    primaryHsl: '0 84% 60%',
    secondaryHsl: '0 96% 89%',
    accentHsl: '0 100% 96%',
  },
  projects: {
    name: 'Projects',
    primary: '#f97316', // Orange-500
    secondary: '#fb923c', // Orange-400
    accent: '#fdba74', // Orange-300
    background: 'from-orange-900/20 to-amber-900/20',
    primaryHsl: '24 95% 53%',
    secondaryHsl: '27 96% 61%',
    accentHsl: '27 100% 96%',
  },
  services: {
    name: 'Services',
    primary: '#8b5cf6', // Violet-500
    secondary: '#a78bfa', // Violet-400
    accent: '#c4b5fd', // Violet-300
    background: 'from-violet-900/20 to-purple-900/20',
    primaryHsl: '270 95% 65%', // Violet
    secondaryHsl: '270 95% 75%',
    accentHsl: '270 100% 85%',
  },
  certifications: {
    name: 'Certifications',
    primary: '#c5a059', // Gold
    secondary: '#d4b87e', // Light Gold
    accent: '#e6d3a3', // Pale Gold
    background: 'from-yellow-900/20 to-amber-900/20',
    primaryHsl: '43 48% 56%',
    secondaryHsl: '43 50% 66%',
    accentHsl: '43 55% 77%',
  },
  contact: {
    name: 'Contact',
    primary: '#71717a', // Zinc-500
    secondary: '#a1a1aa', // Zinc-400
    accent: '#e4e4e7', // Zinc-200
    background: 'from-zinc-900/20 to-neutral-900/20',
    primaryHsl: '240 5% 46%',
    secondaryHsl: '240 5% 65%',
    accentHsl: '240 6% 90%',
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentTheme, setCurrentTheme] = useState(SECTION_THEMES.home);

  useEffect(() => {
    const theme = SECTION_THEMES[currentSection] || SECTION_THEMES.home;
    setCurrentTheme(theme);

    // Update CSS variables for dynamic theming
    const root = document.documentElement;

    // Set Hex values (for legacy/canvas usage)
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-accent', theme.accent);

    // Set HSL values (for Tailwind usage)
    root.style.setProperty('--primary', theme.primaryHsl);
    // We might want to update other tailwind vars if needed, but primary is the main one
    // root.style.setProperty('--secondary', theme.secondaryHsl); 
    // root.style.setProperty('--accent', theme.accentHsl);

  }, [currentSection]);

  return (
    <ThemeContext.Provider value={{ currentTheme, currentSection, setCurrentSection }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
