import React from 'react';
import { View, Text, Platform, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
    children: React.ReactNode;
}

export default function MobileOnlyGuard({ children }: Props) {
    const theme = useTheme();

    if (Platform.OS !== 'web') {
        return <>{children}</>;
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 40,
            backgroundColor: theme.colors.background,
            gap: 16,
        }}>
            <Image
                source={require('../../assets/images/wearpark-logo.png')}
                style={{ height: 80, width: 200 }}
                resizeMode="contain"
            />

            <Text style={[theme.typography.h2, { textAlign: 'center' }]}>
                Disponible sur mobile uniquement
            </Text>

            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', fontSize: 15, lineHeight: 22 }}>
                Cette section est optimisée pour l'application mobile. Téléchargez WearPark pour accéder à vos données de tremblements en temps réel.
            </Text>
        </View>
    );
}