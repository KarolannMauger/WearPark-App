import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { adminDeviceService } from '@/src/services/adminDeviceService';
import { AdminUserDetailsResponse } from '../types/adminUserTypes';
import { createUserDetailsStyles } from '../styles/components/userDetailsStyles';
import { formatDate } from '../utils/date';

interface Props {
    user: AdminUserDetailsResponse;
    isEditing: boolean;
    theme: any;
    onToggleEdit: () => void;
    onDeviceChanged: () => void;
}

export default function DevicesCard({
    user,
    isEditing,
    theme,
    onToggleEdit,
    onDeviceChanged,
}: Props) {
    const styles = createUserDetailsStyles(theme);

    const handleDisableDevice = (deviceId: string) => {
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
                            onDeviceChanged();
                        } catch {
                            Alert.alert("Erreur", "Impossible de désactiver");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.card}>

            <View style={styles.deviceCardHeader}>
                <Text style={theme.typography.h3}>
                    Devices ({user.devices?.length ?? 0})
                </Text>
                {!user.isDeleted && (
                    <>
                        <TouchableOpacity onPress={onToggleEdit}>
                            <Text style={{ color: theme.colors.primary }}>
                                {isEditing ? 'Terminer' : 'Modifier'}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {user.devices?.map((device) => (
                <View key={device.id} style={styles.deviceRow}>

                    <View style={{ flex: 1 }}>
                        <Text>{device.deviceKey}</Text>
                        <Text>{formatDate(device.createdAt)}</Text>
                    </View>

                    {isEditing ? (
                        <TouchableOpacity onPress={() => handleDisableDevice(device.id)}>
                            <MaterialIcons
                                name="block"
                                size={20}
                                color={theme.colors.error}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={[
                            styles.deviceBadge,
                            {
                                backgroundColor: device.isActive
                                    ? theme.colors.success + '20'
                                    : theme.colors.error + '20'
                            }
                        ]}>
                            <Text>{device.isActive ? 'ACTIVE' : 'DISABLED'}</Text>
                        </View>
                    )}
                </View>
            ))}

        </View>
    );
}