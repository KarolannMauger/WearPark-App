import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { useUser } from "../context/UserContext";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import BackHeader from "../components/BackHeader";
import { Ionicons } from "@expo/vector-icons";
import { createSettingsStyles } from "../styles/screens/settingsStyle";

export default function SettingsScreen() {
  const theme = useTheme();
  const { logout } = useUser();
  const screenStyles = createScreenStyles(theme);
  const settingsStyles = createSettingsStyles(theme);

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
          }
        }
      ]
    );
  };

  return (
    <View style={screenStyles.container}>
      <BackHeader title="Settings" />
      <View>
        <View style={settingsStyles.settingRow}>
          <View style={settingsStyles.rowLeft}>
            <Ionicons
              name="sunny-outline"
              size={30}
              color={theme.colors.textSecondary}
            />
            <Text style={settingsStyles.rowText}>Theme</Text>
          </View>
          <Switch
            value={theme.mode === "dark"}
            onValueChange={theme.toggleTheme}
            thumbColor={
              theme.mode === "dark" ? theme.colors.secondary : theme.colors.white
            }
            trackColor={{
              false: theme.colors.tag,
              true: theme.colors.secondary + 80,
            }}
          />
        </View>

        <View style={settingsStyles.divider} />

        <TouchableOpacity
          style={settingsStyles.settingRow}
          onPress={handleLogout}
        >
          <View style={settingsStyles.rowLeft}>
            <Ionicons
              name="log-out-outline"
              size={30}
              color={theme.colors.textSecondary}
            />
            <Text style={settingsStyles.rowText}>Logout</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}