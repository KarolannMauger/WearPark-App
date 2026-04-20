import axios from "axios";
import { publicApiClient } from "./api";
import { storage } from "@/src/utils/storage";
import { ApiError } from "@/src/errors/ApiError";
import { validateEmail, validatePassword } from "../utils/validators";

export interface User {
  id?: string;
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
    const backendCode = error.response?.data?.code;
    const backendMessage = error.response?.data?.message;

    if (backendCode && backendMessage) {
      throw new ApiError(status ?? 0, backendCode, backendMessage);
    }

    switch (status) {
      case 400:
        throw new ApiError(400, "BAD_REQUEST", "Requête invalide. Vérifiez les champs.");
      case 403:
        throw new ApiError(403, "WRONG_PASSWORD", "Email ou mot de passe incorrect.");
      case 404:
        throw new ApiError(404, "NOT_FOUND", "Utilisateur introuvable.");
      case 409:
        throw new ApiError(409, "EMAIL_EXISTS", "Un compte existe déjà avec cet email.");
      case 423:
        throw new ApiError(423, "ACCOUNT_LOCKED", "Votre compte est verrouillé.");
      case 500:
        throw new ApiError(500, "INTERNAL_ERROR", "Erreur interne du serveur.");
      default:
        throw new ApiError(status ?? 0, "SERVER_ERROR", "Une erreur inattendue est survenue.");
    }
  }

  console.log("🔥 NON AXIOS ERROR:", error);

  throw new ApiError(0, "NETWORK_ERROR", "Problème réseau.");
}


function validateCredentials(email: string, password: string) {
  const emailError = validateEmail(email);
  if (emailError) throw new ApiError(0, "VALIDATION_ERROR", emailError);

  const passwordError = validatePassword(password);
  if (passwordError) throw new ApiError(0, "VALIDATION_ERROR", passwordError);
}

export const authService = {
  register: async (userData: RegisterData): Promise<void> => {
    validateCredentials(userData.email, userData.password);

    try {
      await publicApiClient.post("/auth/register", userData);
    } catch (error) {
      handleAuthError(error);
    }
  },

  login: async (email: string, password: string): Promise<void> => {
    validateCredentials(email, password);

    try {
      const response = await publicApiClient.post<LoginResponse>(
        "/auth/login",
        { email, password }
      );

      await storage.set("userToken", response.data.jwt);
      await storage.set("user", JSON.stringify({ email }));
    } catch (error) {
      handleAuthError(error);
    }
  },

  logout: async (): Promise<void> => {
    await storage.remove("userToken");
    await storage.remove("user");
  },

  getStoredUser: async (): Promise<User | null> => {
    try {
      const userJson = await storage.get("user");
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await storage.get("userToken");
    return !!token;
  },
};