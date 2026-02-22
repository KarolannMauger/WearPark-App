import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/src/services/authService';
import { View, ActivityIndicator } from 'react-native';

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dateOfBirth?: string;
  hasDiagnostic?: boolean;
  disease?: string;
  preferences?: {
    monthlyReportEmail: boolean;
    reportRecipients: string[];
  };
  profileComplete?: boolean;
}

const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;
  // Vérifier si les champs obligatoires sont remplis
  return !!(user.firstName && user.lastName && user.dateOfBirth);
};

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isWelcome = !segments[0] || segments[0] === 'index';
    const isAuth = segments[0] === 'login' || segments[0] === 'register';
    const isCompleteProfile = segments[0] === 'complete-profile';

    if (isWelcome || isCompleteProfile) return;

    // non connecté et pas sur route publique → retour welcome
    if (!user && !isAuth) {
      router.replace('/');
    }
    // connecté mais profil incomplet → complete-profile
    else if (user && !isProfileComplete(user) && !isCompleteProfile) {
      router.replace('/completeProfile');
    }
    // connecté avec profil complet et sur route auth → home
    else if (user && isProfileComplete(user) && isAuth) {
      router.replace('/(tabs)/home');
    }
  }, [user, segments, isLoading]);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const storedUser = await authService.getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await authService.login(email, password);

      const storedUser = await authService.getStoredUser();

      setUser(storedUser);
    } catch (error) {
      console.error('Login error in UserContext:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      // création compte
      await authService.register({ email, password });

      // login automatique
      await authService.login(email, password);

      const storedUser = await authService.getStoredUser();
      setUser(storedUser);

      router.replace('/completeProfile');
    } catch (error) {
      console.error('Register error in UserContext:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    const updatedUser = { ...user, ...userData } as User;
    setUser(updatedUser);

    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <UserContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}