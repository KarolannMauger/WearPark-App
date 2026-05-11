import React, { createContext, useState, useEffect, useContext, ReactNode, } from "react";
import { useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { authService } from "@/src/services/authService";
import { userService } from "@/src/services/userService";
import { User } from "@/src/types/user";
import { View, ActivityIndicator } from "react-native";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;

  const validDate =
    !!user.dateOfBirth &&
    !isNaN(new Date(user.dateOfBirth).getTime());

  return !!(user.firstName && user.lastName && validDate);
};

const normalizeUser = (user: User): User => ({
  ...user,
  userPreferences: {
    monthlyReportEmail:
      user.userPreferences?.monthlyReportEmail ?? false,
    reportRecipients:
      user.userPreferences?.reportRecipients ?? [],
  },
});


export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();


  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (token) {
        const profile = await userService.getProfile();
        setUser(normalizeUser(profile));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (isLoading) return;

    const segment = segments[0];
    const isWelcome = !segment || segment === "index";
    const isAuth =
      segment === "login" || segment === "register";
    const isCompleteProfile =
      segment === "complete-profile";

    if (!user && !isAuth && !isWelcome) {
      router.push("/");
      return;
    }

    if (
      user &&
      !isProfileComplete(user) &&
      !isCompleteProfile
    ) {
      router.push("/completeProfile");
      return;
    }

    if (
      user &&
      isProfileComplete(user) &&
      isAuth
    ) {
      router.push("/(tabs)/home");
      return;
    }
  }, [user, segments, isLoading]);


  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await authService.login(email, password);
      const profile = await userService.getProfile();
      setUser(normalizeUser(profile));
    } catch (error) {
      console.error("Login error in UserContext:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await authService.register({ email, password });
      await authService.login(email, password);

      const profile = await userService.getProfile();
      setUser(normalizeUser(profile));

      router.push("/complete-profile");
    } catch (error) {
      console.error("Register error in UserContext:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  // Update local state seulement (après refetch)
  const updateUser = (updatedUser: User): void => {
    setUser(normalizeUser(updatedUser));
  };


  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUser must be used within a UserProvider"
    );
  }
  return context;
}