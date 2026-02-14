import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/src/context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createAuthStyles } from "../styles/screens/authStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackHeader from "../components/BackHeader";

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

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(email.toLowerCase().trim(), password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={screenStyles.redContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: 300, paddingHorizontal: 20 }}>
          <BackHeader title="Connexion" goTo="/home" color="#fff" />
          <Image
            source={require('../../assets/images/wearpark-logo-rounded.png')}
            style={{ height:80, alignSelf: 'center', marginTop: 20 }}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/images/wearkpark-title-white.png')}
            style={{ height:36, alignSelf: 'center', marginTop: 10 }}
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
              placeholder="Enter your email"
              returnKeyType="next"
            />
          </View>

          <View style={authStyles.inputGroup}>
            <Text style={authStyles.label}>Password</Text>
            <View style={authStyles.passwordWrapper}>
              <TextInput
                style={authStyles.inputPassword}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                autoCapitalize="none"
                returnKeyType="done"
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
              <Text style={authStyles.buttonText}>LOG IN</Text>
            )}
          </TouchableOpacity>

          <View style={authStyles.loginRow}>
            <Text style={authStyles.loginText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={authStyles.loginLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}