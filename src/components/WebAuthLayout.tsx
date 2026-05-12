import React from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import WebFooter from './WebFooter';
import { router } from 'expo-router';

interface Props {
    children: React.ReactNode;
}

export default function WebAuthLayout({ children }: Props) {
    const theme = useTheme();

    return (
        <View style={{ flex: 1, minHeight: '100vh' as any, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                {/* Header */}
                <View style={{
                    backgroundColor: theme.colors.primary,
                    paddingVertical: 20,
                    paddingHorizontal: 60,
                    alignItems: 'flex-start',
                }}>
                    <TouchableOpacity onPress={() => router.push('/')}>
                        <Image
                            source={require('../../assets/images/wearkpark-logo-white.png')}
                            style={{ height: 40, width: 160 }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {/* Contenu */}
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 48,
                    paddingHorizontal: 20,
                }}>
                    <View style={{
                        width: '100%',
                        maxWidth: 420,
                        backgroundColor: theme.colors.card,
                        borderRadius: 12,
                        padding: 40,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}>
                        {children}
                    </View>
                </View>

                {/* Footer */}
                <WebFooter />

            </ScrollView>
        </View>
    );
}