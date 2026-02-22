import { publicApiClient } from './api';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface LoginResponse {
  jwt: string;
}

interface RegisterData {
  email: string;
  password: string;
}

export const authService = {
  register: async (userData: RegisterData): Promise<void> => {
    await publicApiClient.post('/auth/register', userData);
  },

  login: async (email: string, password: string): Promise<void> => {
    
    const response = await publicApiClient.post<LoginResponse>('/auth/login', { 
      email, 
      password 
    });
    
    await SecureStore.setItemAsync('userToken', response.data.jwt);
    
    await AsyncStorage.setItem('user', JSON.stringify({ email }));
  },

  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync('userToken');
    await AsyncStorage.removeItem('user');
  },

  getStoredUser: async (): Promise<{ email: string } | null> => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      return user;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = await SecureStore.getItemAsync('userToken');
    return !!token;
  },
};