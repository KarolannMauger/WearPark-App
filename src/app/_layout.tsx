import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider } from "../context/ThemeContext";
import { useFonts, WorkSans_300Light, WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold, WorkSans_700Bold, WorkSans_900Black, } from "@expo-google-fonts/work-sans";

export default function RootLayout() {

    const [fontsLoaded] = useFonts({
        WorkSans_300Light,
        WorkSans_400Regular,
        WorkSans_500Medium,
        WorkSans_600SemiBold,
        WorkSans_700Bold,
        WorkSans_900Black,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ThemeProvider>
        <SafeAreaProvider>
            <StatusBar
                style='dark'
                // style={theme === 'dark' ? 'light' : 'dark'}
                backgroundColor="transparent"
                translucent
            />
            <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
        </ThemeProvider>
    );
}