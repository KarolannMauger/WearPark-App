import React from 'react';
import { Slot } from 'expo-router';
import { View, Text, Platform, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { useUser } from '@/src/context/UserContext';
import { useRouter } from 'expo-router';
import SidebarLink from '@/src/components/SidebarLink';
import Button from '@/src/components/Button';

export default function AdminLayout() {
    const theme = useTheme();
    const { logout } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    if (Platform.OS !== 'web') {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 16 }}>
                <Text style={theme.typography.h3}>Console admin</Text>
                <Text style={{ color: theme.colors.textPrimary, textAlign: 'center' }}>
                    La console d'administration est accessible sur navigateur web uniquement.
                </Text>
                <Button
                    title="Se déconnecter"
                    onPress={handleLogout}
                />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>

            <View style={{
                width: 240,
                backgroundColor: theme.colors.background,
                paddingHorizontal: 20,
                borderRightWidth: 1,
                borderColor: theme.colors.border
            }}>
                <Image
                    source={require('../../../assets/images/wearkpark-logo.png')}
                    style={{ width: '100%', height: 60, marginBottom: 40 }}
                    resizeMode="contain"
                />

                <SidebarLink label="Dashboard" href="/admin/dashboard" />
            </View>

            <View style={{ flex: 1 }}>

                <View style={{
                    height: 60,
                    borderBottomWidth: 1,
                    borderColor: theme.colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                }}>
                    <Text style={theme.typography.h3}>Console admin</Text>

                    <Button
                        title="Se déconnecter"
                        onPress={handleLogout}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Slot />
                </View>
            </View>
        </View>
    );
}