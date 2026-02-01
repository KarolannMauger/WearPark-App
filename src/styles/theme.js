import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { spacing, padding, margin } from './spacing';
import { typography } from './typography';

export const baseTheme = {
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  
  return {
    ...baseTheme,
    colors: context.colors,
    theme: context.theme,
    toggleTheme: context.toggleTheme,
  };
};