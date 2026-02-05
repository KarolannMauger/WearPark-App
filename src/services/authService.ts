import { publicApiClient } from './api';
import * as SecureStore from 'expo-secure-store';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// LOGIN - Public
export const login = async (email: string, password: string) => {
  const response = await publicApiClient.post<LoginResponse>('/auth/login', { 
    email, 
    password 
  });
  
  // Sauvegarder le token de manière sécurisée
  await SecureStore.setItemAsync('userToken', response.data.token);
  
  return response.data.user;
};

// REGISTER - Public
export const register = async (email: string, password: string, name: string) => {
  const response = await publicApiClient.post('/auth/register', { 
    email, 
    password, 
    name 
  });
  return response.data;
};

// LOGOUT
export const logout = async () => {
  await SecureStore.deleteItemAsync('userToken');
};