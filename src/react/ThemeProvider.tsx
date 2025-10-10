import React, { createContext, useContext, useEffect } from 'react';
import { CryptoMomoTheme } from '../types';

interface ThemeContextType {
  theme: CryptoMomoTheme | null;
  setTheme: (theme: CryptoMomoTheme | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: CryptoMomoTheme;
  defaultTheme?: CryptoMomoTheme;
}

const defaultCryptoMomoTheme: CryptoMomoTheme = {
  colors: {
    primary: 'hsl(221.2 83.2% 53.3%)',
    secondary: 'hsl(210 40% 98%)',
    accent: 'hsl(210 40% 96%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    muted: 'hsl(210 40% 96%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(221.2 83.2% 53.3%)',
    destructive: 'hsl(0 84.2% 60.2%)',
  },
  borderRadius: '0.5rem',
  fontFamily: 'system-ui, sans-serif',
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme,
  defaultTheme = defaultCryptoMomoTheme,
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<CryptoMomoTheme | null>(
    theme || defaultTheme
  );

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
    }
  }, [theme]);

  // Apply theme variables to the root element
  useEffect(() => {
    if (currentTheme) {
      const root = document.documentElement;
      
      if (currentTheme.colors) {
        Object.entries(currentTheme.colors).forEach(([key, value]) => {
          if (value) {
            root.style.setProperty(`--${key}`, value);
          }
        });
      }
      
      if (currentTheme.borderRadius) {
        root.style.setProperty('--radius', currentTheme.borderRadius);
      }
      
      if (currentTheme.fontFamily) {
        root.style.setProperty('--font-family', currentTheme.fontFamily);
      }
    }
  }, [currentTheme]);

  const value = {
    theme: currentTheme,
    setTheme: setCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 