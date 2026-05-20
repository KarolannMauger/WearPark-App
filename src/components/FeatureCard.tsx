import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { useTheme } from '../context/ThemeContext';
import { View, Text } from 'react-native';


export default function FeatureCard({ icon, title, description }: {
    icon: ComponentProps<typeof MaterialIcons>['name'],
    title: string,
    description: string
}) {
    const theme = useTheme();

    return (
        <View style={{
            flexDirection: 'row',
            gap: 16,
            marginBottom: 24,
            padding: 20,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.15)',
        }}>
            <MaterialIcons name={icon} size={32} color={theme.colors.white} />
            <View style={{ flex: 1 }}>
                <Text style={{
                    color: theme.colors.white,
                    fontSize: 18,
                    fontWeight: '600',
                    marginBottom: 4,
                }}>
                    {title}
                </Text>
                <Text style={{ color: theme.colors.white, opacity: 0.9 }}>
                    {description}
                </Text>
            </View>
        </View>
    );
}