import { StyleSheet } from "react-native";
import { margin } from "../spacing";

export const createProfileStyles = (theme) =>
  StyleSheet.create({
    settingsDisplay: {
      float: "right",
    },
    profileHeader: {
      alignItems: "center",
    },
    name: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
      marginTop: theme.spacing.sm,
    },
    email: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textDecorationLine: "underline",
      marginTop: 4,
    },
    editButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.md,
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.md,
    },
    buttonText: {
      ...theme.typography.button,
      color: theme.colors.white,
    },
  });
