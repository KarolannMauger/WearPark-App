import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/src/services/authService';
import { View, ActivityIndicator } from 'react-native';

interface UserContextType {
  user: { email: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
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

    // Ne rien faire si sur welcome
    if (isWelcome) return;

    // Rediriger uniquement sur les autres routes
    if (!user && !isAuth) {
      router.replace('/');  // Retour vers welcome
    } else if (user && isAuth) {
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

      setUser({ email });
    } catch (error) {
      console.error('❌ Login error in UserContext:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
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