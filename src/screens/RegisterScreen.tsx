import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/src/context/UserContext";
import { authService } from "@/src/services/authService";

export default function Register() {
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

      // logs in after signin up to eventually fill user form
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
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ padding: 20, justifyContent: 'center', minHeight: '100%' }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40 }}>
        Create an account
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 8, fontSize: 14 }}>Email</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 8, fontSize: 14 }}>Password</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              paddingRight: 50,
              fontSize: 16,
            }}
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
            style={{ position: 'absolute', right: 12, top: 12 }}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <Text style={{ color: 'red', marginBottom: 20, fontSize: 14 }}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20,
        }}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            SIGN UP
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 14 }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 14 }}>
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}