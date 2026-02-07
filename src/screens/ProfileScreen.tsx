import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from "../styles/theme";
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createProfileStyles } from "../styles/screens/profileStyles";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/src/context/UserContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUser();

  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const profileStyles = createProfileStyles(theme);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            // Redirection automatique vers /login via UserContext
          }
        }
      ]
    );
  };

  return (
    <View style={screenStyles.container}>
      {user && (
        <Text style={{ color: theme.colors.textPrimary, marginBottom: 20 }}>
          {user.email}
        </Text>
      )}

      <TouchableOpacity
        style={profileStyles.row}
        onPress={() => router.push("/settings")}
      >
        <Ionicons
          name="settings"
          size={22}
          color={theme.colors.textPrimary}
        />
        <Text style={{ color: theme.colors.textPrimary, marginLeft: 12 }}>
          Settings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[profileStyles.row, { marginTop: 20 }]}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={theme.colors.error || '#FF3B30'}
        />
        <Text style={{ 
          color: theme.colors.error || '#FF3B30', 
          marginLeft: 12 
        }}>
          Logout
        </Text>
      </TouchableOpacity>
      
      <Text style={{ color: theme.colors.textPrimary, ...theme.typography.h1 }}>
        Profil
      </Text>
    </View>
  );
}