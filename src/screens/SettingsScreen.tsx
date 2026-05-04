import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { useUser } from "../context/UserContext";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { confirm } from "@/src/utils/alert";
import BackHeader from "../components/BackHeader";
import { Ionicons } from "@expo/vector-icons";
import { createSettingsStyles } from "../styles/screens/settingsStyles";

export default function SettingsScreen() {
  const theme = useTheme();
  const { logout } = useUser();
  const screenStyles = createScreenStyles(theme);
  const settingsStyles = createSettingsStyles(theme);

  const handleLogout = () => {
    confirm(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter?",
      async () => {
        await logout();
      }
    );
  };

  return (
    <View style={screenStyles.container}>
      <BackHeader title="Paramètres" />
      <View>
        <View style={settingsStyles.settingRow}>
          <View style={settingsStyles.rowLeft}>
            <Ionicons
              name="sunny-outline"
              size={30}
              color={theme.colors.textSecondary}
            />
            <Text style={settingsStyles.rowText}>Thème</Text>
          </View>
          <Switch
            value={theme.mode === "dark"}
            onValueChange={theme.toggleTheme}
            thumbColor={
              theme.mode === "dark" ? theme.colors.secondary : theme.colors.white
            }
            trackColor={{
              false: theme.colors.secondary,
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
            <Text style={settingsStyles.rowText}>Se déconnecter</Text>
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