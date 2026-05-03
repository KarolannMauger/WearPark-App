import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/src/context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createAuthStyles } from "../styles/screens/authStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackHeader from "../components/BackHeader";
import WebAuthLayout from "../components/WebAuthLayout";
import { validateEmail, validatePassword } from "@/src/utils/validators";
import { ApiError } from "@/src/errors/ApiError";

export default function Register() {
    const theme = useTheme();
    const screenStyles = createScreenStyles(theme);
    const authStyles = createAuthStyles(theme);

    const router = useRouter();
    const { register } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        setError(null);
        const trimmedEmail = email.toLowerCase().trim();

        const emailError = validateEmail(trimmedEmail);
        if (emailError) { setError(emailError); return; }

        const passwordError = validatePassword(password);
        if (passwordError) { setError(passwordError); return; }

        setLoading(true);
        try {
            await register(trimmedEmail, password);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Erreur inattendue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const form = (
        <>
            <Text style={authStyles.title}>Inscription</Text>

            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Email</Text>
                <TextInput
                    style={authStyles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="votre@email.com"
                    placeholderTextColor={theme.colors.textSecondary}
                />
            </View>

            <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Mot de passe</Text>
                <View style={authStyles.passwordWrapper}>
                    <TextInput
                        style={authStyles.inputPassword}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholder="••••••••"
                        placeholderTextColor={theme.colors.textSecondary}
                        autoCapitalize="none"
                        onSubmitEditing={handleSignup}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={authStyles.eyeButton}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={22}
                            color={theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {error && <Text style={authStyles.error}>{error}</Text>}

            <TouchableOpacity
                style={authStyles.button}
                onPress={handleSignup}
                disabled={loading}
            >
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={authStyles.buttonText}>S'INSCRIRE</Text>
                }
            </TouchableOpacity>

            <View style={authStyles.loginRow}>
                <Text style={authStyles.loginText}>Déjà un compte ? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={authStyles.loginLink}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    /* ── Web ── */
    if (Platform.OS === 'web') {
        return <WebAuthLayout>{form}</WebAuthLayout>;
    }

    /* ── Mobile ── */
    return (
        <View style={screenStyles.redContainer}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={{ height: 300, paddingHorizontal: 20 }}>
                    <BackHeader title="Inscription" goTo="/" color="#fff" />
                    <Image
                        source={require('../../assets/images/wearpark-logo-rounded.png')}
                        style={{ height: 80, alignSelf: 'center', marginTop: 20 }}
                        resizeMode="contain"
                    />
                    <Image
                        source={require('../../assets/images/wearkpark-title-white.png')}
                        style={{ height: 36, alignSelf: 'center', marginTop: 10 }}
                        resizeMode="contain"
                    />
                </View>

                <View style={authStyles.container}>
                    {form}
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}