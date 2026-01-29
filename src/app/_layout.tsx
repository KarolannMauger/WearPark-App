import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            {/* Vos providers globaux (Context, Theme, etc.) */}
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaProvider>
    );
}