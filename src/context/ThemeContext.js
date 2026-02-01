import React, { createContext, useState, useMemo } from 'react';
import { lightColors, darkColors } from '../styles/colors';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const colors = useMemo(() => {
    return theme === 'light' ? lightColors : darkColors;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}