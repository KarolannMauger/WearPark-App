import { StyleSheet } from 'react-native';

export const createButtonStyles = (theme) => StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Sizes
  small: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  accent: {
    backgroundColor: theme.colors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  
  // Text styles
  text: {
    ...theme.typography.button,
  },
  text_primary: {
    color: theme.colors.white,
  },
  text_accent: {
    color: theme.colors.white,
  },
  text_outline: {
    color: theme.colors.black,
  },
});