import { StyleSheet } from 'react-native';

export const createMotionStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 6,
        backgroundColor: theme.colors.background,
        borderBottomColor: theme.colors.border,
        borderBottomWidth: 1,
    },
    rowForm: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    formGroup: {
        flex: 1,
    },
    label: {
        ...theme.typography.label,
        color: theme.colors.textPrimary,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: theme.spacing.md,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    primaryButtonText: {
        color: theme.colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginTop: 20,
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        backgroundColor: theme.colors.background,
    },
    dateButtonText: {
        fontSize: 16,
        color: theme.colors.textPrimary,
    },
    datePickerDone: {
        backgroundColor: theme.colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    datePickerDoneText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '600',
    },

    reportCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: theme.spacing.md,
    },

    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    reportTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: 4,
    },

    reportSubtitle: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },

    reportEpisodes: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '500',
    },

    downloadButton: {
        padding: 8,
    },
    
    reportPickerRow: {
        marginBottom: theme.spacing.md,
    },
    reportArrowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },
    reportArrowBtn: {
        padding: theme.spacing.xs,
    },
    reportYearText: {
        fontSize: 24,
        fontWeight: '700',
        minWidth: 64,
        textAlign: 'center',
        color: theme.colors.textPrimary,
    },
    reportMonthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md + 4,
    },
    reportMonthBtn: {
        width: '22%',
        paddingVertical: 10,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        backgroundColor: theme.colors.card,
    },
    reportMonthBtnText: {
        fontSize: 13,
        fontWeight: '500',
    },
    reportMonthBtnDisabled: {
        backgroundColor: theme.colors.disabled,
        borderColor: theme.colors.borderDisabled,
    },
    reportButtonDisabled: {
        opacity: 0.4,
    },
});