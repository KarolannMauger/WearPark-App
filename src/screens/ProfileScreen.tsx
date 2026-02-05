import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from "../styles/theme";
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createProfileStyles } from "../styles/screens/profileStyles";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();

  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const profileStyles = createProfileStyles(theme);

  return (
    <View style={screenStyles.container}>
      <TouchableOpacity
              style={profileStyles.row}
              onPress={() => router.push("/settings")}
            >
        <Ionicons
          name="settings"
          size={22}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>
      
      <Text style={{ color: theme.colors.textPrimary, ...theme.typography.h1 }}>
        Profil
      </Text>
    </View>
  );
}