import { StyleSheet } from "react-native";

export const createProfileStyles = (theme) =>
  StyleSheet.create({
    centerWrapper: {
      flex: 1,
      justifyContent: "center",
    },
    notAuthContainer: {
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    notAuthIcon: {
      marginBottom: theme.spacing.md,
    },
    notAuthTitle: {
      ...theme.typography.h3,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    notAuthMessage: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
      textAlign: "center",
    },
    notAuthButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm + 4,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.md,
    },
    notAuthButtonText: {
      ...theme.typography.button,
      color: theme.colors.white,
    },
    profileHeader: {
      alignItems: "center",
      marginTop: theme.spacing.lg,
    },
    avatarContainer: {
      position: "relative",
      width: 96,
      height: 96,
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
    },
    cameraButton: {
      position: "absolute",
      right: -2,
      bottom: -2,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    cameraIcon: {
      width: 18,
      height: 18,
      tintColor: "#fff",
    },
    name: {
      ...theme.typography.h2,
      color: theme.colors.textPrimary,
    },
    email: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
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
    bioContainer: {
      marginTop: theme.spacing.lg,
    },
    bio: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    bioInterest: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginTop: 8,
    },
    sectionList: {
      marginTop: theme.spacing.xl,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    rowText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      marginLeft: 12,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.textDisabled,
    },
  });
