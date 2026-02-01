import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../styles/theme";
import { createButtonStyles } from "../styles/components/buttonStyles";

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  textStyle,
}) {
  const theme = useTheme();
  const styles = createButtonStyles(theme);

  const buttonStyles = [
    styles.base,
    styles[size],
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};
