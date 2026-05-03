import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/src/context/ThemeContext';
import { createScreenStyles } from '@/src/styles/screens/screenStyles';
import { adminService } from '@/src/services/adminService';
import LoadingView from '@/src/components/LoadingView';
import ErrorView from '@/src/components/ErrorView';
import { ApiError } from '@/src/errors/ApiError';
import { AdminUserDetailsResponse, AdminUserDetailsRequest } from '../types/adminUserTypes';
import AdminUserInfoCard from '../components/AdminUserInfoCard';
import DevicesCard from '../components/DevicesCard';

export default function UserDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);

    const [user, setUser] = useState<AdminUserDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditingUser, setIsEditingUser] = useState(false);

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
            setError(err instanceof ApiError ? err.message : 'Erreur lors du chargement.');
        } finally {
            setLoading(false);
        }
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
            setIsEditingUser(false);
            loadUser();
        } catch {
            // géré dans UserInfoCard via Alert
        }
    };

    if (loading) return <LoadingView message="Chargement..." />;
    if (error) return <ErrorView message={error} onRetry={loadUser} />;
    if (!user) return <ErrorView message="Utilisateur introuvable" />;

    return (
        <ScrollView style={[screenStyles.container, { padding: 20 }]}>

            {/* HEADER */}
            <View style={{ marginBottom: 20 }}>
                <TouchableOpacity onPress={() => router.push("/admin/dashboard")}>
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
                    <AdminUserInfoCard
                        user={user}
                        form={form}
                        isEditing={isEditingUser}
                        theme={theme}
                        onToggleEdit={() => setIsEditingUser(prev => !prev)}
                        onSave={handleSave}
                        onUpdateField={updateField}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <DevicesCard
                        user={user}
                        theme={theme}
                        onDeviceChanged={loadUser}
                    />
                </View>
            </View>

        </ScrollView>
    );
}