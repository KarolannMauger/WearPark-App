import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { createScreenStyles } from '@/src/styles/screens/screenStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { adminService } from '@/src/services/adminService';
import { UserSummary } from '@/src/types/adminUserTypes';
import LoadingView from '@/src/components/LoadingView';
import ErrorView from '@/src/components/ErrorView';
import { ApiError } from '@/src/errors/ApiError';

import { useRouter } from 'expo-router';
import ConfirmModal from '../components/ConfirmModal';

const COL = {
    name:      { flex: 2, minWidth: 160 },
    email:     { flex: 3, minWidth: 180 },
    role:      { flex: 1, minWidth: 100 },
    date:      { flex: 1, minWidth: 100 },
    isDeleted: { flex: 1, minWidth: 90  },
    actions:   { flex: 1, minWidth: 100 },
};


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

export default function AdminDashboard() {
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const router = useRouter();

    const [users, setUsers]           = useState<UserSummary[]>([]);
    const [page, setPage]             = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);
    const [actionId, setActionId]     = useState<string | null>(null);
    const [modal, setModal]           = useState<ModalState>(MODAL_CLOSED);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async (pageNumber = 0) => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getUsers({ page: pageNumber, limit: 20 });
            setUsers(response.content);
            setPage(response.page);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setModal(MODAL_CLOSED);

    const handleRoleChange = (u: UserSummary) => {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        setModal({
            visible: true,
            title: 'Modifier le rôle',
            message: `Passer ${u.firstName} ${u.lastName} de "${u.role}" à "${newRole}" ?`,
            confirmLabel: 'Confirmer',
            destructive: false,
            onConfirm: async () => {
                closeModal();
                setActionId(u.id);
                try {
                    await adminService.updateUserRole(u.id, newRole);
                    await loadUsers(page);
                } catch {
                    setModal({ visible: true, title: 'Erreur', message: 'Impossible de modifier le rôle.', confirmLabel: 'OK', destructive: false, onConfirm: closeModal });
                } finally {
                    setActionId(null);
                }
            },
        });
    };

    const handleDelete = (u: UserSummary) => {
        setModal({
            visible: true,
            title: "Supprimer l'utilisateur",
            message: `Voulez-vous supprimer ${u.firstName} ${u.lastName} ? Cette action est irréversible.`,
            confirmLabel: 'Supprimer',
            destructive: true,
            onConfirm: async () => {
                closeModal();
                setActionId(u.id);
                try {
                    await adminService.deleteUser(u.id);
                    await loadUsers(page);
                } catch {
                    setModal({ visible: true, title: 'Erreur', message: "Impossible de supprimer l'utilisateur.", confirmLabel: 'OK', destructive: false, onConfirm: closeModal });
                } finally {
                    setActionId(null);
                }
            },
        });
    };

    if (loading) return <LoadingView message="Chargement des utilisateurs..." />;
    if (error)   return <ErrorView message={error} onRetry={loadUsers} />;

    return (
        <View style={[screenStyles.container, { flex: 1 }]}>

            <ConfirmModal {...modal} onCancel={closeModal} />

            {/* ── Header ── */}
            <View style={{
                padding: 20,
                backgroundColor: theme.colors.card,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }}>
                <Text style={theme.typography.h2}>Utilisateurs ({users.length})</Text>
            </View>

            {/* ── Tableau ── */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>

                {/* En-tête */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: theme.colors.card,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                }}>
                    <HeaderCell col={COL.name}      label="Nom" />
                    <HeaderCell col={COL.email}     label="Email" />
                    <HeaderCell col={COL.role}      label="Rôle" />
                    <HeaderCell col={COL.date}      label="Créé le" />
                    <HeaderCell col={COL.isDeleted} label="Statut" />
                    <HeaderCell col={COL.actions}   label="Actions" />
                </View>

                {/* Lignes */}
                {users.map((u, index) => {
                    const isLast    = index === users.length - 1;
                    const isLoading = actionId === u.id;

                    return (
                        <View
                            key={u.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 12,
                                paddingHorizontal: 12,
                                backgroundColor: u.isDeleted
                                    ? theme.colors.error + '08'
                                    : index % 2 === 0
                                        ? theme.colors.card
                                        : theme.colors.background,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderBottomWidth: 1,
                                borderColor: theme.colors.border,
                                borderBottomLeftRadius:  isLast ? 8 : 0,
                                borderBottomRightRadius: isLast ? 8 : 0,
                                opacity: isLoading ? 0.5 : 1,
                            }}
                        >
                            {/* Nom */}
                            <View style={{ flex: COL.name.flex, minWidth: COL.name.minWidth }}>
                                <Text style={{ fontWeight: '600', fontSize: 14 }}>
                                    {u.firstName} {u.lastName}
                                </Text>
                            </View>

                            {/* Email */}
                            <View style={{ flex: COL.email.flex, minWidth: COL.email.minWidth }}>
                                <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                                    {u.email}
                                </Text>
                            </View>

                            {/* Rôle — cliquable */}
                            <View style={{ flex: COL.role.flex, minWidth: COL.role.minWidth }}>
                                <TouchableOpacity
                                    onPress={() => handleRoleChange(u)}
                                    disabled={isLoading || u.isDeleted}
                                    style={{
                                        alignSelf: 'flex-start',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4,
                                        paddingHorizontal: 8,
                                        paddingVertical: 3,
                                        borderRadius: 4,
                                        opacity: u.isDeleted ? 0.35 : 1,
                                        backgroundColor: u.role === 'admin'
                                            ? theme.colors.warning + '25'
                                            : theme.colors.success + '25',
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '700',
                                        color: u.role === 'admin' ? theme.colors.warning : theme.colors.success,
                                    }}>
                                        {u.role.toUpperCase()}
                                    </Text>
                                    <MaterialIcons
                                        name="swap-horiz"
                                        size={12}
                                        color={u.role === 'admin' ? theme.colors.warning : theme.colors.success}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Date */}
                            <View style={{ flex: COL.date.flex, minWidth: COL.date.minWidth }}>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </Text>
                            </View>

                            {/* isDeleted */}
                            <View style={{ flex: COL.isDeleted.flex, minWidth: COL.isDeleted.minWidth }}>
                                <View style={{
                                    alignSelf: 'flex-start',
                                    paddingHorizontal: 8,
                                    paddingVertical: 3,
                                    borderRadius: 4,
                                    backgroundColor: u.isDeleted
                                        ? theme.colors.error + '20'
                                        : theme.colors.success + '20',
                                }}>
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '700',
                                        color: u.isDeleted ? theme.colors.error : theme.colors.success,
                                    }}>
                                        {u.isDeleted ? 'SUPPRIMÉ' : 'ACTIF'}
                                    </Text>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={{
                                flex: COL.actions.flex,
                                minWidth: COL.actions.minWidth,
                                flexDirection: 'row',
                                gap: 8,
                                alignItems: 'center',
                            }}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color={theme.colors.primary} />
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => router.push(`/admin/users/${u.id}`)}
                                            style={{ padding: 6, borderRadius: 6, backgroundColor: theme.colors.primary + '15' }}
                                        >
                                            <MaterialIcons name="visibility" size={18} color={theme.colors.primary} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => handleDelete(u)}
                                            disabled={u.isDeleted}
                                            style={{
                                                padding: 6,
                                                borderRadius: 6,
                                                backgroundColor: theme.colors.error + '15',
                                                opacity: u.isDeleted ? 0.35 : 1,
                                            }}
                                        >
                                            <MaterialIcons name="delete-outline" size={18} color={theme.colors.error} />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    );
                })}

            </ScrollView>

            {/* ── Pagination ── */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                backgroundColor: theme.colors.card,
            }}>
                <TouchableOpacity
                    disabled={page === 0}
                    onPress={() => loadUsers(page - 1)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: page === 0 ? 0.35 : 1 }}
                >
                    <MaterialIcons name="chevron-left" size={20} color={theme.colors.primary} />
                    <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Précédent</Text>
                </TouchableOpacity>

                <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
                    Page {page + 1} / {totalPages}
                </Text>

                <TouchableOpacity
                    disabled={page + 1 >= totalPages}
                    onPress={() => loadUsers(page + 1)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: page + 1 >= totalPages ? 0.35 : 1 }}
                >
                    <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Suivant</Text>
                    <MaterialIcons name="chevron-right" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

        </View>
    );
}

function HeaderCell({ col, label }: { col: { flex: number; minWidth: number }; label: string }) {
    return (
        <View style={{ flex: col.flex, minWidth: col.minWidth }}>
            <Text style={{ fontSize: 11, fontWeight: '700', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {label}
            </Text>
        </View>
    );
}