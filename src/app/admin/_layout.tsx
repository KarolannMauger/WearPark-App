import { Slot } from 'expo-router';
import { View, Text, Platform, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { useUser } from '@/src/context/UserContext';
import { useRouter } from 'expo-router';
import SidebarLink from '@/src/components/SidebarLink';

export default function AdminLayout() {
    const theme = useTheme();
    const { logout } = useUser();
    const router = useRouter();

    if (Platform.OS !== 'web') {
        return <Slot />;
    }

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>

            {/* SIDEBAR */}
            <View style={{
                width: 240,
                backgroundColor: theme.colors.background,
                paddingHorizontal: 20,
                borderRightWidth: 1,
                borderColor: theme.colors.border
            }}>
                <Image
                    source={require('../../../assets/images/wearkpark-logo.png')}
                    style={{ width: '100%', height: 60,  marginBottom: 40 }}
                    resizeMode="contain"
                />

                <SidebarLink label="Dashboard" href="/admin/dashboard" />
            </View>

            {/* MAIN */}
            <View style={{ flex: 1 }}>

                {/* HEADER */}
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

                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 8,
                            backgroundColor: theme.colors.error,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* CONTENT */}
                <View style={{ flex: 1 }}>
                    <Slot />
                </View>
            </View>
        </View>
    );
}