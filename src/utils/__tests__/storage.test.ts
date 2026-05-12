import { storage } from "../storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("storage", () => {
  const key = "testKey";
  const value = "testValue";

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("WEB", () => {
    beforeEach(() => {
      (Platform as any).OS = "web";
    });

    it("get → returns value from localStorage", async () => {
      localStorage.setItem(key, value);

      const result = await storage.get(key);

      expect(result).toBe(value);
    });

    it("set → stores value in localStorage", async () => {
      await storage.set(key, value);

      expect(localStorage.getItem(key)).toBe(value);
    });

    it("remove → deletes value from localStorage", async () => {
      localStorage.setItem(key, value);

      await storage.remove(key);

      expect(localStorage.getItem(key)).toBeNull();
    });
  });

  describe("NATIVE", () => {
    beforeEach(() => {
      (Platform as any).OS = "ios";
    });

    it("get → calls SecureStore.getItemAsync", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(value);

      const result = await storage.get(key);

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });

    it("set → calls SecureStore.setItemAsync", async () => {
      await storage.set(key, value);

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(key, value);
    });

    it("remove → calls SecureStore.deleteItemAsync", async () => {
      await storage.remove(key);

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key);
    });
  });

  describe("error handling", () => {
    beforeEach(() => {
      (Platform as any).OS = "ios";
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("get → returns null on error", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      const result = await storage.get(key);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("set → does not throw on error", async () => {
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      await expect(storage.set(key, value)).resolves.toBeUndefined();
      expect(console.error).toHaveBeenCalled();
    });

    it("remove → does not throw on error", async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      await expect(storage.remove(key)).resolves.toBeUndefined();
      expect(console.error).toHaveBeenCalled();
    });
  });
});