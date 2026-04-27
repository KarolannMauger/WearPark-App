import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/src/context/ThemeContext';
import { createScreenStyles } from '@/src/styles/screens/screenStyles';
import { adminService } from '@/src/services/adminService';
import { adminDeviceService } from '@/src/services/adminDeviceService';
import LoadingView from '@/src/components/LoadingView';
import ErrorView from '@/src/components/ErrorView';
import { ApiError } from '@/src/errors/ApiError';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminUserDetailsResponse } from '../types/adminUserTypes';
import InputField from '../components/InputField';
import { AdminUserDetailsRequest } from '../types/adminUserTypes';
import Checkbox from 'expo-checkbox';
import { createUserFormStyles } from '../styles/components/userFormStyles';

export default function UserDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const styles = createUserFormStyles(theme);

    const [user, setUser] = useState<AdminUserDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const DISEASES = [
        "Parkinson",
        "Alzheimer",
        "Sclérose en plaques",
        "Épilepsie",
        "Autre",
    ];
    const GENDERS = [
        "Homme",
        "Femme",
        "Autre",
        "Préfère ne pas dire",
    ];

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [isEditingDevices, setIsEditingDevices] = useState(false);

    const [form, setForm] = useState<AdminUserDetailsRequest>({
        firstName: '',
        lastName: '',
        role: 'USER',
        gender: '',
        hasDiagnosis: false,
        diagnosis: ''
    });

    useEffect(() => {
        loadUser();
    }, [id]);

    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                role: user.role?.toUpperCase() as 'USER' | 'ADMIN',
                gender: user.gender ?? '',
                hasDiagnosis: user.hasDiagnosis ?? false,
                diagnosis: user.diagnosis ?? ''
            });
        }
    }, [user]);

    const loadUser = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await adminService.getUserById(id as string);
            setUser(data);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Erreur lors du chargement.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDisableDevice = async (deviceId: string) => {
        Alert.alert(
            "Désactiver l'appareil",
            "Voulez-vous désactiver cet appareil ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Désactiver",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await adminDeviceService.disableDevice(deviceId);
                            loadUser();
                        } catch {
                            Alert.alert("Erreur", "Impossible de désactiver");
                        }
                    }
                }
            ]
        );
    };

    const updateField = <K extends keyof AdminUserDetailsRequest>(
        field: K,
        value: AdminUserDetailsRequest[K]
    ) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            await adminService.updateUser(user!.id, form);
            setIsEditing(false);
            loadUser();
        } catch {
            Alert.alert("Erreur", "Impossible de sauvegarder");
        }
    };

    if (loading) return <LoadingView message="Chargement..." />;
    if (error) return <ErrorView message={error} onRetry={loadUser} />;
    if (!user) return <ErrorView message="Utilisateur introuvable" />;

    return (
        <ScrollView style={[screenStyles.container, { padding: 20 }]}>

            {/* HEADER */}
            <View style={{ marginBottom: 20 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: theme.colors.primary }}>← Retour</Text>
                </TouchableOpacity>

                <Text style={[theme.typography.h2, { marginTop: 10 }]}>
                    {user.firstName} {user.lastName}
                </Text>

                <Text style={{ color: theme.colors.textSecondary }}>
                    {user.email}
                </Text>
            </View>

            <View style={{
                flexDirection: Platform.OS === 'web' ? 'row' : 'column',
                gap: 20
            }}>

                <View style={{ flex: 1 }}>
                    <View style={cardStyle(theme)}>

                        {/* ===== READ ONLY ===== */}
                        <Text style={[theme.typography.h3, { marginBottom: 10 }]}>
                            Informations
                        </Text>

                        <InfoRow label="ID" value={user.id} />
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Date de naissance" value={formatDate(user.dateOfBirth)} />
                        <InfoRow label="Créé le" value={formatDate(user.createdAt)} />
                        <InfoRow label="Mis à jour" value={formatDate(user.updatedAt)} />

                        {/* ===== EDITABLE ===== */}
                        <Text style={[theme.typography.h3, { marginTop: 20, marginBottom: 10 }]}>
                            Profil
                        </Text>

                        {isEditingUser ? (
                            <>
                                <InputField
                                    label="Prénom"
                                    value={form.firstName}
                                    onChange={(v: string) => updateField('firstName', v)}
                                />

                                <InputField
                                    label="Nom"
                                    value={form.lastName}
                                    onChange={(v: string) => updateField('lastName', v)}
                                />

                                {/* ROLE */}
                                <Text style={theme.typography.inputLabel}>Rôle</Text>
                                <select
                                    value={form.role}
                                    onChange={(e) =>
                                        updateField('role', e.target.value as 'USER' | 'ADMIN')
                                    }
                                    style={selectStyle}
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>

                                {/* GENDER */}
                                <Text style={theme.typography.inputLabel}>Genre</Text>
                                <select
                                    value={form.gender}
                                    onChange={(e) => updateField('gender', e.target.value)}
                                    style={selectStyle}
                                >
                                    <option value="">Sélectionner...</option>
                                    {GENDERS.map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>

                                {/* DIAGNOSIS */}
                                <View style={styles.checkboxRow}>
                                    <Checkbox
                                        value={form.hasDiagnosis}
                                        onValueChange={(v) => updateField('hasDiagnosis', v)}
                                    />
                                    <Text>Diagnostic</Text>
                                </View>

                                {form.hasDiagnosis && (
                                    <select
                                        value={form.diagnosis}
                                        onChange={(e) => updateField('diagnosis', e.target.value)}
                                        style={selectStyle}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {DISEASES.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                )}
                            </>
                        ) : (
                            <>
                                <InfoRow label="Prénom" value={user.firstName} />
                                <InfoRow label="Nom" value={user.lastName} />
                                <InfoRow label="Rôle" value={user.role} />
                                <InfoRow label="Genre" value={user.gender ?? 'N/A'} />
                                <InfoRow label="Diagnostic" value={user.diagnosis ?? 'Aucun'} />
                            </>
                        )}
                        <TouchableOpacity
                            onPress={() => setIsEditingUser(!isEditingUser)}
                            style={{
                                marginTop: 10,
                                backgroundColor: theme.colors.primary,
                                padding: 10,
                                borderRadius: 8,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: '#fff' }}>
                                {isEditingUser ? 'Annuler' : 'Modifier'}
                            </Text>
                        </TouchableOpacity>

                        {isEditingUser && (
                            <TouchableOpacity
                                onPress={handleSave}
                                style={{
                                    marginTop: 10,
                                    backgroundColor: theme.colors.success,
                                    padding: 10,
                                    borderRadius: 8,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: '#fff' }}>Enregistrer</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={{ flex: 1 }}>
                    <View style={cardStyle(theme)}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={theme.typography.h3}>
                                Devices ({user.devices?.length ?? 0})
                            </Text>

                            <TouchableOpacity
                                onPress={() => setIsEditingDevices(!isEditingDevices)}
                            >
                                <Text style={{ color: theme.colors.primary }}>
                                    {isEditingDevices ? 'Terminer' : 'Modifier'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {user.devices?.map((device) => (
                            <View key={device.id} style={deviceRow(theme)}>

                                <View style={{ flex: 1 }}>
                                    <Text>{device.deviceKey}</Text>
                                    <Text>{formatDate(device.createdAt)}</Text>
                                </View>

                                {isEditingDevices ? (
                                    <TouchableOpacity
                                        onPress={() => handleDisableDevice(device.id)}
                                    >
                                        <MaterialIcons
                                            name="block"
                                            size={20}
                                            color={theme.colors.error}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={{
                                        padding: 6,
                                        borderRadius: 6,
                                        backgroundColor: device.isActive
                                            ? theme.colors.success + '20'
                                            : theme.colors.error + '20'
                                    }}>
                                        <Text>
                                            {device.isActive ? 'ACTIVE' : 'DISABLED'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}

                    </View>

                </View>
            </View>

        </ScrollView>
    );
}

/* helpers */
function InfoRow({ label, value }: any) {
    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 12, opacity: 0.6 }}>{label}</Text>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {value ?? 'N/A'}
            </Text>
        </View>
    );
}

const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : 'N/A';

const cardStyle = (theme: any) => ({
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border
});

const deviceRow = (theme: any) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border
});

const selectStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 12,
    fontSize: 14
};

const btn = (theme: any, type: 'primary' | 'success' | 'secondary') => ({
    padding: 10,
    borderRadius: 6,
    backgroundColor:
        type === 'primary' ? theme.colors.primary :
            type === 'success' ? theme.colors.success :
                '#ccc'
});

const btnText = {
    color: '#fff',
    fontWeight: '600'
};