import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosError, 
  AxiosResponse 
} from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '@/src/config/env';

const baseConfig = {
  baseURL: ENV.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

if (ENV.debug) {
  console.log('API Base URL:', baseConfig.baseURL);
}
// ========================================
// PUBLIC API - Routes d'authentification
// ========================================
export const publicApiClient: AxiosInstance = axios.create(baseConfig);

// ========================================
// PRIVATE API - Toutes les autres routes
// ========================================
export const privateApiClient: AxiosInstance = axios.create(baseConfig);

// Ajouter le token automatiquement
privateApiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('userToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      return Promise.reject(new Error('Authentication required'));
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Gérer l'expiration du token
privateApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Supprimer le token expiré
      await SecureStore.deleteItemAsync('userToken');
      
      if (ENV.debug) {
        console.log('Session expirée - Token supprimé');
      }
      
      // Rediriger vers login
      // import { router } from 'expo-router';
      // router.replace('/login');
    }
    
    return Promise.reject(error);
  }
);

export default publicApiClient;