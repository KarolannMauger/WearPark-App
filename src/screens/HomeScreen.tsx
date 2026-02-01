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
      <Text>Home</Text>
      <Button
        title="Aller aux paramètres"
        onPress={() => router.push('/settings')}
        textStyle={{ color: theme.colors.textPrimary }}
        style={{}}
      />
    </View>
  );
}