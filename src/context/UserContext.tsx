import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/src/services/authService';
import { userService, User as BackendUser } from '@/src/services/userService';
import { View, ActivityIndicator } from 'react-native';

export interface User extends BackendUser {
  profileComplete?: boolean;
  preferences: {
    monthlyReportEmail: boolean;
    reportRecipients: string[];
  };
}

// Vérifie si le profil est complet
const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;
  const validDate = !!user.dateOfBirth && !isNaN(new Date(user.dateOfBirth).getTime());
  return !!(user.firstName && user.lastName && validDate);
};

// Normalisation du profil (null → valeurs par défaut)
const normalizeUserPreferences = (user: BackendUser) => ({
  ...user,
  preferences: {
    monthlyReportEmail: user.preferences?.monthlyReportEmail ?? false,
    reportRecipients: user.preferences?.reportRecipients ?? [],
  },
});

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

    const segment = segments[0];
    const isWelcome = !segment || segment === 'index';
    const isAuth = segment === 'login' || segment === 'register';
    const isCompleteProfile = segment === 'complete-profile';

    if (!user && !isAuth && !isWelcome) {
      router.replace('/');
      return;
    }

    if (user && !isProfileComplete(user) && !isCompleteProfile) {
      router.replace('/complete-profile');
      return;
    }

    if (user && isProfileComplete(user) && isAuth) {
      router.replace('/(tabs)/home');
      return;
    }
  }, [user, segments, isLoading]);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const profile = await userService.getProfile();
        setUser({ ...normalizeUserPreferences(profile), profileComplete: isProfileComplete(profile) });
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
      const profile = await userService.getProfile();
      setUser({ ...normalizeUserPreferences(profile), profileComplete: isProfileComplete(profile) });
    } catch (error) {
      console.error('Login error in UserContext:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      await authService.register({ email, password });
      await authService.login(email, password);
      const profile = await userService.getProfile();
      setUser({ ...normalizeUserPreferences(profile), profileComplete: isProfileComplete(profile) });
      router.replace('/complete-profile');
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
    setUser(prev => ({ ...prev, ...userData } as User));
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
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}