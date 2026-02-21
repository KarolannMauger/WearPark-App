import { StyleSheet } from 'react-native';

export const createScreenStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
  },
  redContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.xl,
  },
  containerNoPadding: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pageTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md
  },
  sectionTitleSmall: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
});