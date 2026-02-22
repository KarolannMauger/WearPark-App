import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { createBackHeaderStyles } from "../styles/components/backHeaderStyles";
import { useRouter } from "expo-router";

type BackHeaderProps = { title?: string; goTo?: string; color?: string; };

export default function BackHeader({ title = "Details", goTo, color, }: BackHeaderProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createBackHeaderStyles(theme);
  const router = useRouter();

  const finalColor =
    color || theme.colors.textPrimary;

  const handleBack = () => {
    if (goTo) {
      const path = goTo.startsWith("/") ? goTo : `/${goTo}`;
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.button}>
        <Ionicons
          name="chevron-back"
          size={26}
          color={finalColor}
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: finalColor }]}>
        {title}
      </Text>
    </View>
  );
}