import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';

export default function WebFooter() {
    const theme = useTheme();

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            paddingHorizontal: 60,
        }}>
            <Text style={{ color: theme.colors.textPrimary, opacity: 0.8, fontSize: 13 }}>
                © 2026 WearPark. Tous droits réservés.
            </Text>
            <View style={{ flexDirection: 'row', gap: 24 }}>
                <TouchableOpacity>
                    <Text style={{ color: theme.colors.textPrimary, opacity: 0.8, fontSize: 13 }}>Confidentialité</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{ color: theme.colors.textPrimary, opacity: 0.8, fontSize: 13 }}>Conditions</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{ color: theme.colors.textPrimary, opacity: 0.8, fontSize: 13 }}>Contact</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}