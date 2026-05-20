import { StyleSheet } from "react-native";

export const createProfileStyles = (theme) =>
  StyleSheet.create({
    settingsDisplay: {
      float: "right",
    },
    profileHeader: {
      alignItems: "center",
      paddingBottom: theme.spacing.xxl,
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
    deviceInfo: {
      marginTop: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconView: {
      padding: theme.spacing.sm + 2,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.md,
    },
    deviceText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    deviceSubText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });
