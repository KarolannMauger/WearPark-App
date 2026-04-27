import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { createScreenStyles } from '@/src/styles/screens/screenStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { adminService } from '@/src/services/adminService';
import { UserSummary } from '@/src/types/adminUserTypes';
import LoadingView from '@/src/components/LoadingView';
import ErrorView from '@/src/components/ErrorView';
import { ApiError } from '@/src/errors/ApiError';
import { useUser } from '@/src/context/UserContext';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const router = useRouter();
    const { user, logout } = useUser();

    const [users, setUsers] = useState<UserSummary[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async (pageNumber = 0) => {
        setLoading(true);
        setError(null);

        try {
            const response = await adminService.getUsers({ page: pageNumber, limit: 20 });

            setUsers(response.content);
            setPage(response.page);
            setTotalPages(response.totalPages);

        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Erreur inattendue lors du chargement.');
            }
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    if (loading) {
        return (
            <View style={screenStyles.container}>
                <LoadingView message="Chargement des utilisateurs..." />
            </View>
        );
    }

    if (error) {
        return (
            <View style={screenStyles.container}>
                <ErrorView message={error} onRetry={loadUsers} />
            </View>
        );
    }

    return (
        <View style={[screenStyles.container, { flex: 1 }]}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                backgroundColor: theme.colors.card,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }}>
                <Text style={theme.typography.h2}>Admin - Users ({users.length})</Text>
                <TouchableOpacity
                    onPress={handleLogout}
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 8,
                        backgroundColor: theme.colors.error,
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Users List */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {users.map((user) => (
                    <View
                        key={user.id}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                            marginBottom: 12,
                            backgroundColor: theme.colors.card,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={theme.typography.h3}>
                                {user.firstName} {user.lastName}
                            </Text>
                            <Text style={[theme.typography.body, { color: theme.colors.textSecondary, fontSize: 14 }]}>
                                {user.email}
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                                <View style={{
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 4,
                                    backgroundColor: user.role === 'admin' ? theme.colors.warning + '20' : theme.colors.success + '20',
                                }}>
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '600',
                                        color: user.role === 'admin' ? theme.colors.warning : theme.colors.success,
                                    }}>
                                        {user.role}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push(`/admin/users/${user.id}`)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 6,
                                backgroundColor: theme.colors.primary,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>View</Text>
                            <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity
                    disabled={page === 0}
                    onPress={() => loadUsers(page - 1)}
                >
                    <Text>Previous</Text>
                </TouchableOpacity>

                <Text>Page {page + 1} / {totalPages}</Text>

                <TouchableOpacity
                    disabled={page + 1 >= totalPages}
                    onPress={() => loadUsers(page + 1)}
                >
                    <Text>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}