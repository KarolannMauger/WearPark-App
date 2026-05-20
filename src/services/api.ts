import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { storage } from "@/src/utils/storage";
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
// PRIVATE API - Autres routes
// ========================================
export const privateApiClient: AxiosInstance = axios.create(baseConfig);

privateApiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.get('userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      return Promise.reject(new Error('Authentication required'));
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

privateApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await storage.remove('userToken');
      await storage.remove('user');
    }

    return Promise.reject(error);
  }
);

export default publicApiClient;