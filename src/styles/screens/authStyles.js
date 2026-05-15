import { StyleSheet } from "react-native";

export const createAuthStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: theme.spacing.xl,
            backgroundColor: theme.colors.background,
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
        },

        title: {
            fontSize: 24,
            fontWeight: '600',
            marginBottom: 28,
            textAlign: 'center',
            color: theme.colors.text,
            ...theme.typography.h1,
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            marginBottom: 8,
            fontSize: 14,
            color: theme.colors.text,
            ...theme.typography.inputLabel,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
            ...theme.typography.input,
        },
        passwordWrapper: {
            position: 'relative',
        },
        inputPassword: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 12,
            paddingRight: 50,
            fontSize: 16,
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
        },
        eyeButton: {
            position: 'absolute',
            right: 12,
            top: 12,
        },
        error: {
            color: theme.colors.error,
            marginBottom: 16,
            fontSize: 14,
        },
        button: {
            backgroundColor: theme.colors.primary,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 20,
        },
        buttonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 16,
        },
        loginRow: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        loginText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        loginLink: {
            color: theme.colors.primary,
            fontWeight: '600',
            fontSize: 14,
        },
    });