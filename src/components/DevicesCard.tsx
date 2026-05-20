import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { adminDeviceService } from '@/src/services/adminDeviceService';
import { AdminUserDetailsResponse } from '../types/adminUserTypes';
import { createUserDetailsStyles } from '../styles/components/userDetailsStyles';
import ConfirmModal from './ConfirmModal';
import { formatDate } from '../utils/date';

interface ModalState {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    destructive: boolean;
    onConfirm: () => void;
}

const MODAL_CLOSED: ModalState = {
    visible: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmer',
    destructive: false,
    onConfirm: () => {},
};

interface Props {
    user: AdminUserDetailsResponse;
    theme: any;
    onDeviceChanged: () => void;
}

export default function DevicesCard({ user, theme, onDeviceChanged }: Props) {
    const styles = createUserDetailsStyles(theme);

    const [modal, setModal]             = useState<ModalState>(MODAL_CLOSED);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newDeviceKey, setNewDeviceKey] = useState('');
    const [adding, setAdding]           = useState(false);
    const [addError, setAddError]       = useState<string | null>(null);

    const [editingRows, setEditingRows] = useState<Record<string, {
        key: string;
        saving: boolean;
        error: string | null;
    }>>({});

    const closeModal = () => setModal(MODAL_CLOSED);

    const hasActiveDevice = user.devices?.some(d => d.isActive) ?? false;
    const canAdd = !user.isDeleted && !hasActiveDevice;

    const startEdit = (deviceId: string, currentKey: string) => {
        setEditingRows(prev => ({
            ...prev,
            [deviceId]: { key: currentKey, saving: false, error: null },
        }));
    };

    const cancelEdit = (deviceId: string) => {
        setEditingRows(prev => {
            const next = { ...prev };
            delete next[deviceId];
            return next;
        });
    };

    const updateEditKey = (deviceId: string, value: string) => {
        setEditingRows(prev => ({
            ...prev,
            [deviceId]: { ...prev[deviceId], key: value, error: null },
        }));
    };

    const saveEdit = async (deviceId: string) => {
        const row = editingRows[deviceId];
        const trimmed = row?.key.trim();
        if (!trimmed) return;

        setEditingRows(prev => ({ ...prev, [deviceId]: { ...prev[deviceId], saving: true, error: null } }));
        try {
            await adminDeviceService.updateDevice(deviceId, trimmed);
            cancelEdit(deviceId);
            onDeviceChanged();
        } catch (err: any) {
            setEditingRows(prev => ({
                ...prev,
                [deviceId]: { ...prev[deviceId], saving: false, error: err?.message ?? 'Erreur lors de la sauvegarde.' },
            }));
        }
    };

    const handleDisableDevice = (deviceId: string) => {
        setModal({
            visible: true,
            title: "Désactiver l'appareil",
            message: 'Voulez-vous désactiver cet appareil ?',
            confirmLabel: 'Désactiver',
            destructive: true,
            onConfirm: async () => {
                closeModal();
                try {
                    await adminDeviceService.disableDevice(deviceId);
                    onDeviceChanged();
                } catch {
                    setModal({
                        visible: true,
                        title: 'Erreur',
                        message: 'Impossible de désactiver.',
                        confirmLabel: 'OK',
                        destructive: false,
                        onConfirm: closeModal,
                    });
                }
            },
        });
    };

    const handleAddDevice = async () => {
        const trimmed = newDeviceKey.trim();
        if (!trimmed) return;

        setAdding(true);
        setAddError(null);
        try {
            await adminDeviceService.createDevice(user.id, trimmed);
            setNewDeviceKey('');
            setShowAddForm(false);
            onDeviceChanged();
        } catch (err: any) {
            setAddError(err?.message ?? 'Erreur lors de la création.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <View style={styles.card}>

            <ConfirmModal {...modal} onCancel={closeModal} />

            <View style={[styles.deviceCardHeader, { marginBottom: 12 }]}>
                <Text style={theme.typography.h3}>
                    Devices ({user.devices?.length ?? 0})
                </Text>

                {!user.isDeleted && (
                    <TouchableOpacity
                        onPress={canAdd ? () => { setShowAddForm(p => !p); setAddError(null); setNewDeviceKey(''); } : undefined}
                        style={{ opacity: canAdd ? 1 : 0.35 }}
                    >
                        <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                            {showAddForm ? 'Annuler' : '+ Ajouter'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {!user.isDeleted && hasActiveDevice && (
                <View style={{
                    marginBottom: 12,
                    padding: 10,
                    borderRadius: 6,
                    backgroundColor: theme.colors.warning + '15',
                    borderWidth: 1,
                    borderColor: theme.colors.warning + '40',
                }}>
                    <Text style={{ fontSize: 12, color: theme.colors.warning, fontWeight: '500' }}>
                        Un appareil actif est déjà associé à cet utilisateur. Désactivez-le avant d'en ajouter un nouveau.
                    </Text>
                </View>
            )}

            {showAddForm && (
                <View style={{
                    marginBottom: 16,
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                    gap: 8,
                }}>
                    <Text style={[theme.typography.inputLabel, { marginBottom: 2 }]}>
                        Device Key
                    </Text>
                    <TextInput
                        value={newDeviceKey}
                        onChangeText={setNewDeviceKey}
                        placeholder="ex: abc123-device-key"
                        placeholderTextColor={theme.colors.textSecondary}
                        style={{
                            borderWidth: 1,
                            borderColor: addError ? theme.colors.error : theme.colors.border,
                            borderRadius: 6,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            fontSize: 14,
                            color: theme.colors.text,
                            backgroundColor: theme.colors.card,
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {addError && (
                        <Text style={{ fontSize: 12, color: theme.colors.error }}>{addError}</Text>
                    )}
                    <TouchableOpacity
                        onPress={handleAddDevice}
                        disabled={adding || !newDeviceKey.trim()}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 6,
                            paddingVertical: 10,
                            borderRadius: 8,
                            backgroundColor: theme.colors.primary,
                            opacity: adding || !newDeviceKey.trim() ? 0.5 : 1,
                        }}
                    >
                        {adding && <ActivityIndicator size="small" color="#fff" />}
                        <Text style={{ color: '#fff', fontWeight: '600' }}>
                            {adding ? 'Ajout en cours...' : "Ajouter l'appareil"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {user.devices?.map((device) => {
                const editing = editingRows[device.id];
                const isEditingRow = !!editing;

                return (
                    <View key={device.id} style={[styles.deviceRow, { flexDirection: 'column', alignItems: 'stretch', gap: 8 }]}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <View style={{ flex: 1 }}>
                                {isEditingRow ? (
                                    <TextInput
                                        value={editing.key}
                                        onChangeText={(v) => updateEditKey(device.id, v)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: editing.error ? theme.colors.error : theme.colors.border,
                                            borderRadius: 6,
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            fontSize: 14,
                                            color: theme.colors.text,
                                            backgroundColor: theme.colors.card,
                                        }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                ) : (
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.text }}>
                                        {device.deviceKey}
                                    </Text>
                                )}
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 3 }}>
                                    Ajouté le {formatDate(device.createdAt)}
                                </Text>
                            </View>

                            <View style={[
                                styles.deviceBadge,
                                { marginLeft: 10, backgroundColor: device.isActive ? theme.colors.success + '20' : theme.colors.error + '20' }
                            ]}>
                                <Text style={{
                                    fontSize: 11,
                                    fontWeight: '700',
                                    color: device.isActive ? theme.colors.success : theme.colors.error,
                                }}>
                                    {device.isActive ? 'Actif' : 'Désactivé'}
                                </Text>
                            </View>
                        </View>

                        {isEditingRow && editing.error && (
                            <Text style={{ fontSize: 12, color: theme.colors.error }}>
                                {editing.error}
                            </Text>
                        )}

                        {!user.isDeleted && (
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {isEditingRow ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => saveEdit(device.id)}
                                            disabled={editing.saving || !editing.key.trim()}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 4,
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 6,
                                                backgroundColor: theme.colors.success,
                                                opacity: editing.saving || !editing.key.trim() ? 0.5 : 1,
                                            }}
                                        >
                                            {editing.saving && <ActivityIndicator size="small" color="#fff" />}
                                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                                                {editing.saving ? 'Sauvegarde...' : 'Enregistrer'}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => cancelEdit(device.id)}
                                            style={{
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 6,
                                                borderWidth: 1,
                                                borderColor: theme.colors.border,
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.text }}>
                                                Annuler
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => startEdit(device.id, device.deviceKey)}
                                            style={{
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderRadius: 6,
                                                borderWidth: 1,
                                                borderColor: theme.colors.border,
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.text }}>
                                                Modifier
                                            </Text>
                                        </TouchableOpacity>

                                        {device.isActive && (
                                            <TouchableOpacity
                                                onPress={() => handleDisableDevice(device.id)}
                                                style={{
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 6,
                                                    borderWidth: 1,
                                                    borderColor: theme.colors.error,
                                                }}
                                            >
                                                <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.error }}>
                                                    Désactiver
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                );
            })}

        </View>
    );
}