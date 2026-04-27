import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/src/context/ThemeContext';

export default function SidebarLink({ label, href }: { label: string; href: string }) {
    const theme = useTheme();
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(href)}
            style={{ marginBottom: 10 }}
        >
            <Text style={theme.typography.h2}>{label}</Text>
        </TouchableOpacity>
    );
}