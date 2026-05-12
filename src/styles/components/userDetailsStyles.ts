import { StyleSheet } from 'react-native';

export const createUserDetailsStyles = (theme: any) =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.card,
            padding: 16,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        checkboxRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
        },
        btn: {
            marginTop: 10,
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
        },
        btnText: {
            color: '#fff',
            fontWeight: '600',
        },
        deviceCardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
        },
        deviceRow: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        deviceBadge: {
            padding: 6,
            borderRadius: 6,
        },
    });

export const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 12,
    fontSize: 14,
};