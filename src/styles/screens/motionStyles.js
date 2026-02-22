import { StyleSheet } from 'react-native';

export const createMotionStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 6,
        backgroundColor: '#fff',
        borderBottomColor: 'lightGrey',
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
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border || '#ccc',
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
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    reportCard: {
        backgroundColor: theme.colors.card || '#f5f5f5',
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
});