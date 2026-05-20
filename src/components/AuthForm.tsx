import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/src/context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { createAuthStyles } from '../styles/screens/authStyles';
import { validateEmail, validatePassword } from '@/src/utils/validators';
import { ApiError } from '@/src/errors/ApiError';
import Button from './Button';

interface Props {
    mode: 'login' | 'register';
}

export default function AuthForm({ mode }: Props) {
    const theme = useTheme();
    const authStyles = createAuthStyles(theme);
    const router = useRouter();
    const { login, register } = useUser();

    const [email, setEmail]               = useState('');
    const [password, setPassword]         = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState<string | null>(null);

    const isLogin = mode === 'login';

    const handleSubmit = async () => {
        setError(null);
        const trimmedEmail = email.toLowerCase().trim();

        const emailError = validateEmail(trimmedEmail);
        if (emailError) { setError(emailError); return; }

        if (isLogin) {
            if (!password) { setError('Le mot de passe est requis.'); return; }
        } else {
            const passwordError = validatePassword(password);
            if (passwordError) { setError(passwordError); return; }
        }

        setLoading(true);
        try {
            if (isLogin) {
                await login(trimmedEmail, password);
            } else {
                await register(trimmedEmail, password);
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Erreur inattendue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Text style={authStyles.title}>
                {isLogin ? 'Connexion' : 'Inscription'}
            </Text>

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
                        onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(p => !p)}
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

            <Button title={isLogin ? 'SE CONNECTER' : "S'INSCRIRE"} onPress={handleSubmit} loading={loading} style={authStyles.button} variant='primary'/>

            <View style={authStyles.loginRow}>
                <Text style={authStyles.loginText}>
                    {isLogin ? 'Pas de compte ? ' : 'Déjà un compte ? '}
                </Text>
                <TouchableOpacity onPress={() => router.push(isLogin ? '/(auth)/register' : '/(auth)/login')}>
                    <Text style={authStyles.loginLink}>
                        {isLogin ? "S'inscrire" : 'Se connecter'}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}