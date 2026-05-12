import { authService } from "../authService";
import { publicApiClient } from "../api";
import { storage } from "@/src/utils/storage";
import axios from "axios";

jest.mock("../api", () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    publicApiClient: mockAxiosInstance,
    privateApiClient: mockAxiosInstance,
  };
});
jest.mock("@/src/utils/storage");
jest.mock("axios");

const mockedApi = publicApiClient as jest.Mocked<typeof publicApiClient>;
const mockedStorage = storage as jest.Mocked<typeof storage>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("authService", () => {
  const validEmail = "test@mail.com";
  const validPassword = "Password1!";

  beforeEach(() => {
    jest.clearAllMocks();

    mockedAxios.isAxiosError.mockImplementation(
      (error: any) => !!error?.isAxiosError
    );
  });

  describe("register", () => {
    it("throws EMAIL_EXISTS on 409", async () => {
      mockedApi.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 409 },
      });

      await expect(
        authService.register({ email: validEmail, password: validPassword })
      ).rejects.toMatchObject({ code: "EMAIL_EXISTS" });
    });

    it("throws INTERNAL_ERROR on 500", async () => {
      mockedApi.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 500 },
      });

      await expect(
        authService.register({ email: validEmail, password: validPassword })
      ).rejects.toMatchObject({ code: "INTERNAL_ERROR" });
    });

    it("throws NETWORK_ERROR when no response", async () => {
      mockedApi.post.mockRejectedValue(new Error("Network error"));

      await expect(
        authService.register({ email: validEmail, password: validPassword })
      ).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    });
  });

  describe("login", () => {
    it("throws WRONG_PASSWORD on 403", async () => {
      mockedApi.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 403 },
      });

      await expect(
        authService.login(validEmail, validPassword)
      ).rejects.toMatchObject({ code: "WRONG_PASSWORD" });
    });

    it("throws NOT_FOUND on 404", async () => {
      mockedApi.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 404 },
      });

      await expect(
        authService.login(validEmail, validPassword)
      ).rejects.toMatchObject({ code: "NOT_FOUND" });
    });

    it("throws ACCOUNT_LOCKED on 423", async () => {
      mockedApi.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 423 },
      });

      await expect(
        authService.login(validEmail, validPassword)
      ).rejects.toMatchObject({ code: "ACCOUNT_LOCKED" });
    });

    it("throws INTERNAL_ERROR on 500", async () => {
      mockedApi.post.mockRejectedValue({
        isAxiosError: true,
        response: { status: 500 },
      });

      await expect(
        authService.login(validEmail, validPassword)
      ).rejects.toMatchObject({ code: "INTERNAL_ERROR" });
    });

    it("throws NETWORK_ERROR when no response", async () => {
      mockedApi.post.mockRejectedValue(new Error("Network error"));

      await expect(
        authService.login(validEmail, validPassword)
      ).rejects.toMatchObject({ code: "NETWORK_ERROR" });
    });

    it("stores token and user on success", async () => {
      mockedApi.post.mockResolvedValue({
        data: { jwt: "fake-jwt-token" },
      });

      await authService.login(validEmail, validPassword);

      expect(mockedStorage.set).toHaveBeenCalledWith(
        "userToken",
        "fake-jwt-token"
      );

      expect(mockedStorage.set).toHaveBeenCalledWith(
        "user",
        JSON.stringify({ email: validEmail })
      );
    });
  });

  describe("logout", () => {
    it("removes token and user", async () => {
      await authService.logout();

      expect(mockedStorage.remove).toHaveBeenCalledWith("userToken");
      expect(mockedStorage.remove).toHaveBeenCalledWith("user");
    });
  });

  describe("getStoredUser", () => {
    it("returns null if no user", async () => {
      mockedStorage.get.mockResolvedValue(null);

      const user = await authService.getStoredUser();

      expect(user).toBeNull();
    });

    it("returns parsed user", async () => {
      const mockUser = { email: validEmail };

      mockedStorage.get.mockResolvedValue(JSON.stringify(mockUser));

      const user = await authService.getStoredUser();

      expect(user).toEqual(mockUser);
    });
  });

  describe("isAuthenticated", () => {
    it("returns true if token exists", async () => {
      mockedStorage.get.mockResolvedValue("token");

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it("returns false if no token", async () => {
      mockedStorage.get.mockResolvedValue(null);

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});