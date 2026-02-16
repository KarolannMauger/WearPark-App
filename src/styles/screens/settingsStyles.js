import { StyleSheet } from 'react-native';

export const createSettingsStyles = (theme) => StyleSheet.create({
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
    divider: {
        height: 1,
        backgroundColor: theme.colors.textDisabled
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    rowText: {
        ...theme.typography.body,
        color: theme.colors.textPrimary,
        marginLeft: 12
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
    },
});