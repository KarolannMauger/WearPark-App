import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from "../styles/theme";
import { createScreenStyles } from "../styles/screens/screenStyles";
import Button from '../components/Button';

export default function HomeScreen() {
  const router = useRouter();

  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);

  return (
    <View style={screenStyles.container}>
      <Text style={{ color: theme.colors.textPrimary, ...theme.typography.h1 }}>
        Accueil
      </Text>
    </View>
  );
}