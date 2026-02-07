import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/src/context/UserContext";

export default function Login() {
  const router = useRouter();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // app/login.tsx
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
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40 }}>
        Welcome Back!
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
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your email"
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
            placeholder="Enter your password"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
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
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            LOG IN
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 14 }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 14 }}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}