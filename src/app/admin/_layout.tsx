import { Slot } from 'expo-router';
import { View, Text, Platform, Image } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import SidebarLink from '@/src/components/SidebarLink';

export default function AdminLayout() {
    const theme = useTheme();

    if (Platform.OS !== 'web') {
        return <Slot />; // mobile fallback
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>

            {/* SIDEBAR */}
            <View style={{
                width: 240,
                backgroundColor: theme.colors.background,
                padding: 20,
                borderRightWidth: 1,
                borderColor: theme.colors.border
            }}>
                <Image
                    source={require('../../../assets/images/wearkpark-logo-white.png')}
                    style={{ width: '80%', height: 60, marginTop: -20, marginBottom: 40 }}
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
                    justifyContent: 'center',
                    paddingHorizontal: 20
                }}>
                    <Text style={theme.typography.h3}>
                        Admin Console
                    </Text>
                </View>

                {/* CONTENT */}
                <View style={{ flex: 1 }}>
                    <Slot />
                </View>
            </View>
        </View>
    );
}