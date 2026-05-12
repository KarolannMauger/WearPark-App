import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';

interface Props {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    visible,
    title,
    message,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    destructive = false,
    onConfirm,
    onCancel,
}: Props) {
    const theme = useTheme();

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={[styles.modal, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <Text style={[theme.typography.h3, { marginBottom: 8 }]}>{title}</Text>
                <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: 24 }]}>
                    {message}
                </Text>

                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={onCancel}
                        style={[styles.btn, { backgroundColor: theme.colors.border }]}
                    >
                        <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
                            {cancelLabel}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onConfirm}
                        style={[styles.btn, {
                            backgroundColor: destructive ? theme.colors.error : theme.colors.primary
                        }]}
                    >
                        <Text style={{ fontWeight: '600', color: '#fff' }}>
                            {confirmLabel}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    modal: {
        width: 380,
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    btn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
});