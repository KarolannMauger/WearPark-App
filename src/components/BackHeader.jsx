import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../context/ThemeContext';
import { createBackHeaderStyles } from "../styles/components/backHeaderStyles";

export default function BackHeader({title = "Details"}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = createBackHeaderStyles(theme);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.button}>
        <Ionicons
          name="chevron-back"
          size={26}
          color={theme.colors?.textPrimary || theme.text}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          { color: theme.colors.textPrimary || theme.text },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}