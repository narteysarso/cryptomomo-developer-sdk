import React from 'react';
import { CryptoMomoTheme } from '../types';
interface ThemeContextType {
    theme: CryptoMomoTheme | null;
    setTheme: (theme: CryptoMomoTheme | null) => void;
}
export declare const useTheme: () => ThemeContextType;
interface ThemeProviderProps {
    children: React.ReactNode;
    theme?: CryptoMomoTheme;
    defaultTheme?: CryptoMomoTheme;
}
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
export {};
//# sourceMappingURL=ThemeProvider.d.ts.map