import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/src/context/ThemeContext';
import { createScreenStyles } from '@/src/styles/screens/screenStyles';
import { adminService } from '@/src/services/adminService';
import LoadingView from '@/src/components/LoadingView';
import ErrorView from '@/src/components/ErrorView';
import { ApiError } from '@/src/errors/ApiError';
import { MaterialIcons } from '@expo/vector-icons';

export default function UserDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUser();
    }, [id]);

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

    if (loading) {
        return <LoadingView message="Chargement du profil..." />;
    }

    if (error) {
        return <ErrorView message={error} onRetry={loadUser} />;
    }

    if (!user) {
        return <ErrorView message="Utilisateur introuvable" />;
    }

    return (
        <ScrollView style={[screenStyles.container, { padding: 20 }]}>
            
            {/* Header */}
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

            {/* Card Info */}
            <View style={{
                backgroundColor: theme.colors.card,
                padding: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.colors.border,
                marginBottom: 20
            }}>
                <InfoRow label="Rôle" value={user.role} />
                <InfoRow label="Date de naissance" value={user.dateOfBirth} />
                <InfoRow label="Genre" value={user.gender ?? 'N/A'} />
                <InfoRow label="Diagnostic" value={user.diagnosis ?? 'Aucun'} />
                <InfoRow label="Créé le" value={new Date(user.createdAt).toLocaleDateString()} />
            </View>

            {/* Actions */}
            <View style={{ gap: 10 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: theme.colors.primary,
                        padding: 14,
                        borderRadius: 8,
                        alignItems: 'center'
                    }}
                    onPress={() => console.log('Edit user')}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: theme.colors.error,
                        padding: 14,
                        borderRadius: 8,
                        alignItems: 'center'
                    }}
                    onPress={() => console.log('Delete user')}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 12, opacity: 0.6 }}>{label}</Text>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{value}</Text>
        </View>
    );
}