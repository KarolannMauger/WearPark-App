import { StyleSheet } from 'react-native';

export const createScreenStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  containerNoPadding: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});