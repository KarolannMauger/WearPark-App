import { StyleSheet } from "react-native";

export const createHeaderStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.sm
    },
    header: {
      ...theme.typography.h1,
      color: theme.colors.white,
      marginBottom: 4
    },
  });
