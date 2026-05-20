import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = () => Platform.OS === "web";

export const storage = {
  get: async (key: string): Promise<string | null> => {
    try {
      if (isWeb()) {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("Storage GET error:", error);
      return null;
    }
  },

  set: async (key: string, value: string): Promise<void> => {
    try {
      if (isWeb()) {
        localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("Storage SET error:", error);
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      if (isWeb()) {
        localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("Storage REMOVE error:", error);
    }
  },
};