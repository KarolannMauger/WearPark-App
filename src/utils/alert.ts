import { Platform, Alert } from "react-native";

export const confirm = (
  title: string,
  message: string,
  onConfirm: () => void
) => {
  if (Platform.OS === "web") {
    const result = window.confirm(`${title}\n\n${message}`);
    if (result) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    {
      text: "Annuler",
      style: "cancel",
    },
    {
      text: "Confirmer",
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
};