import React from 'react';
import { View, Image, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from '../styles/screens/screenStyles';
import { createAuthStyles } from '../styles/screens/authStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BackHeader from '../components/BackHeader';
import WebAuthLayout from '../components/WebAuthLayout';
import AuthForm from '../components/AuthForm';

export default function LoginScreen() {
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const authStyles = createAuthStyles(theme);

    if (Platform.OS === 'web') {
        return (
            <WebAuthLayout>
                <AuthForm mode="login" />
            </WebAuthLayout>
        );
    }

    return (
        <View style={screenStyles.redContainer}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ height: 300, paddingHorizontal: 20 }}>
                    <BackHeader title="Connexion" goTo="/" color="#fff" />
                    <Image
                        source={require('../../assets/images/wearpark-logo-rounded.png')}
                        style={{ height: 80, alignSelf: 'center', marginTop: 20 }}
                        resizeMode="contain"
                    />
                    <Image
                        source={require('../../assets/images/wearpark-title-white.png')}
                        style={{ height: 36, alignSelf: 'center', marginTop: 10 }}
                        resizeMode="contain"
                    />
                </View>

                <View style={authStyles.container}>
                    <AuthForm mode="login" />
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}