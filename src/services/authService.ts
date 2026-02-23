import axios from "axios";
import { publicApiClient } from "./api";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiError } from "@/src/errors/ApiError";
import { validateEmail, validatePassword } from "../utils/validators";

export interface User {
  id: string;
  email: string;
}

interface LoginResponse {
  jwt: string;
}

interface RegisterData {
  email: string;
  password: string;
}

function handleAuthError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    switch (status) {
      case 400:
        throw new ApiError(400, "INVALID_CREDENTIALS", "Email ou mot de passe incorrect.");
      case 401:
        throw new ApiError(401, "UNAUTHORIZED", "Session invalide.");
      case 409:
        throw new ApiError(409, "EMAIL_EXISTS", "Un compte existe déjà avec cet email.");
      case 423:
        throw new ApiError(423, "ACCOUNT_BLOCKED", "Votre compte est bloqué.");
      case 429:
        throw new ApiError(429, "TOO_MANY_ATTEMPTS", "Trop de tentatives. Réessayez plus tard.");
      default:
        throw new ApiError(status ?? 0, "SERVER_ERROR", "Erreur serveur.");
    }
  }

  throw new ApiError(0, "NETWORK_ERROR", "Problème réseau.");
}

export const authService = {
  register: async (userData: RegisterData): Promise<void> => {
    const emailError = validateEmail(userData.email);
    if (emailError) throw new ApiError(0, "VALIDATION_ERROR", emailError);

    const passwordError = validatePassword(userData.password);
    if (passwordError) throw new ApiError(0, "VALIDATION_ERROR", passwordError);

    try {
      await publicApiClient.post("/auth/register", userData);
    } catch (error) {
      handleAuthError(error);
    }
  },

  login: async (email: string, password: string): Promise<void> => {
    const emailError = validateEmail(email);
    if (emailError) throw new ApiError(0, "VALIDATION_ERROR", emailError);

    if (!password) {
      throw new ApiError(0, "VALIDATION_ERROR", "Password is required.");
    }

    try {
      const response = await publicApiClient.post<LoginResponse>(
        "/auth/login",
        { email, password }
      );

      await SecureStore.setItemAsync("userToken", response.data.jwt);
      await AsyncStorage.setItem("user", JSON.stringify({ email }));
    } catch (error) {
      handleAuthError(error);
    }
  },

  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync("userToken");
    await AsyncStorage.removeItem("user");
  },

  getStoredUser: async (): Promise<{ email: string } | null> => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync("userToken");
    return !!token;
  },
};