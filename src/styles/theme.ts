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

export type BaseTheme = typeof baseTheme;