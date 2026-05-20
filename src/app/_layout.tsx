import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';
import { UserProvider } from '../context/UserContext';
import { useFonts, Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_600SemiBold, Roboto_700Bold, Roboto_900Black } from '@expo-google-fonts/roboto';

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_600SemiBold,
        Roboto_700Bold,
        Roboto_900Black,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider>
            <UserProvider>
                <SafeAreaProvider>
                    <LayoutWithTheme />
                </SafeAreaProvider>
            </UserProvider>
        </ThemeProvider>
    );
}

function LayoutWithTheme() {
    const { mode } = useTheme();

    return (
        <>
            <StatusBar
                style={mode === 'dark' ? 'light' : 'dark'}
            />
            <Stack screenOptions={{ headerShown: false }} />
        </>
    );
}