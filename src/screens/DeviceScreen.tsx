import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from '../styles/screens/screenStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { deviceService } from '@/src/services/deviceService';
import { ApiError } from '@/src/errors/ApiError';
import BackHeader from '../components/BackHeader';

interface DeviceUserResponse {
    id: string;
    deviceKey: string;
    isActive?: boolean;
    createdAt?: string;
}

export default function DeviceScreen() {
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);

    const [devices, setDevices]       = useState<DeviceUserResponse[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newKey, setNewKey]           = useState('');
    const [adding, setAdding]           = useState(false);
    const [addError, setAddError]       = useState<string | null>(null);

    const [editingId, setEditingId]   = useState<string | null>(null);
    const [editKey, setEditKey]       = useState('');
    const [saving, setSaving]         = useState(false);
    const [saveError, setSaveError]   = useState<string | null>(null);

    const hasActive = devices.some(d => d.isActive);

    useEffect(() => { loadDevices(); }, []);

    const loadDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await deviceService.getDevices();
            setDevices(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Erreur lors du chargement.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        const trimmed = newKey.trim();
        if (!trimmed) return;
        setAdding(true);
        setAddError(null);
        try {
            await deviceService.createDevice(trimmed);
            setNewKey('');
            setShowAddForm(false);
            loadDevices();
        } catch (err: any) {
            setAddError(err?.message ?? 'Erreur lors de la création.');
        } finally {
            setAdding(false);
        }
    };

    const handleSaveEdit = async () => {
        const trimmed = editKey.trim();
        if (!trimmed || !editingId) return;
        setSaving(true);
        setSaveError(null);
        try {
            await deviceService.updateDevice(editingId, trimmed);
            setEditingId(null);
            loadDevices();
        } catch (err: any) {
            setSaveError(err?.message ?? 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleDisable = (deviceId: string) => {
        Alert.alert(
            "Désactiver l'appareil",
            'Voulez-vous désactiver cet appareil ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Désactiver',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deviceService.disableDevice(deviceId);
                            loadDevices();
                        } catch {
                            Alert.alert('Erreur', 'Impossible de désactiver.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={screenStyles.container}>

            {/* ── Header ── */}
            <BackHeader
                title="Mes appareils"
                goTo="/profile"
            />

            <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>

                {loading && <ActivityIndicator color={theme.colors.primary} />}
                {error && <Text style={{ color: theme.colors.error, textAlign: 'center' }}>{error}</Text>}

                {hasActive && (
                    <View style={{
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: theme.colors.warning + '15',
                        borderWidth: 1,
                        borderColor: theme.colors.warning + '40',
                    }}>
                        <Text style={{ fontSize: 13, color: theme.colors.warning, fontWeight: '500' }}>
                            Un appareil actif est déjà associé à votre compte. Désactivez-le avant d'en ajouter un nouveau.
                        </Text>
                    </View>
                )}

                {/* ── Liste ── */}
                {devices.map((device) => {
                    const isEditing = editingId === device.id;

                    return (
                        <View
                            key={device.id}
                            style={{
                                padding: 14,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                backgroundColor: theme.colors.card,
                                gap: 10,
                            }}
                        >
                            {/* Clé + badge */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <MaterialIcons
                                    name="watch"
                                    size={22}
                                    color={device.isActive ? theme.colors.success : theme.colors.textSecondary}
                                />

                                <View style={{ flex: 1 }}>
                                    {isEditing ? (
                                        <TextInput
                                            value={editKey}
                                            onChangeText={setEditKey}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: saveError ? theme.colors.error : theme.colors.border,
                                                borderRadius: 6,
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                fontSize: 14,
                                                color: theme.colors.textPrimary,
                                                backgroundColor: theme.colors.background,
                                            }}
                                        />
                                    ) : (
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.textPrimary }}>
                                            {device.deviceKey}
                                        </Text>
                                    )}
                                    {device.createdAt && (
                                        <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 }}>
                                            Ajouté le {new Date(device.createdAt).toLocaleDateString()}
                                        </Text>
                                    )}
                                </View>

                                <View style={{
                                    paddingHorizontal: 8,
                                    paddingVertical: 3,
                                    borderRadius: 4,
                                    backgroundColor: device.isActive
                                        ? theme.colors.success + '20'
                                        : theme.colors.error + '20',
                                }}>
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '700',
                                        color: device.isActive ? theme.colors.success : theme.colors.error,
                                    }}>
                                        {device.isActive ? 'Actif' : 'Désactivé'}
                                    </Text>
                                </View>
                            </View>

                            {saveError && isEditing && (
                                <Text style={{ fontSize: 12, color: theme.colors.error }}>{saveError}</Text>
                            )}

                            {/* Actions */}
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {isEditing ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={handleSaveEdit}
                                            disabled={saving || !editKey.trim()}
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: 4,
                                                paddingVertical: 10,
                                                borderRadius: 8,
                                                backgroundColor: theme.colors.success,
                                                opacity: saving || !editKey.trim() ? 0.5 : 1,
                                            }}
                                        >
                                            {saving && <ActivityIndicator size="small" color="#fff" />}
                                            <Text style={{ fontWeight: '600', color: '#fff' }}>
                                                {saving ? 'Sauvegarde...' : 'Enregistrer'}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => { setEditingId(null); setSaveError(null); }}
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                paddingVertical: 10,
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                borderColor: theme.colors.border,
                                            }}
                                        >
                                            <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>Annuler</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => { setEditingId(device.id); setEditKey(device.deviceKey); setSaveError(null); }}
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                paddingVertical: 10,
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                borderColor: theme.colors.border,
                                            }}
                                        >
                                            <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>Modifier</Text>
                                        </TouchableOpacity>

                                        {device.isActive && (
                                            <TouchableOpacity
                                                onPress={() => handleDisable(device.id)}
                                                style={{
                                                    flex: 1,
                                                    alignItems: 'center',
                                                    paddingVertical: 10,
                                                    borderRadius: 8,
                                                    borderWidth: 1,
                                                    borderColor: theme.colors.error,
                                                }}
                                            >
                                                <Text style={{ fontWeight: '600', color: theme.colors.error }}>Désactiver</Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>
                        </View>
                    );
                })}

                {/* ── Formulaire ajout ── */}
                {showAddForm && (
                    <View style={{
                        padding: 14,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.card,
                        gap: 10,
                    }}>
                        <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>Ajouter un appareil</Text>
                        <TextInput
                            value={newKey}
                            onChangeText={setNewKey}
                            placeholder="Clé de l'appareil"
                            placeholderTextColor={theme.colors.textSecondary}
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={{
                                borderWidth: 1,
                                borderColor: addError ? theme.colors.error : theme.colors.border,
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                fontSize: 14,
                                color: theme.colors.textPrimary,
                                backgroundColor: theme.colors.background,
                            }}
                        />
                        {addError && <Text style={{ fontSize: 12, color: theme.colors.error }}>{addError}</Text>}

                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                                onPress={handleAdd}
                                disabled={adding || !newKey.trim()}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 4,
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    backgroundColor: theme.colors.primary,
                                    opacity: adding || !newKey.trim() ? 0.5 : 1,
                                }}
                            >
                                {adding && <ActivityIndicator size="small" color="#fff" />}
                                <Text style={{ fontWeight: '600', color: '#fff' }}>
                                    {adding ? 'Ajout...' : 'Confirmer'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { setShowAddForm(false); setNewKey(''); setAddError(null); }}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    paddingVertical: 12,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* ── Bouton ajouter ── */}
                {!showAddForm && (
                    <TouchableOpacity
                        onPress={() => { setShowAddForm(true); setAddError(null); }}
                        disabled={hasActive}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 6,
                            paddingVertical: 14,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderStyle: 'dashed',
                            borderColor: hasActive ? theme.colors.border : theme.colors.primary,
                            opacity: hasActive ? 0.4 : 1,
                        }}
                    >
                        <MaterialIcons name="add" size={20} color={theme.colors.primary} />
                        <Text style={{ fontWeight: '600', color: theme.colors.primary }}>
                            Ajouter un appareil
                        </Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </View>
    );
}