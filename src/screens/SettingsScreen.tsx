import { View, Text, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from "../styles/theme";
import { createScreenStyles } from "../styles/screens/screenStyles";

export default function SettingsScreen() {
  const router = useRouter();

  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);

  return (
    <View style={screenStyles.container}>
      <Text style={{ color: theme.colors.textPrimary, ...theme.typography.h1 }}>
        Paramètres
      </Text>
      <Switch
        value={theme.theme === "dark"}
        onValueChange={theme.toggleTheme}
        thumbColor={
          theme.theme === "dark" ? theme.colors.accent : theme.colors.white
        }
        trackColor={{
          false: theme.colors.tag,
          true: theme.colors.accent + 80,
        }}
      />
    </View>
  );
}