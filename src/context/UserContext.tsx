import React, { createContext, useState, useEffect, useContext, ReactNode, } from "react";
import { useRouter, useSegments } from "expo-router";
import { storage } from "@/src/utils/storage";
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

const getHomeRoute = (user: User) => {
  if (user.role === "ADMIN") return "/admin/dashboard";
  return "/(tabs)/home";
};

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
      const token = await storage.get("userToken");

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

    const isAdminGroup = segment === "(admin)";
    const isWelcome = !segment || segment === "index";
    const isCompleteProfile = segments.includes("complete-profile");

    const isAuth = segment === "(auth)";

    if (!user && !isAuth && !isWelcome) {
      router.replace("/");
      return;
    }

    if (!user) return;

    if (isAdminGroup && user.role !== "ADMIN") {
      router.replace("/(tabs)/home");
      return;
    }

    if (user.role === "ADMIN") {
      if (isAuth || isWelcome) {
        router.replace("/admin/dashboard");
      }
      return;
    }

    if (!isProfileComplete(user) && !isCompleteProfile) {
      router.replace("/(auth)/complete-profile");
      return;
    }

    if (isProfileComplete(user) && isAuth) {
      router.replace("/(tabs)/home");
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
      const normalized = normalizeUser(profile);

      setUser(normalized);

      router.replace(getHomeRoute(normalized));
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
      const normalized = normalizeUser(profile);

      setUser(normalized);

      // Admin skip profile completion
      if (normalized.role === "ADMIN") {
        router.replace("/(admin)/home");
      } else {
        router.replace("/(auth)/complete-profile");
      }
    } catch (error) {
      console.error("Register error in UserContext:", error);
      throw error;
    }

  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    router.replace("/");
  };

  const updateUser = (updatedUser: User): void => {
    setUser(normalizeUser(updatedUser));
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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