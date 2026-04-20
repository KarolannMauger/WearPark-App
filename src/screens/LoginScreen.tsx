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
import { validateEmail } from "@/src/utils/validators";
import { ApiError } from "@/src/errors/ApiError";

export default function Login() {
  const theme = useTheme();
  const screenStyles = createScreenStyles(theme);
  const authStyles = createAuthStyles(theme);

  const router = useRouter();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isWeb = Platform.OS === 'web';

  const handleLogin = async () => {
    setError(null);

    const trimmedEmail = email.toLowerCase().trim();

    const emailError = validateEmail(trimmedEmail);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password) {
      setError("Le mot de passe est requis.");
      return;
    }

    setLoading(true);

    try {
      await login(trimmedEmail, password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Erreur inattendue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Layout Web simplifié
  if (isWeb) {
    return (
      <View style={{ 
        minHeight: '100vh', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
        <View style={{ 
          width: '100%', 
          maxWidth: 400, 
          padding: 40,
          backgroundColor: theme.colors.card,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        }}>
          <Image
            source={require('../../assets/images/wearpark-logo-rounded.png')}
            style={{ height: 80, alignSelf: 'center', marginBottom: 20 }}
            resizeMode="contain"
          />
          <Text style={[theme.typography.h2, { textAlign: 'center', marginBottom: 30 }]}>
            Connexion
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
                autoCapitalize="none"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={authStyles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && <Text style={authStyles.error}>{error}</Text>}

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>SE CONNECTER</Text>
            )}
          </TouchableOpacity>

          <View style={authStyles.loginRow}>
            <Text style={authStyles.loginText}>Pas de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={authStyles.loginLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Layout Mobile (existant)
  return (
    <View style={screenStyles.redContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
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
            source={require('../../assets/images/wearkpark-title-white.png')}
            style={{ height: 36, alignSelf: 'center', marginTop: 10 }}
            resizeMode="contain"
          />
        </View>

        <View style={authStyles.container}>
          <View style={authStyles.inputGroup}>
            <Text style={authStyles.label}>Email</Text>
            <TextInput
              style={authStyles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="votre@email.com"
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
                autoCapitalize="none"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={authStyles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && <Text style={authStyles.error}>{error}</Text>}

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.buttonText}>SE CONNECTER</Text>
            )}
          </TouchableOpacity>

          <View style={authStyles.loginRow}>
            <Text style={authStyles.loginText}>Pas de compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={authStyles.loginLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}