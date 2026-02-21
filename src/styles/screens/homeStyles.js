import { StyleSheet } from "react-native";

export const createHomeStyles = (theme) =>
    StyleSheet.create({
        rowContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.md,
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
            ...theme.typography.h2,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xs,
        },
        legendRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 12,
            marginBottom: 16,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        line: {
            width: 20,
            height: 3,
            borderRadius: 2,
        },
        legendText: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        cardSubtitle: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
    });
