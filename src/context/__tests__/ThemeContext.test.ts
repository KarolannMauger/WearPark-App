import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { lightColors, darkColors } from '../../styles/colors';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  React.createElement(ThemeProvider, null, children);

describe('ThemeContext', () => {
  it('should provide default values', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.mode).toBe('light');
    expect(result.current.colors).toEqual(lightColors);
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('should toggle theme correctly', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => result.current.toggleTheme());

    expect(result.current.mode).toBe('dark');
    expect(result.current.colors).toEqual(darkColors);

    act(() => result.current.toggleTheme());

    expect(result.current.mode).toBe('light');
    expect(result.current.colors).toEqual(lightColors);
  });

  it('should throw if used outside ThemeProvider', () => {
    const hookCall = () => renderHook(() => useTheme());
    expect(hookCall).toThrow('useTheme must be used within a ThemeProvider');
  });
});