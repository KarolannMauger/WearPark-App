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
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 40,
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            marginBottom: 8,
            fontSize: 14,
        },
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
        },
        passwordWrapper: {
            position: 'relative',
        },
        inputPassword: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            paddingRight: 50,
            fontSize: 16,
        },
        eyeButton: {
            position: 'absolute',
            right: 12,
            top: 12,
        },
        error: {
            color: 'red',
            marginBottom: 20,
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
            fontWeight: 'bold',
            fontSize: 16,
        },
        loginRow: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        loginText: {
            fontSize: 14,
        },
        loginLink: {
            color: theme.colors.primary,
            fontWeight: 'bold',
            fontSize: 14,
            textAlign: 'right',
        },
    });
