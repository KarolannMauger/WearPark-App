import { StyleSheet } from 'react-native';

export const createBackHeaderStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        marginBottom: 8,
        position: 'relative',
    },
    button: {
        minWidth: 34,
        position: "absolute",
        left: 0,
        zIndex: 10,
    },
    title: {
        ...theme.typography.h3,
        textAlign: 'center',
    },
});