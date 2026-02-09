import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/src/context/UserContext";
import { authService } from "@/src/services/authService";
import { useTheme } from '../context/ThemeContext';
import { createScreenStyles } from "../styles/screens/screenStyles";
import { createMotionStyles } from '../styles/screens/motionStyle';
import { createAuthStyles } from "../styles/screens/authStyles";

export default function Register() {
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

  const handleSignup = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const trimmedEmail = email.toLowerCase().trim();

      await authService.register({
        email: trimmedEmail,
        password: password,
      });

      // logs in after signup to eventually fill user form
      await login(trimmedEmail, password);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={authStyles.container}
    >
      <Text style={authStyles.title}>Create an account</Text>

      <View style={authStyles.inputGroup}>
        <Text style={authStyles.label}>Email</Text>
        <TextInput
          style={authStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
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
            placeholder="Create a password"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSignup}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={authStyles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#666"
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
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={authStyles.buttonText}>SIGN UP</Text>
        )}
      </TouchableOpacity>

      <View style={authStyles.loginRow}>
        <Text style={authStyles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={authStyles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
