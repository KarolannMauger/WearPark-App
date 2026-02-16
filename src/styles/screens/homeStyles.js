import { StyleSheet } from "react-native";

export const createHomeStyles = (theme) =>
    StyleSheet.create({
        rowContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: theme.spacing.md,
        },
        cardContainer: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            flex: 1,
            overflow: 'scroll',
        },
        cardTitle: {
            ...theme.typography.bodyMedium,
            color: theme.colors.textSecondary,
            lineHeight: theme.typography.sizes.xxl,
        },
        info: {
            ...theme.typography.h1,
            color: theme.colors.textPrimary
        },
    });
