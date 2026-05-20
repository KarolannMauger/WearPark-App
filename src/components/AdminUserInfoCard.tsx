import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import InputField from '../components/InputField';
import { AdminUserDetailsResponse, AdminUserDetailsRequest } from '../types/adminUserTypes';
import { GENDERS, DISEASES } from '../constants/user.constants';
import { createUserDetailsStyles, selectStyle } from '../styles/components/userDetailsStyles';
import { formatDate } from '../utils/date';

interface Props {
    user: AdminUserDetailsResponse;
    form: AdminUserDetailsRequest;
    isEditing: boolean;
    theme: any;
    onToggleEdit: () => void;
    onSave: () => void;
    onUpdateField: <K extends keyof AdminUserDetailsRequest>(field: K, value: AdminUserDetailsRequest[K]) => void;
}

export default function AdminUserInfoCard({
    user,
    form,
    isEditing,
    theme,
    onToggleEdit,
    onSave,
    onUpdateField,
}: Props) {
    const styles = createUserDetailsStyles(theme);

    return (
        <View style={styles.card}>

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

            {isEditing ? (
                <>
                    <InputField
                        label="Prénom"
                        value={form.firstName}
                        onChange={(v: string) => onUpdateField('firstName', v)}
                    />

                    <InputField
                        label="Nom"
                        value={form.lastName}
                        onChange={(v: string) => onUpdateField('lastName', v)}
                    />

                    <Text style={theme.typography.inputLabel}>Rôle</Text>
                    <select
                        value={form.role}
                        onChange={(e) => onUpdateField('role', e.target.value as 'USER' | 'ADMIN')}
                        style={selectStyle}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <Text style={theme.typography.inputLabel}>Genre</Text>
                    <select
                        value={form.gender}
                        onChange={(e) => onUpdateField('gender', e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Sélectionner...</option>
                        {GENDERS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>

                    <View style={styles.checkboxRow}>
                        <Checkbox
                            value={form.hasDiagnosis}
                            onValueChange={(v) => onUpdateField('hasDiagnosis', v)}
                        />
                        <Text>Diagnostic</Text>
                    </View>

                    {form.hasDiagnosis && (
                        <select
                            value={form.diagnosis}
                            onChange={(e) => onUpdateField('diagnosis', e.target.value)}
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

            {!user.isDeleted && (
                <>
                    <TouchableOpacity
                        onPress={onToggleEdit}
                        style={[styles.btn, { backgroundColor: theme.colors.primary }]}
                    >
                        <Text style={styles.btnText}>
                            {isEditing ? 'Annuler' : 'Modifier'}
                        </Text>
                    </TouchableOpacity>

                    {isEditing && (
                        <TouchableOpacity
                            onPress={onSave}
                            style={[styles.btn, { backgroundColor: theme.colors.success }]}
                        >
                            <Text style={styles.btnText}>Enregistrer</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

        </View>
    );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 12, opacity: 0.6 }}>{label}</Text>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{value ?? 'N/A'}</Text>
        </View>
    );
}