import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createProfileStyles } from "../styles/screens/profileStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();

  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const profileStyles = createProfileStyles(theme);


  return (
    <View style={screenStyles.container}>
      <TouchableOpacity
        style={profileStyles.row}
        onPress={() => router.push("/settings")}
      >
        <MaterialIcons
          name="settings"
          size={22}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>

      <Text style={{ color: theme.colors.textPrimary, ...theme.typography.h1 }}>
        Profil
      </Text>

      {user && (
        <Text style={{ color: theme.colors.textPrimary, marginBottom: 20 }}>
          {user.email}
        </Text>
      )}
    </View>
  );
}