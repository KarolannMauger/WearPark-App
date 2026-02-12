import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { lightColors, darkColors } from '../styles/colors';
import { spacing, padding, margin } from '../styles/spacing';
import { typography } from '../styles/typography';

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = typeof lightColors;

const baseTheme = {
  spacing,
  padding,
  margin,
  typography,

  borderRadius: {
    sm: 6,
    md: 10,
    lg: 18,
    xl: 25,
    xxl: 50,
  },

  dimensions: {
    iconSize: 24,
    menuIconSize: 40,
  },
};

export type BaseTheme = typeof baseTheme;

interface ThemeContextValue extends BaseTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = useMemo<ThemeColors>(() => {
    return mode === 'light' ? lightColors : darkColors;
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...baseTheme,
      mode,
      colors,
      toggleTheme,
    }),
    [mode, colors]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}