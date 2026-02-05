import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService";
import * as SecureStore from "expo-secure-store";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    const { user: newUser } = await authService.register(userData);
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    return newUser;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
    await SecureStore.deleteItemAsync("userToken");
  };

  const updateUser = (userData) => {
    if (userData) {
      const updatedUser = user ? { ...user, ...userData } : userData;
      setUser(updatedUser);
      AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
