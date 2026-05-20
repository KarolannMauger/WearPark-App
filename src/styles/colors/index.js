import { useColorScheme } from 'react-native';
import { lightColors } from './light';
import { darkColors } from './dark';

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
};

export { lightColors, darkColors };